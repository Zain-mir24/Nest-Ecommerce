import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from './entities/thread.entity';
import { Message } from './entities/message.entity';
import { ChatController } from './chat.controller';
@Module({
  imports:[TypeOrmModule.forFeature([Thread,Message])],
  providers: [ChatGateway, ChatService],
  controllers:[ChatController],

})
export class ChatModule {}
