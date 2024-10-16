import { ApiProperty } from '@nestjs/swagger';

export class CreateTestimonyResponseSwagger {
  @ApiProperty({
    example: 'Fulano de Tal',
  })
  userName: string;

  @ApiProperty({
    example:
      'Insira um depoimento sobre sua participação na SouJunior como mentor',
  })
  description: string;
}
