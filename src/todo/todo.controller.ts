import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { editFileName, handleDestination, imageFileFilter } from 'src/utils/file_uploading.utils';
import { CreateTodoDto } from './dto/create_todo.dto';
import { TodoService } from './todo.service';
import { diskStorage } from 'multer'
import { UploadFile } from './interfaces/upload_file.interfaces';
import { User } from 'src/auth/decorators/user.decorator';
import { UserEntity } from 'src/users/entities/users.entity';
import { Todo } from './interfaces/todo.interface';
import { UpdateTodoDto } from './dto/update_todo.dto';
import { PublicTodo } from './interfaces/public_todo.interface';

@Controller('todo')
export class TodoController {
  constructor(
    private todoService: TodoService
  ){}

  @UseGuards(JwtAuthGuard)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: handleDestination,
      filename: editFileName,
    }),
    fileFilter: imageFileFilter
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<UploadFile> {
    return {
      fileName: file.filename
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async addTodo(@Body() createTodoDto: CreateTodoDto, @User() user: UserEntity) {
    await this.todoService.addTodo(user, createTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getTodo(@User() user: UserEntity): Promise<Todo[]> {
    return await this.todoService.getTodo(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getTodoById(@Param('id') id: string): Promise<Todo> {
    return await this.todoService.getTodoById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateTodo(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return this.todoService.updateTodo(id, updateTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteTodo(@Param('id') id: string): Promise<Todo> {
    return await this.todoService.deleteTodo(id);
  }

  @Get('/public/:publicLink')
  async getPublicTodo(@Param('publicLink') publicLink: string): Promise<Todo> {
    return await this.todoService.getPublicTodo(publicLink);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/public/:id')
  async getTodoPublicLink(@Param('id') id: string): Promise<PublicTodo> {
    return await this.todoService.getTodoPublicLink(id);
  }
}
