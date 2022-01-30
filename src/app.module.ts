import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { databaseProviders } from './database/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forRoot(databaseProviders),
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
