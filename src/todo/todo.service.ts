import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create_todo.dto';
import { TodoEntity } from './entities/todo.entity';
import { Todo } from './interfaces/todo.interface';

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

  async getTodo(user: UserEntity): Promise<Todo[]> {
    const todoEntity = await this.todoRepo.find({
      select: ['id', 'name', 'detail', 'pictureUrl', 'isDone', 'createdAt'],
      where: { user } 
    })

    if(!todoEntity) {
      throw new NotFoundException('Data not found');
    }

    let todoList: Todo[] = [];

    todoEntity.forEach(todo => {
      todoList.push({
        id: todo.id,
        name: todo.name,
        detail: todo.detail,
        pictureUrl: todo.pictureUrl,
        isDone: todo.isDone,
        createdAt: todo.createdAt
      });
    })
    
    return todoList;
  }

  async getTodoById(todoId: string) {

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
