import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(registerInfo: {
    email: string;
    password: string;
  }): Promise<any> {
    const { email, password } = registerInfo;
    const user = await this.usersService.readOne({ email });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    return await this.usersService.create({ email, password });
  }

  async signIn(login: { email: string; password: string }): Promise<any> {
    const { email, password } = login;
    const user = await this.usersService.readOne({ email });

    if (!user || !user.password) {
      throw new HttpException('User not exist', HttpStatus.FORBIDDEN);
    }

    const unhashedPassword = await bcrypt.compare(password, user.password);

    if (!unhashedPassword) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const payload = { sub: user._id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
