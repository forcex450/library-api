export class DeleteBookCommand {
  constructor(public readonly bookId: string, public readonly userId: string) {}
}
