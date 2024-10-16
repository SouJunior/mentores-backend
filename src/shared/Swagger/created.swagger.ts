import { ApiProperty } from '@nestjs/swagger';
export class CreatedSwagger {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'User created sucessfully' })
  message: string;

  @ApiProperty({ example: 'Created' })
  statusMessage: string;
}

