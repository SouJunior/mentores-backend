import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BadRequestEmailSwagger } from '../../../../../shared/Swagger/bad-requestEmail.swagger';
import { NotFoundEmailSwagger } from '../../../../../shared/Swagger/not-foundEmail.swagger';

export function SwaggerRestoreAccountEmail() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Exemplo do retorno de sucesso da rota',
      type: NotFoundEmailSwagger,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Modelo de erro',
      type: BadRequestEmailSwagger,
    }),
    ApiOperation({
      summary: 'Rota para enviar e-mail de recuperação para o usuário',
    }),
  );
}
