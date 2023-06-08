import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ActiveUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: 'dddd',
  })
  code: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    required: true,
    example: 'abc@teste.com',
  })
  email: string;
}
