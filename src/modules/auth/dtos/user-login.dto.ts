import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    description: 'E-mail do usuário.',
    example: 'fulano.de.tal@dominio.com',
  })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'Senha de Login',
    example: 'Abcd@123',
  })
  password: string;
}
