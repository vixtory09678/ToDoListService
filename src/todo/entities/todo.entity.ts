import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from 'src/users/entities/users.entity';

@Entity()
export class TodoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => UserEntity)
  userId: string;

  @Column({
    type: 'varchar', 
    nullable: false, 
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
}