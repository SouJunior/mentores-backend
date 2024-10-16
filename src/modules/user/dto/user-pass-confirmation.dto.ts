import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Match } from 'src/modules/mentors/decorators/match.decorator';

export class UserPassConfirmationDto {
  @IsNotEmpty({ message: "the 'password' field must not be empty" })
  @IsString({ message: 'Only strings are allowed in this field' })
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>.]{8,}$/,
    {
      message:
        'Password must have a minimum of 8 characters, a capital letter, a number and a symbol',
    },
  )
  @ApiProperty({
    description: 'Senha de Login',
    example: 'Abcd@123',
  })
  password: string;

  @IsNotEmpty({ message: "the 'passwordConfirmation' field must not be empty" })
  @IsString()
  @ApiProperty({
    description: 'Confirmação de senha',
    example: 'Abcd@123',
  })
  @Match('password', {
    message: 'The password does not match with the password confirmation',
  })
  confirmPassword: string;
}