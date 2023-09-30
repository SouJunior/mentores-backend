import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BadRequestEmailSwagger } from '../../bad-requestEmail.swagger';
import { SuccessSwagger } from '../../success.swagger';

export function SwaggerDeleteTestimony() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Exemplo do retorno de sucesso da rota',
      type: SuccessSwagger,
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
