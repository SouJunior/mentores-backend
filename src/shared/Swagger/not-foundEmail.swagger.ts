import { ApiProperty } from '@nestjs/swagger';
export class NotFoundEmailSwagger {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({
    example: 'There is no user with that e-mail in the database.',
  })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}
