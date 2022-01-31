import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    let pictureUrl = ''
    
    if (createTodoDto.pictureName)
      // use static url; edit later
      pictureUrl = 'todo-service/images/' + createTodoDto.pictureName;

    const todoEntity:TodoEntity = this.todoRepo.create({
      user,
      name: createTodoDto.name,
      detail: createTodoDto.detail,
      pictureUrl
    })
    return this.todoRepo.save(todoEntity);
  }

  async getTodo(user: UserEntity): Promise<Todo[]> {
    const todoEntities = await this.todoRepo.find({
      select: ['id', 'name', 'detail', 'pictureUrl', 'isDone', 'createdAt'],
      where: { user } 
    })

    if(!todoEntities) {
      throw new BadRequestException('Todo is not exist');
    }

    let todoList: Todo[] = [];

    todoEntities.forEach(entity => {
      todoList.push(this._toToDo(entity));
    })
    return todoList;
  }

  async getTodoById(id: string): Promise<Todo> {
    const todoEntity = await this.todoRepo.findOne({
      select: ['id', 'name', 'detail', 'pictureUrl', 'isDone', 'createdAt'],
      where: { id } 
    })

    if (!todoEntity) {
      throw new BadRequestException('Todo is not exist');
    }
    return this._toToDo(todoEntity);
  }

  async updateTodo() {
    // TODO will add later
  }

  async deleteTodo(id: string) {
    const todo: TodoEntity = await this.todoRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!todo) {
      throw new BadRequestException('Todo is not exist')
    }

    await this.todoRepo.delete({ id })
    return this._toToDo(todo);
  }


  async getPublicTodo() {
    // TODO will add later
  }

  async getTodoPublicLink() {
    // TODO will add later
  }

  private _toToDo(todo: TodoEntity): Todo {
    return {
      id: todo.id,
      name: todo.name,
      detail: todo.detail,
      pictureUrl: todo.pictureUrl,
      isDone: todo.isDone,
      createdAt: todo.createdAt
    }
  }
}
