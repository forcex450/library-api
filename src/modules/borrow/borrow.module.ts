import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema } from '../book/schemas/book.schema';
import { UserSchema } from '../user/schemas/user.schema';
import { BorrowController } from './borrow.controller';
import { BorrowService } from './borrow.service';
import { BorrowSchema } from './schemas/borrow.schema';
import config from '@config';

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
  ],
  controllers: [BorrowController],
  providers: [BorrowService],
})
export class BorrowModule {}
