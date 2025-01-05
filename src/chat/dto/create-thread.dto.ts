import { ApiProperty } from '@nestjs/swagger';
import { Message } from '../entities/message.entity';
export class createthreadDTO{
@ApiProperty()
userIds:number[];
@ApiProperty()
messages?:Message[];
}