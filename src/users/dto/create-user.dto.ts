import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
    @ApiProperty()
   readonly firstname:string;
   @ApiProperty()
   readonly lastname:string;
   @ApiProperty()
    readonly password:string;
    @ApiProperty()
    readonly email:string;
    @ApiProperty()
    readonly phone_no:string;
    @ApiProperty()
    readonly verified:boolean;
    @ApiProperty()
     accessToken?:string;
    @ApiProperty()
     refreshToken?:string;
    @ApiProperty()
    readonly role:string;
}
