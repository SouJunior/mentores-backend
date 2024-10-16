import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SearchByEmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 'email@email.com',
  })
  email: string;
}