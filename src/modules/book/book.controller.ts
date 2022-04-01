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
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBookDTO } from './dto/create-book.dto';
import { CreateBookCommand } from './application/commands/impl/create-book.command';
import { GetBookQuery } from './application/query/impl/get-book.query';
import { GetBookDTO } from './dto/get-book.dto';
import { DeleteBookCommand } from './application/commands/impl/delete-book.command';
import { ApiTags } from '@nestjs/swagger';
import { SearchBookQuery } from './application/query/impl/search-book.query';

@Controller('book')
@ApiTags('Book')
export class BookController {
  constructor(
    private readonly commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleTypes.USER, RoleTypes.ADMIN)
  async searchBook(@Query() { name, id }: GetBookDTO) {
    if (name) {
      return await this.queryBus.execute(new SearchBookQuery(name));
    } else if (id) {
      return await this.queryBus.execute(new GetBookQuery(id));
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleTypes.ADMIN)
  async createBook(@User() user, @Body() book: CreateBookDTO) {
    return await this.commandBus.execute(new CreateBookCommand(book, user.id));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleTypes.ADMIN)
  async deleteBook(@User() user, @Param() { id }: GetBookDTO) {
    return await this.commandBus.execute(new DeleteBookCommand(id, user.id));
  }
}
