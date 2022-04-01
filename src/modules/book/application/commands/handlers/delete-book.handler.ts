import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from '@modules/book/schemas/book.schema';
import { DeleteBookCommand } from '../impl/delete-book.command';
import { User, UserDocument } from '@/modules/user/schemas/user.schema';
import { RoleTypes } from '@/core/enums/role.enum';

@CommandHandler(DeleteBookCommand)
export class DeleteBookHandler implements ICommandHandler<DeleteBookCommand> {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async execute(
    command: DeleteBookCommand,
  ): Promise<Response.ReturnType<boolean>> {
    const exists = await this.bookModel.findById(command.bookId);
    if (!exists)
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);

    const user = await this.userModel.findById(exists.createdByUserId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const match =
      user.role >= RoleTypes.ADMIN || exists.createdByUserId === command.userId;
    if (!match)
      throw new HttpException(
        'You are not authorized to delete this book',
        HttpStatus.UNAUTHORIZED,
      );

    await this.bookModel.findByIdAndDelete(command.bookId);

    return {
      message: 'Book deleted successfully',
      data: true,
    };
  }
}
