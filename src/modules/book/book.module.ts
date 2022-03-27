import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { UserSchema } from '@modules/user/schemas/user.schema';
import { BookSchema } from './schemas/book.schema';
import { GetPersonsHandler } from './commands/handlers/create-book.handler';
import config from '@config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Book', schema: BookSchema },
    ]),
    JwtModule.register({
      secret: config.secret,
    }),
    CqrsModule,
  ],
  controllers: [BookController],
  providers: [BookService, GetPersonsHandler],
  exports: [BookService],
})
export class BookModule {}
