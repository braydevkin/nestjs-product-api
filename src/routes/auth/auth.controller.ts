import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signIn(@Body() authDto: AuthDTO) {
    return this.authService.signIn(authDto);
  }

  @Post('/signup')
  signUp(@Body() authDto: AuthDTO) {
    return this.authService.signUp(authDto);
  }
}
