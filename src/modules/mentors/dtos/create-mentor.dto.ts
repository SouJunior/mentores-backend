import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxDate,
  MaxLength,
} from 'class-validator';
import { Specialties } from '../enums/specialties.enum';

export class CreateMentorDto {
  @IsString()
  @IsNotEmpty({ message: "the 'fullName' field must not be empty" })
  @Matches(/^[A-Za-zÀ-ÿ\s]+$/, {
    message: 'The full name must contain only letters and spaces',
  })
  @MaxLength(100, { message: 'Maximum of 100 characters exceeded' })
  @ApiProperty({
    required: true,
    example: 'Fulano de Tal',
  })
  fullName: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MaxDate(new Date(), {
    message: 'A data deve ser anterior à data atual',
  })
  @MaxDate(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), {
    message: 'Você deve ter pelo menos 18 anos para se registrar',
  })
  @ApiProperty({
    required: true,
    example: '2000-04-06',
  })
  dateOfBirth: Date | string;

  @IsString({ message: 'Only strings are allowed in this field' })
  @IsEmail(undefined, {
    message: 'Invalid e-mail format',
  })
  @MaxLength(100, { message: 'Maximum of 100 characters exceeded' })
  @IsNotEmpty({ message: "the 'email' field must not be empty" })
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty({
    required: true,
    example: 'fulano.de.tal@dominio.com',
  })
  email: string;

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

  @IsOptional()
  code?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Specialties, { each: true })
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @ApiProperty({
    required: true,
    type: 'String array',
    example: 'Front-End, Back-End, QA, Dev Ops',
  })
  specialties?: string[];

  @IsNumber()
  @IsOptional()
  accessAttempt?: number

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  registerComplete?: boolean;
}
