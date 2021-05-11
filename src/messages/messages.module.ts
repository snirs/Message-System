import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Message } from './message.entity';
import { MessageRepository } from './message.repository';
import { MessageController } from './messages.controller';
import { MessageService } from './messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, MessageRepository]),
    AuthModule,
  ],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
