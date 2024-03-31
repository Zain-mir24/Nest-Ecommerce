import { ApiProperty } from '@nestjs/swagger';
export class createMessageDTO{
    @ApiProperty()
    content:string;
    @ApiProperty()
    senderId:number;
    @ApiProperty()
    threadId:number

}