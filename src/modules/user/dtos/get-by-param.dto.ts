import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetByParamDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: '4edeaf86-49e0-4e48-a0a2-39c883f559ae',
  })
  id: string;
}
