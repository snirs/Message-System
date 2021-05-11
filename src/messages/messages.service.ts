import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageStatus } from './enum/message-status.enum';
import { v1 as uuid} from 'uuid';
import { exception } from 'console';
import { MessageRepository } from './message.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { User } from 'src/auth/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/auth/user.repository';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageRepository)
        private messageRepository: MessageRepository,
    ) {}

    async getMessages(filterUnread: boolean, user: User): Promise<Message[]> {
        return await this.messageRepository.getMessages(filterUnread, user)
    }

    async createNewMessage(messageDto: CreateMessageDto, user: User): Promise<Message> { // change call to repository
        return this.messageRepository.createMessage(messageDto, user);
    }

    async readMessage(user: User): Promise<Message> {
        const unreadMessages = await this.getMessages(true, user)
        if (unreadMessages.length > 0) {
            const message = unreadMessages.pop();
            message.status = MessageStatus.READ;
            await message.save();
            return message;
        } else {
            throw new NotFoundException(`No messages to read`);
        }
    }

    async deleteMessagebyId(id: string, user: User) {
        const message = await this.getMessageById(id);
        if (!message) {
            throw new NotFoundException(`Message with id ${id} not found`);
        } else if (!(message.sender === user.userName || message.recciver === user.userName)) {
            throw new UnauthorizedException();
        } else {
            const result = await this.messageRepository.delete(id);
            if(result.affected === 0) {
                throw new NotFoundException(`Message with id ${id} not found`);
            }
            return (`Message ${id} was seccessfully deleted`)
        }
    }

    async getMessageById(id: string): Promise<Message> {
        const found = await this.messageRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`Message with id ${id} not found`);
        }
        return found;
    }


}
