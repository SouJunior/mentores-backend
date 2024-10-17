import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SwaggerLogged } from '../../shared/Swagger/decorators/auth/logged.swagger.decorator';

import { SwaggerLogin } from '../../shared/Swagger/decorators/auth/login.swagger.decorator';
import { MentorEntity } from '../mentors/entities/mentor.entity';
import { AuthService } from './services/auth.service';
import { LoggedEntity } from './decorator/loggedEntity.decorator';
import { InfoLoginDto } from './dtos/info-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { InitiateOAuthService } from './services/calendlyOAuth.service';
import { OAuthCallbackService } from './services/calendly-callback.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly initiateOAuthService: InitiateOAuthService,
    private readonly oauthCallbackService: OAuthCallbackService,
    private jwtService: JwtService
  ) {}

  @Post('/login')
  @SwaggerLogin()
  async login(@Body() loginData: InfoLoginDto, @Res() res: Response) {
    const { status, data } = await this.authService.execute(loginData);

    return res.status(status).send(data);
  }

  @Get('/user-logged')
  @SwaggerLogged()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async userLogged(@LoggedEntity() mentor: MentorEntity) {
    return mentor;
  }

  @Get('connect')
  async connect(@Query('email') email: string, @Res() res: Response) {
    const { url } = await this.initiateOAuthService.initiateOAuth(email);
    return res.redirect(url);
  }

  @Get('callback')
  async oauthCallback(
    @Query('code') code: string,
    @Query("state") state: string
  ) {
    const email = state
    return this.oauthCallbackService.execute(code, email);
  }
}
