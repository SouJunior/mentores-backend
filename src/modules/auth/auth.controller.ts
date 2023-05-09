import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SwaggerLogged } from '../../shared/Swagger/decorators/auth/logged.swagger.decorator';

import { SwaggerLogin } from '../../shared/Swagger/decorators/auth/login.swagger.decorator';
import { UserEntity } from '../user/entity/user.entity';
import { AuthService } from './auth.service';
import { LoggedUser } from './decorator/logged-user.decorator';
import { UserLoginDto } from './dtos/user-login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @SwaggerLogin()
  async login(@Body() loginData: UserLoginDto, @Res() res: Response) {
    const { status, data } = await this.authService.execute(loginData);

    return res.status(status).send(data);
  }

  @Get('/user-logged')
  @SwaggerLogged()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async userLogged(@LoggedUser() user: UserEntity) {
    return user;
  }
}
