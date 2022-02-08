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

  /**
   * Create a user
   * @param {CreateUserDto} createUserDto - CreateUserDto
   * @returns A user object.
   */
  async signup(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  /**
   * It takes in a LoginUserDto and returns a LoginResponse.
   * @param {LoginUserDto} loginUserDto - LoginUserDto
   * @returns A token
   */
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

  /**
   * It validates the user by checking if the user exists in the database.
   * @param {string} username - string
   * @returns a UserDto.
   */
  async validateUser(username: string): Promise<UserDto> {
    try {
      const user =  await this.userService.findByUserName(username);
      if (!user) throw new UnauthorizedException('Invalid token');
      return user;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  /**
   * Create a token for the user
   * @param {UserDto}  - username - The username of the user who is requesting a token.
   * @returns An object with two properties: accessToken and expiredIn.
   */
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
