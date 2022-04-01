import { CreateBookDTO } from '@modules/book/dto/create-book.dto';

export class CreateBookCommand {
  constructor(
    public readonly comment: CreateBookDTO,
    public readonly uid: string,
  ) {}
}
