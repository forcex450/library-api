import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { BookController } from './book.controller';
import { UserSchema } from '@modules/user/schemas/user.schema';
import { BookSchema } from './schemas/book.schema';
import { CreateBookHandler } from './application/commands/handlers/create-book.handler';
import config from '@config';
import { GetBookHandler } from './application/query/handlers/get-book.handler';
import { DeleteBookHandler } from './application/commands/handlers/delete-book.handler';
import { BorrowSchema } from '../borrow/schemas/borrow.schema';
import { GetBooksHandler } from './application/query/handlers/search-book.query';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Book', schema: BookSchema },
      { name: 'Borrow', schema: BorrowSchema },
    ]),
    JwtModule.register({
      secret: config.secret,
    }),
    CqrsModule,
  ],
  controllers: [BookController],
  providers: [
    CreateBookHandler,
    DeleteBookHandler,
    GetBookHandler,
    GetBooksHandler,
  ],
})
export class BookModule {}
