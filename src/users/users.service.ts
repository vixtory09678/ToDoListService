import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>
  ){}

  async create(user: UserEntity): Promise<UserEntity> {
    return this.userRepo.save(user);
  }

  async findByUserName(userName: string): Promise<UserEntity> {
    return this.userRepo.findOne({
      where: {
        'username': userName
      }
    });
  }
}
