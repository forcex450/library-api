import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { validate } from '@core/config/validation';
import config from '@config';
import { BookModule } from '@modules/book/book.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    MongooseModule.forRoot(config.database.uri),
    UserModule,
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
