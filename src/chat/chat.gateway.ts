import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private logger = new Logger('ChatGateway');
  constructor(private readonly chatService: ChatService) {}
  // it will be handled when a client connects to the server
  handleConnection(socket: Socket) {
    this.logger.log(`Socket connected: `);
  }

  // it will be handled when a client disconnects from the server
  handleDisconnect(socket: Socket) {
    this.logger.log(`Socket disconnected`);
  }
  @SubscribeMessage('send_message')
 async hanleMessage(@MessageBody() message_data: { content: string, senderId: number, threadId: number }) {
    this.logger.log('message recieved', message_data);


   const chat= await this.chatService.createMessage(message_data);
   if(!chat){
    this.server.emit(`new-message-${message_data.threadId}`, 'Message was not saved');
    return
   }
    this.server.emit(`new-message-${message_data.threadId}`, chat);

    return
  }
 
  @SubscribeMessage('create_thread')
  createThread(@MessageBody() data:any){
    // services where db are performed
    this.chatService.createThread(data);
  }
  
}
