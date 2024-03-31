import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    HttpCode
  } from '@nestjs/common';
  import { ChatService } from './chat.service';
import { createthreadDTO } from './dto/create-thread.dto';

  @Controller('chat')
  export class ChatController {
    constructor(private readonly _chatService: ChatService) {}

    @Post()
     createThread(@Body() createthreadDTO: createthreadDTO) {
      console.log("JEREE")
        return this._chatService.createThread(createthreadDTO);
      }
    @Get(':id')
    getThreadById(@Param('id') id: string) {
      console.log("HERE")
      return this._chatService.getThreadMessages(+id);
    }
    @Get()
    getAllThreads() {}
  }