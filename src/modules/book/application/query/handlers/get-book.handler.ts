import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from '@modules/book/schemas/book.schema';
import { GetBookQuery } from '../impl/get-book.query';
import { Borrow, BorrowDocument } from '@/modules/borrow/schemas/borrow.schema';

@QueryHandler(GetBookQuery)
export class GetBookHandler implements IQueryHandler<GetBookQuery> {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Borrow.name) private borrowModel: Model<BorrowDocument>,
  ) {}

  async execute(query: GetBookQuery): Promise<Response.ReturnType<any>> {
    const data = await this.bookModel.findById(query.bookId);
    if (!data) throw new HttpException('Book not found', HttpStatus.NOT_FOUND);

    const borrowBook = await this.borrowModel.find({ bookId: query.bookId });
    const redc = borrowBook.reduce((acc, curr) => acc + curr.star, 0);

    const obj = {
      ...data.toObject(),
      star: redc,
    };

    return {
      message: 'Book found successfully',
      data: obj,
    };
  }
}
