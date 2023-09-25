import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchMentorDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'João Felipe',
  })
  fullName: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true})
  @ArrayMinSize(1)
  @MaxLength(30, { each: true ,message: 'Maximum of 30 characters exceeded' })
  specialties: string[];
}
