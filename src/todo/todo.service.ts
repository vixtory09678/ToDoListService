import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create_todo.dto';
import { UpdateTodoDto } from './dto/update_todo.dto';
import { PublicTodoEntity } from './entities/public_todo.entity';
import { TodoEntity } from './entities/todo.entity';
import { PublicTodo } from './interfaces/public_todo.interface';
import { Todo } from './interfaces/todo.interface';

@Injectable()
export class TodoService {

  constructor(
    @InjectRepository(TodoEntity) private readonly todoRepo: Repository<TodoEntity>,
    @InjectRepository(PublicTodoEntity) private readonly publicTodo: Repository<PublicTodoEntity>
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
    });

    return this.todoRepo.save(todoEntity);
  }

  async getTodo(user: UserEntity): Promise<Todo[]> {
    const todoEntities = await this.todoRepo.find({ user });

    if(!todoEntities) throw new BadRequestException('Todo is not exist');

    let todoList: Todo[] = [];
    todoEntities.forEach(entity => {
      todoList.push(this._toToDo(entity));
    });

    return todoList;
  }

  async getTodoById(id: string): Promise<Todo> {
    const todo: TodoEntity = await this._findTodoById(id);
    return this._toToDo(todo);
  }

  async updateTodo(id: string, updateTodo: UpdateTodoDto): Promise<Todo> {
    let todo: TodoEntity = await this._findTodoById(id);
    todo = this.todoRepo.create({
      id,
      ...updateTodo
    })
    await this.todoRepo.update({id}, todo)
    return this._toToDo(todo);
  }

  async deleteTodo(id: string) {
    const todo: TodoEntity = await this._findTodoById(id);
    await this.todoRepo.delete({ id });
    return this._toToDo(todo);
  }


  async getPublicTodo(publicLink: string): Promise<Todo> {
    const publicTodo: PublicTodoEntity = await this.publicTodo.findOne({ publicLink});
    if (!publicTodo) throw new NotFoundException();
    return this.getTodoById(publicTodo.todo.id);
  }

  async getTodoPublicLink(id: string): Promise<PublicTodo> {
    const todo: TodoEntity = await this._findTodoById(id);

    const publicTodo = await this.hasPublicTodo(todo);
    if (publicTodo) {
      return publicTodo;
    }

    const publicTodoEntity = this.publicTodo.create({ todo });
    return this._toPublicTodo(publicTodoEntity);
  }

  private async hasPublicTodo(todo: TodoEntity): Promise<PublicTodo> {
    const publicTodo = await this.publicTodo.findOne({todo});
    if (!publicTodo) return null;
    return this._toPublicTodo(publicTodo);
  }

  private _toToDo(todo: TodoEntity): Todo {
    return {
      id: todo.id,
      name: todo.name,
      detail: todo.detail,
      pictureUrl: todo.pictureUrl,
      isDone: todo.isDone,
      createdAt: todo.createdAt
    };
  }

  private async _findTodoById(id: string): Promise<TodoEntity> {
    const todoEntity = await this.todoRepo.findOne({ id })
    if (!todoEntity) throw new BadRequestException('Todo is not exist');
    return todoEntity;
  }

  private _toPublicTodo(publicTodo: PublicTodoEntity): PublicTodo {
    return {
      id: publicTodo.id,
      publicLink: publicTodo.publicLink,
      createdAt: publicTodo.createdAt
    };
  }
}
