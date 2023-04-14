import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UserEntity } from '../../database/entities/user.entity';
import { BadRequestSwagger } from '../../shared/Swagger/bad-request.swagger';
import { UnauthorizedSwagger } from '../../shared/Swagger/unauthorized.swagger';
import { AuthService } from './auth.service';
import { LoggedUser } from './decorator/logged-user.decorator';
import { UserLoginDto } from './dtos/user-login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exemplo do retorno de sucesso da rota',
    type: '',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Modelo de erro',
    type: BadRequestSwagger,
  })
  @ApiOperation({
    summary: 'Rota para fazer login na plataforma',
  })
  async login(@Body() loginData: UserLoginDto, @Res() res: Response) {
    const { status, data } = await this.authService.execute(loginData);

    return res.status(status).send(data);
  }

  @Get('/user-logged')
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exemplo do retorno de sucesso da rota',
    type: '',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Modelo de erro',
    type: UnauthorizedSwagger,
  })
  @ApiOperation({
    summary: 'Retorna usuário logado',
  })
  @ApiBearerAuth()
  async userLogged(@LoggedUser() user: UserEntity) {
    return user;
  }
}
