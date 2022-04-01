import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from '../book/schemas/book.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { RemoveBorrowDTO } from './dto/remove-borrow.dto';
import { Borrow, BorrowDocument } from './schemas/borrow.schema';

@Injectable()
export class BorrowService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Borrow.name) private borrowModel: Model<BorrowDocument>,
  ) {}

  async borrowBook(
    bookId: string,
    userId: string,
  ): Promise<Response.ReturnType<boolean>> {
    const existingBook = await this.bookModel.findById(bookId);
    if (!existingBook)
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    if (existingBook.borrowedBy)
      throw new HttpException(
        'Book is already borrowed',
        HttpStatus.BAD_REQUEST,
      );

    const model = await this.borrowModel.create({
      bookName: existingBook.name,
      bookId: existingBook._id,
      userId,
      star: 0,
    });

    await model.save();
    await this.bookModel.updateOne({ _id: bookId }, { borrowedBy: model._id });

    return {
      message: 'Book borrowed successfully',
      data: true,
    };
  }

  async delete(
    bookId: string,
    field: RemoveBorrowDTO,
    userId: string,
  ): Promise<Response.ReturnType<boolean>> {
    const existingBook = await this.bookModel.findById(bookId);
    if (!existingBook)
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);

    const existingBorrow = await this.borrowModel
      .findOne({ _id: existingBook.borrowedBy, checked: false })
      .exec();
    if (!existingBorrow)
      throw new HttpException('Book is not borrowed', HttpStatus.BAD_REQUEST);
    if (existingBorrow.userId.toString() !== userId)
      throw new HttpException(
        'You are not the owner of this book',
        HttpStatus.BAD_REQUEST,
      );

    await this.borrowModel.updateOne(
      { _id: existingBook.borrowedBy, bookId, checked: false },
      {
        $set: {
          star: field.star,
          checked: true,
        },
      },
    );
    await this.bookModel.updateOne({ _id: bookId }, { borrowedBy: null });

    return {
      message: 'Book borrowed successfully',
      data: true,
    };
  }
}
