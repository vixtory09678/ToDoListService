import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from 'src/users/entities/users.entity';

@Entity()
export class TodoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => UserEntity)
  user: UserEntity;

  @Column({
    type: 'varchar', 
    nullable: false, 
  })
  name: string

  @Column({
    type: 'varchar', 
    nullable: true, 
    default: ''
  })
  detail: string;

  @Column({
    type: 'varchar', 
    nullable: false, 
    default: ''
  })
  pictureUrl: string;

  @Column({
    type: 'bool', 
    nullable: false,
    default: false
  })
  isDone: Boolean;

  @CreateDateColumn()
  createdAt?: Date;
}