import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class GetByParamDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: '2046f12a-37b3-4d17-b210-8b604e632f7e',
  })
  id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 'João Felipe',
  })
  fullName: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @MaxLength(30, { each: true, message: 'Maximum of 30 characters exceeded' })
  @ApiProperty({
    required: true,
    example: 'Frontend, backend, qa, dev ops',
  })
  specialties: string[];
}
