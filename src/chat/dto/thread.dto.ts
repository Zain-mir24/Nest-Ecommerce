import { ApiProperty } from '@nestjs/swagger';

export class threadDto{
    @ApiProperty()
    userIds: number[];
 

}