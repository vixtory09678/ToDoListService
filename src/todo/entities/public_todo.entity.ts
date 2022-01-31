import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { TodoEntity } from './todo.entity';

@Entity()
export class PublicTodoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar', 
    nullable: false, 
  })
  publicLink: string

  @OneToOne(() => TodoEntity)
  @JoinColumn()
  todo: TodoEntity;

  @CreateDateColumn()
  createdAt?: Date;

  @BeforeInsert()
  async encodePublicLink() {
    this.publicLink = Buffer.from(this.id + this.todo.id).toString('base64');  
  }
}