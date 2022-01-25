import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create_user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { LoginUserDto } from 'src/users/dto/user_login.dto';
import { LoginResponse } from './interfaces/login_response.interface';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const user = await this.userService.loginUser(loginUserDto);

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const {accessToken, expired} = this.createToken();
    
    return {
      username: user.username,
      accessToken,
      expired
    };

  }

  private createToken(): any {

  }
}
