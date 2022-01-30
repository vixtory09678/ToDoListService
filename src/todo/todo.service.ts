import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create_todo.dto';
import { TodoEntity } from './entities/todo.entity';

@Injectable()
export class TodoService {

  constructor(
    @InjectRepository(TodoEntity) private readonly todoRepo: Repository<TodoEntity>
  ) {}

  async addTodo (user: UserEntity, createTodoDto: CreateTodoDto) {
    const todoEntity:TodoEntity = this.todoRepo.create({
      user,
      ...createTodoDto
    })
    return this.todoRepo.save(todoEntity);
  }

  async getTodo() {

  }

  async getTodoById() {

  }

  async updateTodo() {

  }

  async deleteTodo() {

  }


  async getPublicTodo() {

  }

  async getTodoPublicLink() {

  }
}
