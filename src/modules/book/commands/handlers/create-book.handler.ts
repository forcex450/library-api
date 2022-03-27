import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookCommand } from '../impl/create-book.query';
import { Book, BookDocument } from '@modules/book/schemas/book.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

@CommandHandler(CreateBookCommand)
export class GetPersonsHandler implements ICommandHandler<CreateBookCommand> {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async execute(
    command: CreateBookCommand,
  ): Promise<Response.ReturnType<boolean>> {
    const exists = await this.bookModel.exists({
      author: command.uid,
      name: command.comment.name,
    });
    if (exists)
      throw new HttpException('Book already exists', HttpStatus.CONFLICT);

    command.comment.author = command.uid;
    const model = await this.bookModel.create(command.comment);
    await model.save();

    return {
      message: 'Book created successfully',
      data: true,
    };
  }
}
