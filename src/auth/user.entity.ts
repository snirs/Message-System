import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Message } from "src/messages/message.entity";

@Entity()
@Unique(['userName'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ unique: true })
    userName: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(type => Message, message => message.user, {eager: true})
    messages: Message[];

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

}