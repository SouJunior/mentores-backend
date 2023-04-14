import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from '../../shared/Swagger/bad-request.swagger';
import { NotFoundSwagger } from '../../shared/Swagger/not-found.swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetByParamDto } from './dtos/get-by-param.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Exemplo do retorno de sucesso da rota',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Modelo de erro',
    type: BadRequestSwagger,
  })
  @ApiOperation({
    summary: 'Rota para cadastrar usuário plataforma',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @ApiExcludeEndpoint()
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @ApiExcludeEndpoint()
  @Get(':id')
  getUserById(@Param() { id }: GetByParamDto) {
    return this.userService.findUserById(id);
  }

  @ApiExcludeEndpoint()
  @Put(':id')
  updateLoggedUser(
    @Param() { id }: GetByParamDto,
    @Body() data: UpdateUserDto,
  ) {
    return this.userService.updateLoggedUser(id, data);
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  desactivateLoggedUser(@Param() { id }: GetByParamDto) {
    return this.userService.desactivateLoggedUser(id);
  }
}
