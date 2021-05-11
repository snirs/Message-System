import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { MessageStatus } from "./enum/message-status.enum";

@Entity()
export class Message extends BaseEntity {
    @PrimaryColumn() 
    id: string;

    @Column()
    sender: string;

    @Column()
    recciver: string;

    @Column()
    message: string;

    @Column()
    subject: string;

    @Column()
    creationDate: string;

    @Column()
    status: MessageStatus;

    @ManyToOne(type => User, user => user.messages, { eager: false })
    user: User
}