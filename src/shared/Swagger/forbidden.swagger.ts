import { ApiProperty } from '@nestjs/swagger';
export class ForbiddenSwagger {
  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty({ example: 'Blocked credentials' })
  message: string;
}
