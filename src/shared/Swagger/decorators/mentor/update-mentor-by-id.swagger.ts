import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UpdateMentorDto } from "src/modules/mentors/dtos/update-mentor.dto";
import { UnauthorizedSwagger } from "../../unauthorized.swagger";
import { BadRequestSwagger } from "../../bad-request.swagger";

export function SwaggerUpdateMentorById() {
    return applyDecorators(
          ApiResponse({
            status: HttpStatus.OK,
            description: 'Exemplo do retorno de sucesso da rota',
            type: UpdateMentorDto,
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
            summary: 'Atualizar uma mentor por id.',
            description: "Todos os campos são opcionais"
          }),
    )
}