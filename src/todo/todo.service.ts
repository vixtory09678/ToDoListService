import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/users.entity';
import { deleteFile } from 'src/utils/file_uploading.utils';
import { Connection, Repository } from 'typeorm';
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
    @InjectRepository(PublicTodoEntity) private readonly publicTodo: Repository<PublicTodoEntity>,
    private connection: Connection
  ) {}

  /**
   * It creates a new todo entity and saves it to the database.
   * @param {UserEntity} user - UserEntity
   * @param {CreateTodoDto} createTodoDto - CreateTodoDto
   * @returns Nothing.
   */
  async addTodo (user: UserEntity, createTodoDto: CreateTodoDto) {
    let picturePath = ''
    
    if (createTodoDto.pictureName)
      picturePath = '/' + createTodoDto.pictureName;

    const todoEntity:TodoEntity = this.todoRepo.create({
      user,
      name: createTodoDto.name,
      detail: createTodoDto.detail,
      picturePath
    });

    return this.todoRepo.save(todoEntity);
  }

  /**
   * Get all todo of a user
   * @param {UserEntity} user - UserEntity
   * @returns An array of Todo objects.
   */
  async getTodo(user: UserEntity): Promise<Todo[]> {
    const todoEntities = await this.todoRepo.find({ 
      where: {
        user
      },
      order: {
        createdAt: 'DESC'
      }
    });

    if(!todoEntities) throw new BadRequestException('Todo is not exist');

    let todoList: Todo[] = [];
    todoEntities.forEach(entity => {
      todoList.push(this._toToDo(entity));
    });

    return todoList;
  }

  /**
   * It returns a Todo object from a TodoEntity object.
   * @param {string} id - The id of the todo to be retrieved.
   * @returns A Todo object
   */
  async getTodoById(id: string): Promise<Todo> {
    const todo: TodoEntity = await this._findTodoById(id);
    return this._toToDo(todo);
  }

  /**
   * Update a todo
   * @param {string} id - string
   * @param {UpdateTodoDto} updateTodo - UpdateTodoDto
   * @returns The updated todo
   */
  async updateTodo(id: string, updateTodo: UpdateTodoDto): Promise<Todo> {
    let picturePath = ''
    if (updateTodo.pictureName)
      picturePath = '/' + updateTodo.pictureName;

    let todo: TodoEntity = await this._findTodoById(id);

    todo = this.todoRepo.create({ id,...updateTodo, picturePath })
    await this.todoRepo.update({id}, todo)

    return this._toToDo(todo);
  }

  /**
   * It deletes a todo from the database.
   * @param {string} id - The id of the todo to be deleted.
   * @returns Nothing.
   */
  async deleteTodo(id: string) {
    const todo: TodoEntity = await this._findTodoById(id);
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      await this.todoRepo.delete({ id });

      if (!deleteFile(todo.picturePath))
        throw new InternalServerErrorException('Server is can\'t delete file');

      await queryRunner.commitTransaction();
      return this._toToDo(todo);
      
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }


  /**
   * Get a public todo by its public link.
   * @param {string} publicLink - string
   * @returns A Todo object.
   */
  async getPublicTodo(publicLink: string): Promise<Todo> {
    const publicTodo: PublicTodoEntity = await this.publicTodo.findOne({
      where: { publicLink },
      relations: ['todo']
    });
    if (!publicTodo) throw new NotFoundException();

    return this.getTodoById(publicTodo.todo.id);
  }

  /**
   * "Get a public link to a todo."
   * 
   * The function is asynchronous because it uses the `await` keyword
   * @param {string} id - The id of the todo to get the public link for.
   * @returns A public todo
   */
  async getTodoPublicLink(id: string): Promise<PublicTodo> {
    const todo: TodoEntity = await this._findTodoById(id);

    const hasPublicTodo = await this.hasPublicTodo(todo);
    if (hasPublicTodo) {
      return hasPublicTodo;
    }

    const publicTodoEntity: PublicTodoEntity = this.publicTodo.create({ todo });

    const publicTodo = await this.publicTodo.save(publicTodoEntity);
    return this._toPublicTodo(publicTodo);
  }

  /**
   * "Given a todo, return the public todo if it exists, otherwise return null."
   * 
   * The function is asynchronous because it uses the `findOne` method of the `PublicTodoRepository`
   * @param {TodoEntity} todo - The todo entity to check for.
   * @returns A promise of a PublicTodo.
   */
  private async hasPublicTodo(todo: TodoEntity): Promise<PublicTodo> {
    try {
      const publicTodo = await this.publicTodo.findOne({
        where: { todo },
        relations: ['todo']
      });
      return this._toPublicTodo(publicTodo);
    } catch (err) {
      return null;
    }
  }

  /**
   * Convert a TodoEntity to a Todo
   * @param {TodoEntity} todo - TodoEntity
   * @returns An object with the same properties as the TodoEntity.
   */
  private _toToDo(todo: TodoEntity): Todo {
    return {
      id: todo.id,
      name: todo.name,
      detail: todo.detail,
      picturePath: todo.picturePath,
      isDone: todo.isDone,
      createdAt: todo.createdAt
    };
  }

  /**
   * Find a TodoEntity by its id
   * @param {string} id - The id of the todo to be deleted.
   * @returns TodoEntity.
   */
  private async _findTodoById(id: string): Promise<TodoEntity> {
    const todoEntity = await this.todoRepo.findOne({ id })
    if (!todoEntity) throw new BadRequestException('Todo is not exist');
    return todoEntity;
  }

  /**
   * It converts a public todo entity to a public todo.
   * @param {PublicTodoEntity} publicTodo - The publicTodo entity that we want to convert to a
   * publicTodo.
   * @returns A public todo object.
   */
  private _toPublicTodo(publicTodo: PublicTodoEntity): PublicTodo {
    return {
      id: publicTodo.id,
      publicLink: publicTodo.publicLink,
      createdAt: publicTodo.createdAt
    };
  }
}
