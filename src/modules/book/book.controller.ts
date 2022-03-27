import { Roles } from '@/core/decorators/role.decorator';
import { User } from '@/core/decorators/user.decorator';
import { RoleTypes } from '@/core/enums/role.enum';
import { AuthGuard } from '@/core/guards/auth.guard';
import { RolesGuard } from '@/core/guards/role.guard';
import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBookDTO } from './dto/create-book.dto';
import { CreateBookCommand } from './commands/impl/create-book.query';

@Controller('book')
export class BookController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleTypes.ADMIN)
  async createBook(@User() user, @Body() newPerson: CreateBookDTO) {
    return await this.commandBus.execute(
      new CreateBookCommand(newPerson, user.id),
    );
  }
}
