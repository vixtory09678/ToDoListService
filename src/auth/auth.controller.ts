import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create_user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { LoginUserDto } from 'src/users/dto/user_login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() createUser: CreateUserDto) {
    createUser.password = Buffer.from(createUser.password, 'base64').toString();
    return this.authService.signup(createUser);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    loginUserDto.password = Buffer.from(loginUserDto.password, 'base64').toString();
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/info')
  async testGetInfo(): Promise<UserDto> {
    return null;
  }
}
