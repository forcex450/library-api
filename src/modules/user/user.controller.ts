import { HttpExceptionFilter } from '@/core/filters/http-expection.filter';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  UsePipes,
  Param,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { JoiValidationPipe } from '@/core/pipes/validation.pipe';
import { AuthGuard } from '@/core/guards/auth.guard';
import { RolesGuard } from '@/core/guards/role.guard';
import { Roles } from '@/core/decorators/role.decorator';
import { RoleTypes } from '@/core/enums/role.enum';
import { LoginDTO } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleTypes.USER, RoleTypes.ADMIN)
  getAllUsers() {
    return this.userService.getAll();
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() userDTO: CreateUserDTO) {
    return this.userService.createUser(userDTO);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() userDTO: LoginDTO) {
    return this.userService.login(userDTO);
  }
}
