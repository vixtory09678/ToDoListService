import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create_user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>
  ){}

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = this.findByUserName(createUserDto.username);
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

  async findByUserName(userName: string): Promise<UserDto> {
    this.userRepo.findOne({
      where: {
        'username': userName
      }
    });
    return null;
  }

  async _toUserDto(userEntity: UserEntity): Promise<UserDto>{
    return {
      id: userEntity.id,
      username: userEntity.username
    }
  }
}
