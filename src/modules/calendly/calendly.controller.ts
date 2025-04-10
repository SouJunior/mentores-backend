import { Body, Controller, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { OAuthCallbackService } from './services/calendly-callback.service';
import { InitiateOAuthService } from './services/calendlyOAuth.service';
import { FetchSchedulesService } from './services/fetch-schedules.service';
import { Response } from 'express';
import { TokenMiddleware } from '../../middlewares/token.middleware';
import { SearchByEmailDto } from './dto/search-by-email.dto';
import { CreateCalendlyInfoDto, UpdateCalendlyInfoDto } from './dto/calendly-info-dto';
import { CreateCalendlyInfoService } from './services/create-calendly-info.service';
import { UpdateCalendlyInfoService } from './services/update-calendly-info.service';
import { LoggedEntity } from '../auth/decorator/loggedEntity.decorator';
import { MentorEntity } from '../mentors/entities/mentor.entity';
import { GetCalendlyMentorInfoService } from './services/get-calendly-mentor-info.service';
import { AuthGuard } from '@nestjs/passport';
import { GetAllCalendlyMentorInfosService } from './services/get-all-calendly-mentor-infos.service';


@Controller('calendly')
export class CalendlyController {

    constructor(
        private readonly oauthCallbackService: OAuthCallbackService,
        private readonly initiateOAuthService: InitiateOAuthService,
        private readonly fetchSchedulesService: FetchSchedulesService,
        private createCalendlyInfoService: CreateCalendlyInfoService,
        private updateCalendlyInfoService: UpdateCalendlyInfoService,
        private getCalendlyMentorInfoService: GetCalendlyMentorInfoService,
        private getAllCalendlyMentorInfosService: GetAllCalendlyMentorInfosService
      ) {}
      
    @Get("")
    async getAllCalendlyMentorInfos () {
      return await this.getAllCalendlyMentorInfosService.execute();
    }

    @Get("mentorInfo")
    @UseGuards(AuthGuard())
    async getCalendlyMentorInfo (@LoggedEntity() mentor: MentorEntity) {
      return await this.getCalendlyMentorInfoService.execute(mentor.id);
    }
      
    @Get('connect')
    async connect(@Query('mentorId') mentorId: string, @Res() res: Response) {
      const { url } = await this.initiateOAuthService.initiateOAuth(mentorId);
      return res.redirect(url);
    }
  
    @Get('callback')
    async oauthCallback(
      @Query('code') code: string,
      @Query("state") state: string
    ) {
      const mentorId = state
      return this.oauthCallbackService.execute(code, mentorId);
    }

    @Get('schedules')
    @UseGuards(AuthGuard())
    @UseGuards(TokenMiddleware)
    async fetchMentorSchedules(@LoggedEntity() mentor: MentorEntity) {
      return this.fetchSchedulesService.getMentorSchedules(mentor.id);
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
