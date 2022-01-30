import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(
    private todoService: TodoService
  ){}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async addTodo() {

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getTodo() {

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
