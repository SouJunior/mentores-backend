import { ApiProperty } from '@nestjs/swagger';
export class BadRequestSwagger {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'invalid input for this operation' })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
