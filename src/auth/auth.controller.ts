import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDTO } from './dto/refresh.dto';
import { UserDTO } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() user: UserDTO) {
    return this.authService.register(user);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() user: UserDTO) {
    return this.authService.login(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/access')
  async getNewTokens(@Body() { refreshToken }: RefreshTokenDTO) {
    return this.authService.getNewTokens(refreshToken);
  }
}
