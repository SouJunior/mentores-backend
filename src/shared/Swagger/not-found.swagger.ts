import { ApiProperty } from '@nestjs/swagger';
export class NotFoundSwagger {
  @ApiProperty({ example: 404 })
  message: string;
}
