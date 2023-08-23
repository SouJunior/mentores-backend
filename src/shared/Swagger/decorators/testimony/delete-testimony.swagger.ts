import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotFoundEmailSwagger } from '../../not-foundEmail.swagger';
import { BadRequestEmailSwagger } from '../../bad-requestEmail.swagger';

export function SwaggerDeleteTestimony() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Exemplo do retorno de sucesso da rota',
      type: NotFoundEmailSwagger,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Modelo de erro',
      type: BadRequestEmailSwagger,
    }),
    ApiOperation({
      summary: 'Rota para deletar depoimento',
    }),
  );
}
