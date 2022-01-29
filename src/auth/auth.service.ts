import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create_user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { LoginUserDto } from 'src/users/dto/user_login.dto';
import { LoginResponse } from './interfaces/login_response.interface';
import { CreateToken } from './interfaces/create_token.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const user = await this.userService.loginUser(loginUserDto.username);

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const response: LoginResponse = {
      username: user.username,
      ...await this.createToken(user)
    }

    return response
  }

  async validateUser(username: string): Promise<UserDto> {
    const user =  await this.userService.findByUserName(username);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  private async createToken({username} : UserDto): Promise<CreateToken> {
    const expiredIn = process.env.JWT_EXPIRES_IN;
    const user = { username };
    const accessToken = this.jwtService.sign(user);
    return {
      accessToken,
      expiredIn,
    }
  }
}
