import { Roles } from '@/core/decorators/role.decorator';
import { User } from '@/core/decorators/user.decorator';
import { RoleTypes } from '@/core/enums/role.enum';
import { AuthGuard } from '@/core/guards/auth.guard';
import { RolesGuard } from '@/core/guards/role.guard';
import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BorrowService } from './borrow.service';
import { RemoveBorrowDTO } from './dto/remove-borrow.dto';

@Controller('borrow')
@ApiTags('Borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleTypes.USER, RoleTypes.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async borrowBook(
    @User() user,
    @Param('id') id: string,
  ): Promise<Response.ReturnType<boolean>> {
    return await this.borrowService.borrowBook(id, user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleTypes.USER, RoleTypes.ADMIN)
  @HttpCode(HttpStatus.OK)
  async delete(
    @User() user,
    @Body() field: RemoveBorrowDTO,
    @Param('id') id: string,
  ): Promise<Response.ReturnType<boolean>> {
    return await this.borrowService.delete(id, field, user.id);
  }
}
