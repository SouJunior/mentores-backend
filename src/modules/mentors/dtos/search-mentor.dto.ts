import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SearchMentorDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'João Felipe',
  })
  fullName: string;

  @IsOptional()
  @IsString()
  @MaxLength(30, { message: 'Maximum of 30 characters exceeded' })
  @ApiProperty({
    required: false,
    example: 'Backend',
  })
  specialty: string;
}
