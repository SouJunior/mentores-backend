import { Body, Controller, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { OAuthCallbackService } from './services/calendly-callback.service';
import { InitiateOAuthService } from './services/calendlyOAuth.service';
import { FetchSchedulesService } from './services/fetch-schedules.service';
import { Response } from 'express';
import { TokenMiddleware } from 'src/middlewares/token.middleware';
import { SearchByEmailDto } from './dto/search-by-email.dto';
import { CreateCalendlyInfoDto, UpdateCalendlyInfoDto } from './dto/calendly-info-dto';
import { CreateCalendlyInfoService } from './services/create-calendly-info.service';
import { UpdateCalendlyInfoService } from './services/update-calendly-info.service';
import { LoggedEntity } from '../auth/decorator/loggedEntity.decorator';
import { MentorEntity } from '../mentors/entities/mentor.entity';
import { GetCalendlyMentorInfoService } from './services/get-calendly-mentor-info.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('calendly')
export class CalendlyController {

    constructor(
        private readonly oauthCallbackService: OAuthCallbackService,
        private readonly initiateOAuthService: InitiateOAuthService,
        private readonly fetchSchedulesService: FetchSchedulesService,
        private createCalendlyInfoService: CreateCalendlyInfoService,
        private updateCalendlyInfoService: UpdateCalendlyInfoService,
        private getCalendlyMentorInfoService: GetCalendlyMentorInfoService
      ) {}

    @Get("")
    @UseGuards(AuthGuard())
    async getCalendlyMentorInfo (@LoggedEntity() mentor: MentorEntity) {
      return await this.getCalendlyMentorInfoService.execute(mentor.id);
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

    @Get('schedules/:email')
    @UseGuards(TokenMiddleware)
    async fetchMentorSchedules(@Param() { email }: SearchByEmailDto) {
      return this.fetchSchedulesService.getMentorSchedules(email);
    }

    @Post("")
    @UseGuards(AuthGuard())
    async createCalendlyInfo(
      @Body() data: CreateCalendlyInfoDto,
      @LoggedEntity() mentor: MentorEntity
    ) {
      return await this.createCalendlyInfoService.execute(data, mentor.id);
    }
  
    @Put(':id')
    async updateCalendlyInfo(
      @Body() data: UpdateCalendlyInfoDto,
      @LoggedEntity() mentor: MentorEntity
    ) {
      return await this.updateCalendlyInfoService.execute(mentor.id, data);
    }
}
