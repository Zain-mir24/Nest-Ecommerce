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
    async createThread(@Body() createthreadDTO: createthreadDTO) {
        return this._chatService.createThread(createthreadDTO);
      }
    @Get(':id')
    getThreadById() {}
    @Get()
    getAllThreads() {}
  }