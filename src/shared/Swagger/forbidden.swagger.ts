import { ApiProperty } from '@nestjs/swagger';
export class ForbiddenSwagger {
  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty({ example: 'Credenciais bloqueadas' })
  message: string;
}
