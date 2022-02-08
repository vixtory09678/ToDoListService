import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
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

  /**
   * Create a new user
   * @param {CreateUserDto} createUserDto - CreateUserDto
   * @returns A UserDto
   */
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

  /**
   * Login a user by username.
   * @param {string} username - string
   * @returns Nothing.
   */
  async loginUser(username: string): Promise<UserEntity> {
    try {
      const user = await this.userRepo.findOne({where: {username}});
      if (!user) throw new UnauthorizedException('User not found.');
      return user;
    } catch (err) {
      throw new BadRequestException('Request is invalid.');
    }
  }

  /**
   * Find a user by their username
   * @param {string} userName - string
   * @returns A UserDto
   */
  async findByUserName(userName: string): Promise<UserDto> {
    const resp = await this.userRepo.findOne({
      where: {
        'username': userName
      }
    });
    return this._toUserDto(resp);
  }

  /**
   * It converts a UserEntity to a UserDto.
   * @param {UserEntity} userEntity - The entity that is being converted to a DTO.
   * @returns A UserDto
   */
  private async _toUserDto(userEntity: UserEntity): Promise<UserDto>{
    return {
      id: userEntity.id,
      username: userEntity.username
    }
  }
}
