import { ApiProperty } from '@nestjs/swagger';
export class BadRequestSwagger {
  @ApiProperty({ example: 422 })
  statusCode: number;

  @ApiProperty({ example: 'invalid input syntax for type uuid:' })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
