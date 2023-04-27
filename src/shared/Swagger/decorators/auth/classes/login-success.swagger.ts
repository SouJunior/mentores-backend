import { ApiProperty } from '@nestjs/swagger';

export class UserLogged {
  @ApiProperty({ example: '2046f12a-37b3-4d17-b210-8b604e632f7e' })
  id: string;

  @ApiProperty({ example: 'Fulano de tal' })
  fullName: string;

  @ApiProperty({ example: '2023-04-06T01:48:41.314Z' })
  dateOfBirth: Date;

  @ApiProperty({ example: 'fulano.de.tal@dominio.com' })
  email: string;

  @ApiProperty({ example: '2023-04-24T03:48:29.030Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-04-25T23:29:26.885Z' })
  updatedAt: string;
}

export class LoginSuccessSwagger {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZ1bGFuby5kZS50YWxAZG9taW5pby5jb20iLCJpYXQiOjE2ODI1NjQyNTMsImV4cCI6MTY4MjY1MDY1M30.9mh1Lxpjde7G50iHNUUmmCnEpmuq5pDSMteCZz6NYyE',
  })
  token: string;

  @ApiProperty({ isArray: false, type: UserLogged })
  user: UserLogged;
}
