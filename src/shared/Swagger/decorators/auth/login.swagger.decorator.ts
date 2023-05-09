import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BadRequestOnlyMessageSwagger } from '../../bad-request.swagger';
import { LoginSuccessSwagger } from './classes/login-success.swagger';

export function SwaggerLogin() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Exemplo do retorno de sucesso da rota',
      type: LoginSuccessSwagger,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Modelo de erro',
      type: BadRequestOnlyMessageSwagger,
    }),
    ApiOperation({
      summary: 'Rota para fazer login na plataforma',
    }),
  );
}
