import { ApiProperty } from '@nestjs/swagger';
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
    example: '2023-04-06T01:48:41.314Z',
  })
  dateOfBirth: Date;

  @IsString()
  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 'fulano.de.tal@dominio.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>.]{1,8}$/,
    {
      message:
        'Senha inválida. Deve conter no máximo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
    },
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
    message: 'Senhas precisam ser idênticas',
  })
  passwordConfirmation: string;
}
