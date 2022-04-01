import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from '@modules/book/schemas/book.schema';
import { GetBookQuery } from '../impl/get-book.query';

@QueryHandler(GetBookQuery)
export class GetBookHandler implements IQueryHandler<GetBookQuery> {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async execute(query: GetBookQuery): Promise<Response.ReturnType<any>> {
    const data = await this.bookModel.findById(query.bookId);
    if (!data) throw new HttpException('Book not found', HttpStatus.NOT_FOUND);

    return {
      message: 'Book found successfully',
      data,
    };
  }
}
