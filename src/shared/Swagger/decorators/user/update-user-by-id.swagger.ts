import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UnauthorizedSwagger } from '../../unauthorized.swagger';
import { BadRequestSwagger } from '../../bad-request.swagger';
import { UpdateUserDto } from '../../../../modules/user/dto/update-user.dto';

export function SwaggerUpdateUserById() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Exemplo do retorno de sucesso da rota',
      type: UpdateUserDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Modelo de erro',
      type: UnauthorizedSwagger,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Modelo de erro',
      type: BadRequestSwagger,
    }),
    ApiOperation({
      summary: 'Atualizar uma usuário por id.',
      description: 'Todos os campos são opcionais',
    }),
  );
}
