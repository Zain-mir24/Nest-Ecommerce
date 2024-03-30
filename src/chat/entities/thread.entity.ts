// thread.entity.ts
import { Entity, PrimaryGeneratedColumn, Column,  OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Message } from './message.entity';

@Entity('thread')
export class Thread {
  @PrimaryGeneratedColumn()
  Tid: number;

  @Column({ type: 'integer',array:true})
  userIds: number[]; // Array to hold user IDs

  @OneToMany(() => Message, message => message.thread)
  messages: Message[];
}
