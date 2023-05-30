import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetByParamDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: '2046f12a-37b3-4d17-b210-8b604e632f7e',
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 'João Felipe',
  })
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 'Mentor backend',
  })
  role: string;
}
