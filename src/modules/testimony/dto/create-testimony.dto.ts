import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTestimonyDto {
  @IsString()
  @IsNotEmpty({ message: "the 'userName' field must not be empty" })
  @MaxLength(50, { message: 'Maximum of 50 characters exceeded' })
  @ApiProperty({
    required: true,
    example: 'Fulano de tal',
  })
  userName: string;

  @IsString()
  @IsNotEmpty({ message: "the 'description' field must not be empty" })
  @MaxLength(100, { message: 'Maximum of 255 characters exceeded' })
  @ApiProperty({
    required: true,
    example: 'Minha experiência como mentor na SouJunior como (ponha sua especialidade) foi excelente',
  })
  description: string;
}