import { BadRequestException, Body, Controller, Delete, Get, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { editFileName, handleDestination, imageFileFilter } from 'src/utils/file_uploading.utils';
import { CreateTodoDto } from './dto/create_todo.dto';
import { TodoService } from './todo.service';
import { diskStorage } from 'multer'
import { UploadFile } from './interfaces/upload_file.interfaces';

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
  async addTodo(@Body() createTodoDto: CreateTodoDto) {
    
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getTodo() {
    return 'get todo'
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getTodoById() {

  }

  @UseGuards(JwtAuthGuard)
  @Put('/')
  async updateTodo() {

  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteTodo() {

  }

  @Get('/public/:id')
  async getPublicTodo() {

  }

  @UseGuards(JwtAuthGuard)
  @Post('/public')
  async getTodoPublicLink() {

  }
}
