import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { databaseProviders } from './database/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forRoot(databaseProviders),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
