import { Roles } from '@/core/decorators/role.decorator';
import { User } from '@/core/decorators/user.decorator';
import { RoleTypes } from '@/core/enums/role.enum';
import { AuthGuard } from '@/core/guards/auth.guard';
import { RolesGuard } from '@/core/guards/role.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBookDTO } from './dto/create-book.dto';
import { CreateBookCommand } from './application/commands/impl/create-book.command';
import { GetBookQuery } from './application/query/impl/get-book.query';
import { GetBookDTO } from './dto/get-book.dto';
import { DeleteBookCommand } from './application/commands/impl/delete-book.command';

@Controller('book')
export class BookController {
  constructor(
    private readonly commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleTypes.USER, RoleTypes.ADMIN)
  async getBook(@Param() { id }: GetBookDTO) {
    return await this.queryBus.execute(new GetBookQuery(id));
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleTypes.ADMIN)
  async createBook(@User() user, @Body() book: CreateBookDTO) {
    return await this.commandBus.execute(new CreateBookCommand(book, user.id));
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleTypes.USER, RoleTypes.ADMIN)
  async deleteBook(@User() user, @Param() { id }: GetBookDTO) {
    return await this.commandBus.execute(new DeleteBookCommand(id, user.id));
  }
}
