import { ApiProperty } from '@nestjs/swagger';
export class createMessageDTO{
    @ApiProperty()
    message:string;
    @ApiProperty()
    senderId:number;
    @ApiProperty()
    threadId:number

}