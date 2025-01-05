import { BaseEntity,Column,Entity,JoinColumn,ManyToOne,PrimaryGeneratedColumn } from "typeorm";
import { Thread } from "./thread.entity";
import { User } from "src/users/entities/user.entity";
@Entity("message")
export class  Message {
    @PrimaryGeneratedColumn({
        comment: 'Unique message',
      })
    Mid:number;

    @Column()
    content:string;

    @Column()
    senderId:number //userID

    @Column()
    threadId: number; // Directly store the thread's ID

    @ManyToOne(()=>User)
    @JoinColumn({name:"senderId",referencedColumnName: 'id'})
    sender:User;

    @ManyToOne(() => Thread)
    @JoinColumn({ name: "threadId",referencedColumnName:'Tid' }) // Specify the foreign key column
    thread: Thread; // Establish ManyToOne relationship with Thread entity

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    sentAt: Date;

}
