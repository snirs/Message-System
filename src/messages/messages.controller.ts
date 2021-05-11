import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageStatus } from './enum/message-status.enum';
import { Message } from './message.entity';
import {MessageService} from './messages.service'

@Controller('message')
@UseGuards(AuthGuard())
export class MessageController {
    constructor(private messageService: MessageService) {}

    @Get()
    getAllMessages(@GetUser() user: User):Promise<Message[]> {
        return this.messageService.getMessages(false, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createNewMessage(
        @Body() messageDto: CreateMessageDto,
        @GetUser() user: User
    ): Promise<Message> {
        return this.messageService.createNewMessage(messageDto, user);
    }

    @Get('unread')
    getUnreadMessages(@GetUser() user: User): Promise<Message[]> {
        return this.messageService.getMessages(true, user);
    }

    @Patch('/read')
    readMessage(@GetUser() user: User) {
        return this.messageService.readMessage(user)
    }

    @Delete('/:id/delete')
    deleteMessage(@Param('id') id: string, @GetUser() user: User) {
        return this.messageService.deleteMessagebyId(id, user)
    }
}
