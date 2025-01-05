import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createMessageDTO } from './dto/create-message.dto';
import { createthreadDTO } from './dto/create-thread.dto';
import { Thread } from './entities/thread.entity';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Exception } from 'handlebars';
import { PageOptionsDto } from 'src/common/dtos';
import { productDto } from 'src/Products/dtos/Products.dto';
import { PageDto } from 'src/common/page.dto';
import { PageMetaDto } from 'src/common/page.meta.dto';
import { threadDto } from './dto/thread.dto';
@Injectable()
export class ChatService {
  private logger = new Logger('ChatService');
  constructor(
    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  async createMessage(createMessage: createMessageDTO) {
    try {
      console.log(createMessage)
      // Create a new Thread instance
      const new_message = this.messageRepository.create(createMessage);

      console.log(new_message);
      // Save the new thread to the database
      const created_message = await this.messageRepository.save(new_message);
      if(!created_message){
        throw new Error("Message wasnt  saved")
      }
      let {Mid,...others}=created_message
      return others;
    } catch (e) {
      console.log(e)
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: e,
      }, HttpStatus.BAD_REQUEST, {
        cause: e
      });;
    }
  }

  async createThread(userIds: createthreadDTO): Promise<Thread> {
    try {
      // Create a new Thread instance
      const newThread = this.threadRepository.create(userIds);

      console.log(newThread);
      // Save the new thread to the database
      const createdThread = await this.threadRepository.save(newThread);

      return createdThread;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  
  async getAllThread(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<threadDto>> {
    const skip = (pageOptionsDto.page - 1) * pageOptionsDto.pageSize;
    let searchCondition: string;
    if (pageOptionsDto.search) {
      searchCondition = `product.title ILIKE %${pageOptionsDto.search}%`;
    }
   
    const all_chats=await this.threadRepository.createQueryBuilder('thread').orderBy('thread.Tid', pageOptionsDto.order === 'DESC' ? 'DESC' : 'ASC').offset(skip).limit(pageOptionsDto.pageSize)


    console.log("THREAD")
    const threads = await all_chats.getMany();
    const itemCountQuery = `SELECT COUNT(*) FROM thread`;

    const itemCountResult = await this.threadRepository.query(itemCountQuery);

    const itemCount = itemCountResult[0].count;

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(threads, pageMetaDto);
  }


  async getThreadMessages(threadId: number) {
    try {
      console.log(threadId)
    //  const query = `  SELECT thread.*, message.*
    //  FROM thread
    //  LEFT JOIN message ON thread.Tid = message.threadId
    //  WHERE thread.Tid = $1`;
    //  const results = await this.threadRepository.query(query, [threadId]);
      // Execute the raw SQL query with parameters
      
      const results = await this.threadRepository .createQueryBuilder('thread')
      .leftJoinAndSelect('thread.messages', 'message')
      .where('thread.Tid = :threadId', { threadId }) // Parameter binding
      .getOne();
  
      this.logger.log('HERERE', results);
      return results;
    } catch (e) {
      console.log(e)
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: e,
      }, HttpStatus.BAD_REQUEST, {
        cause: e
      });;
    }
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
