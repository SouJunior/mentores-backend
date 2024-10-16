import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetByIdDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    type: 'uuid',
    required: true,
    example: '2046f12a-37b3-4d17-b210-8b604e632f7e',
  })
  id: string;
}
