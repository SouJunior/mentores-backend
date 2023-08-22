import { ApiProperty } from '@nestjs/swagger';
export class BadRequestEmailSwagger {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'invalid e-mail:' })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
