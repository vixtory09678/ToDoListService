import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { PublicTodoEntity } from "src/todo/entities/public_todo.entity"
import { TodoEntity } from "src/todo/entities/todo.entity"
import { UserEntity } from "src/users/entities/users.entity"
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

const databaseProviders: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'db_name',
  entities: [
    UserEntity,
    TodoEntity,
    PublicTodoEntity
  ],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: process.env.NODE_ENV !== 'prod',
}

export { databaseProviders }
