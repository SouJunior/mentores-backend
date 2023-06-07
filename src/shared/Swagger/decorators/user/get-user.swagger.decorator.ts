import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  BadRequestGetUserByNameAndSpecialty,
  BadRequestOnlyMessageSwagger,
} from '../../bad-request.swagger';
import { UserLogged } from '../auth/classes/login-success.swagger';

export function SwaggerGetUser() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Exemplo do retorno de sucesso da rota',
      type: UserLogged,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Modelo de erro',
      type: BadRequestOnlyMessageSwagger,
    }),
    ApiOperation({
      summary: 'Rota para buscar o usuario pelo ID',
    }),
  );
}

export function SwaggerGetUserByNameAndSpecialty() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Exemplo do retorno de sucesso da rota',
      type: UserLogged,
      isArray: true,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Modelo de erro',
      type: BadRequestGetUserByNameAndSpecialty,
    }),
    ApiOperation({
      summary: 'Rota para buscar o usuario por nome ou cargo',
    }),
  );
}
