import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    required: true,
    example: 'Fulano de tal',
  })
  fullName: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: '2023-04-06',
  })
  dateOfBirth: Date;

  @IsString()
  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty({
    required: true,
    example: 'fulano.de.tal@dominio.com',
  })
  email: string;

  @IsString()
  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty({
    required: true,
    example: 'fulano.de.tal@dominio.com',
  })
  @Match('email', {
    message: 'The emails dont match',
  })
  emailConfirm: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>.]{1,8}$/,
  )
  @ApiProperty({
    description: 'Senha de Login',
    example: 'Abcd@123',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Confirmação de senha',
    example: 'Abcd@123',
  })
  @Match('password', {
    message: 'The password dont match',
  })
  passwordConfirmation: string;
}
