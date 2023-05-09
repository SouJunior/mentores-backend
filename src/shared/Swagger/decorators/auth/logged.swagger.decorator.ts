import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotFoundSwagger } from '../../not-found.swagger';
import { UnauthorizedSwagger } from '../../unauthorized.swagger';
import { UserLogged } from './classes/login-success.swagger';

export function SwaggerLogged() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Exemplo do retorno de sucesso da rota',
      type: UserLogged,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Modelo de erro',
      type: NotFoundSwagger,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Modelo de Não autorizado',
      type: UnauthorizedSwagger,
    }),
    ApiOperation({
      summary: 'Rota para fazer login na plataforma',
    }),
  );
}
