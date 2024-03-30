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
  hanleMessage(@MessageBody() message: string) {
    this.logger.log('message recieved', message);
    this.server.emit('chat', 'Sending message which is broadcast');
    // return this.chatService.create(message);
  }
 
  @SubscribeMessage('create_thread')
  createThread(@MessageBody() data:any){
    // services where db are performed
    this.chatService.createThread(data);
  }
  
}
