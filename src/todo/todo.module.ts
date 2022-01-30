import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TodoEntity } from './entities/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ TodoEntity ]),
    MulterModule.register({
      dest: '/uploads',
    })
  ],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
