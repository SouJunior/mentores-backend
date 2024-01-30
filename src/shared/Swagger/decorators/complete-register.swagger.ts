import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessSwagger } from '../success.swagger';
import { BadRequestSwagger } from '../bad-request.swagger';

export function SwaggerCompleteRegister() {
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
    ApiOperation({
      summary:
        'Rota para definir o status de cadastro de infomações do mentor como completo',
    }),
  );
}
