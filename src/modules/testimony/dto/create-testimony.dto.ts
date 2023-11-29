import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTestimonyDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "the 'userName' field must not be empty" })
  @MaxLength(50, { message: 'Maximum of 50 characters exceeded' })
  @ApiProperty({
    required: true,
    example: 'Fulano de tal',
  })
  userName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "the 'role' field must not be empty" })
  @MaxLength(50, { message: 'Maximum of 50 characters exceeded' })
  @ApiProperty({
    required: true,
    example: 'Fulano de tal',
  })
  role: string;

  @IsString()
  @IsNotEmpty({ message: "the 'description' field must not be empty" })
  @MaxLength(400, { message: 'Maximum of 400 characters exceeded' })
  @ApiProperty({
    required: true,
    example: 'Minha experiência como mentor na SouJunior como (ponha sua especialidade) foi excelente',
  })
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "the 'imageUrl' field must not be empty" })
  @ApiProperty({
    required: true,
    example: 'URL da imagem',
  })
  imageUrl: string;
}