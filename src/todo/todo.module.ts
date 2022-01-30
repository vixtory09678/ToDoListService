import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: '/uploads',
    })
  ],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
