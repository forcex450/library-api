import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import { CreateUserDTO } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { RoleTypes } from '@/core/enums/role.enum';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async getAll() {
    const users = await this.userModel.find({});
    const paths = ['_id', 'username', 'email'];
    const newUsers = [];

    for (let i = 0; i < users.length; i++) {
      let u = _.pick(users[i], paths);
      newUsers.push(u);
    }

    return {
      message: 'get all users',
      data: newUsers,
    };
  }

  async createUser(
    userDTO: CreateUserDTO,
  ): Promise<Response.ReturnType<string>> {
    const model = await this.userModel.exists({
      username: userDTO.username,
      email: userDTO.email,
    });
    if (model)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    userDTO.password = await bcryptjs.hash(userDTO.password, 10);
    const newUser = {
      ...userDTO,
      role: RoleTypes.USER,
    };

    let user = new this.userModel(newUser);
    await user.save();

    const token = this.createTokenForUser(user._id);

    return {
      message: 'User created successfully',
      data: token,
    };
  }

  async login(userDTO: LoginDTO): Promise<Response.ReturnType<string>> {
    const model = await this.userModel.findOne({
      email: userDTO.email,
    });
    if (!model) throw new HttpException('Not found user', HttpStatus.NOT_FOUND);

    const match = await bcryptjs.compare(userDTO.password, model.password);
    if (!match)
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);

    const token = this.createTokenForUser(model._id);

    return {
      message: 'Login successfully',
      data: token,
    };
  }

  createTokenForUser(id: string): string {
    let token = this.jwtService.sign({ uid: id });
    return token;
  }
}
