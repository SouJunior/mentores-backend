import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SwaggerCreateUser } from '../../shared/Swagger/decorators/user/create-user.swagger.decorator';
import {
  SwaggerGetUser,
  SwaggerGetUserByNameAndSpecialty,
} from '../../shared/Swagger/decorators/user/get-user.swagger.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetByParamDto } from './dtos/get-by-param.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @SwaggerCreateUser()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @ApiExcludeEndpoint()
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('search')
  @SwaggerGetUserByNameAndSpecialty()
  async findByNameAndSpecialty(
    @Res() res: Response,
    @Query('fullName') fullName?: string,
    @Query('specialty') specialty?: string,
  ) {
    if (!fullName && !specialty) {
      throw new BadRequestException('need at least fullName or specialty');
    }

    const data = await this.userService.findUserByNameAndSpecialty(
      fullName,
      specialty,
    );

    return res.status(HttpStatus.OK).send(data);
  }

  @Get([':id'])
  @SwaggerGetUser()
  async getUserById(
    @Param() { id }: Partial<GetByParamDto>,
    @Res() res: Response,
  ) {
    const { status, data } = await this.userService.findUserById(id);

    return res.status(status).send(data);
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

  @ApiExcludeEndpoint()
  @Patch('activateUser/:id')
  activateUser(@Param() { id }: GetByParamDto) {

    return this.userService.activateUser(id);
  }
}
