import { EntityRepository, Repository } from "typeorm";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageStatus } from "./enum/message-status.enum";
import { Message } from "./message.entity";
import { v1 as uuid} from 'uuid';
import { User } from "src/auth/user.entity";

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {

    async getMessages(filterUnread: boolean, user: User) : Promise<Message[]> {
        const query = this.createQueryBuilder('message')
        .where('message.sender = :userName', {userName: user.userName})
        .orWhere('message.recciver = :userName', {userName: user.userName})
        const messages = await query.getMany();
        if(filterUnread) {
            return messages.filter(message => message.status === MessageStatus.UNREAD);
        } else {
            return messages;
        }
    }
    
    async createMessage(messageDto: CreateMessageDto, user: User): Promise<Message> {
        const { recciver, message, subject} = messageDto;
        const newMessage = new Message();

        newMessage.id = uuid();
        newMessage.creationDate = Date.now().toFixed();
        newMessage.status = MessageStatus.UNREAD,
        newMessage.sender = user.userName,
        newMessage.recciver = recciver,
        newMessage.subject = subject,
        newMessage.message = message,
        newMessage.user = user

        await newMessage.save();
        delete newMessage.user;
        return newMessage;
    }
}