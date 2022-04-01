import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookCommand } from '../impl/create-book.command';
import { Book, BookDocument } from '@modules/book/schemas/book.schema';
import http from '@/core/axios/index';

@CommandHandler(CreateBookCommand)
export class CreateBookHandler implements ICommandHandler<CreateBookCommand> {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async execute(
    command: CreateBookCommand,
  ): Promise<Response.ReturnType<string>> {
    const exists = await this.bookModel.exists({
      createdByUserId: command.uid,
      name: command.comment.name,
    });
    if (exists)
      throw new HttpException('Book already exists', HttpStatus.CONFLICT);

    const data = (
      await http.get(
        `volumes?q=${encodeURIComponent(
          command.comment.name.toLocaleLowerCase(),
        )}`,
      )
    ).data;
    const book = data.items.find((item) => {
      let a = item.volumeInfo.title.toLocaleLowerCase();
      let b = command.comment.name.toLocaleLowerCase();

      return a === b;
    });
    if (!book) throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    let desc = book.volumeInfo.description
      ? book.volumeInfo.description
      : book.volumeInfo.subtitle;
    if (!desc) desc = 'No description available';

    const model = await this.bookModel.create({
      ...command.comment,
      author: book.volumeInfo.authors,
      description: desc,
      createdByUserId: command.uid,
    });
    await model.save();

    return {
      message: 'Book created successfully',
      data: model._id,
    };
  }
}
