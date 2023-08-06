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
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SwaggerConfirmEmail } from '../../shared/Swagger/decorators/user/confirm-email.swagger.decorator';
import { SwaggerCreateUser } from '../../shared/Swagger/decorators/user/create-user.swagger.decorator';
import { SwaggerGetUser } from '../../shared/Swagger/decorators/user/get-user.swagger.decorator';
import { ActiveUserDto } from './dtos/active-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetByParamDto } from './dtos/get-by-param.dto';
import { SearchUserDto } from './dtos/search-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';
import { SearchByEmailDto } from './dtos/search-by-email.dto';

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
  @SwaggerGetUser()
  async findByNameAndRole(
    @Res() res: Response,
    @Query() { fullName, specialty }: SearchUserDto,
  ) {
    const data = await this.userService.findUserByNameAndRole(
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

  @Patch('active')
  @SwaggerConfirmEmail()
  async activeUser(@Query() queryData: ActiveUserDto, @Res() res: Response) {
    const { data, status } = await this.userService.activeUser(queryData);
    return res.status(status).send(data);
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  async desactivateLoggedUser(@Param() { id }: GetByParamDto) {
    return this.userService.desactivateLoggedUser(id);
  }

  @ApiExcludeEndpoint()
  @Post("restoreAccount/:email")
  async restoreAccount(@Param() {email}: SearchByEmailDto) {
    return this.userService.sendRestorationEmail(email);
  }
}
