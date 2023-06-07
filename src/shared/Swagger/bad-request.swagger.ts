import { ApiProperty } from '@nestjs/swagger';
export class BadRequestSwagger {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'invalid input syntax for type uuid:' })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class BadRequestOnlyMessageSwagger {
  @ApiProperty({ example: 'E-mail ou senha inválidos' })
  message: string;
}

export class BadRequestGetUserByNameAndSpecialty {
  @ApiProperty({ example: 'Name and/or specialty not found' })
  message: string;
}
