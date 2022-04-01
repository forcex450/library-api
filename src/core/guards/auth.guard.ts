import { User } from '@modules/user/schemas/user.schema';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) return false;

    try {
      var user = this.jwtService.verify(token.replace('Bearer ', ''));
    } catch (err) {
      throw new BadRequestException();
    }
    const userModel = await this.userModel.findOne({ _id: user.uid });
    if (!userModel) return false;

    request.user = {
      id: userModel._id.toString(),
      username: userModel.username,
      email: userModel.email,
      role: userModel.role,
    };

    return true;
  }
}
