import { ApiProperty } from '@nestjs/swagger';
export class SuccessSwagger {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'The operation was successfull' })
  message: string;

  @ApiProperty({ example: 'OK' })
  statusMessage: string;
}

