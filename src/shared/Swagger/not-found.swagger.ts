import { ApiProperty } from '@nestjs/swagger';
export class NotFoundSwagger {
  @ApiProperty({ example: 404 })
  satusCode: number;

  @ApiProperty({ example: 'Object was not found' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}
