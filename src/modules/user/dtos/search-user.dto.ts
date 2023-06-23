import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'João Felipe',
  })
  fullName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'Mentor backend',
  })
  specialty: string;
}
