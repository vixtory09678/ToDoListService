import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ){}

  async create(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  async findByUserName(userName: string): Promise<User> {
    return this.userRepo.findOne({
      where: {
        'username': userName
      }
    });
  }
}
