import { Injectable } from '@nestjs/common';
import { createMessageDTO } from './dto/create-message.dto';
import { createthreadDTO } from './dto/create-thread.dto';
import { Thread } from './entities/thread.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
@Injectable()
export class ChatService {
  private logger = new Logger('ChatService');
  constructor(
    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,
  ) {}
  create(createMessageDto: createMessageDTO) {
    return 'This action adds a new chat';
  }

  async createThread(userIds: createthreadDTO): Promise<Thread> {
    try {
      // Create a new Thread instance
      const newThread = this.threadRepository.create(userIds);

      // Save the new thread to the database
      const createdThread = await this.threadRepository.save(newThread);

      return createdThread;
    } catch (e) {
      return e;
    }
  }

  async getAllThread() {
    try {
      let getData = await this.threadRepository.find();
    } catch (e) {}
  }

  async getAllThreadMessages(threadId: number) {
    try {
      const query = `
    SELECT * FROM thread
    LEFT JOIN message ON thread.Tid = message.threadId
    WHERE thread.Tid=$1
    `;
      // Execute the raw SQL query with parameters
      const results = await this.threadRepository.query(query, [threadId]);
      this.logger.log("HERERE",results)
    } catch (e) {}
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
