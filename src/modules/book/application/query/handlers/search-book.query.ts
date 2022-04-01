import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from '@modules/book/schemas/book.schema';
import { Borrow, BorrowDocument } from '@/modules/borrow/schemas/borrow.schema';
import { SearchBookQuery } from '../impl/search-book.query';
import http from '@core/axios/index';

@QueryHandler(SearchBookQuery)
export class GetBooksHandler implements IQueryHandler<SearchBookQuery> {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Borrow.name) private borrowModel: Model<BorrowDocument>,
  ) {}

  async execute(query: SearchBookQuery): Promise<Response.ReturnType<any>> {
    const data = (
      await http.get(
        `volumes?q=${encodeURIComponent(query.bookName.toLocaleLowerCase())}`,
      )
    ).data;

    return {
      message: 'Book found successfully',
      data: data.items.map((a) => {
        return {
          name: a.volumeInfo.title,
          description: a.volumeInfo.description,
          authors: a.volumeInfo.authors,
        };
      }),
    };
  }
}
