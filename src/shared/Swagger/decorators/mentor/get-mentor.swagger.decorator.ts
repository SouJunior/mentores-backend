import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessSwagger } from '../../success.swagger';
import { BadRequestSwagger } from '../../bad-request.swagger';
import { NotFoundSwagger } from '../../not-found.swagger';

export function SwaggerGetMentor() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Exemplo do retorno de sucesso da rota',
      type: SuccessSwagger,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Modelo de erro',
      type: BadRequestSwagger,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Modelo de erro',
      type: NotFoundSwagger,
    }),
    ApiOperation({
      summary: 'Rota para buscar o usuario pelo ID',
    }),
  );
}
