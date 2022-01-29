import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create_user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/user_login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>
  ){}

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userRepo.findOne({where: { username: createUserDto.username }})
    console.log(user);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const { username, password } = createUserDto
    const userEntity = await this.userRepo.create({
      username,
      password
    })

    const resp = await this.userRepo.save(userEntity);
    return this._toUserDto(resp);
  }

  async loginUser(username: string): Promise<UserEntity> {
    const user = await this.userRepo.findOne({where: {username}});
    if (!user) throw new UnauthorizedException('User not found.');

    return user;
  }

  async findByUserName(userName: string): Promise<UserDto> {
    const resp = await this.userRepo.findOne({
      where: {
        'username': userName
      }
    });
    return this._toUserDto(resp);
  }

  async _toUserDto(userEntity: UserEntity): Promise<UserDto>{
    return {
      id: userEntity.id,
      username: userEntity.username
    }
  }
}
