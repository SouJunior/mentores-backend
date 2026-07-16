import { Module } from "@nestjs/common";
import { CalendlyController } from "./calendly.controller";
import { OAuthCallbackService } from "./services/calendly-callback.service";
import { InitiateOAuthService } from "./services/calendlyOAuth.service";
import { RefreshTokenService } from "./services/refresh-token.service";
import { FetchSchedulesService } from "./services/fetch-schedules.service";
import { MentorRepository } from "../mentors/repository/mentor.repository";
import { PrismaService } from "../../../prisma/service/prisma.service";
import { CalendlyRepository } from "./repository/calendly.repository";
import { JwtService } from "@nestjs/jwt";
import { CreateCalendlyInfoService } from "./services/create-calendly-info.service";
import { UpdateCalendlyInfoService } from "./services/update-calendly-info.service";
import { GetCalendlyMentorInfoService } from "./services/get-calendly-mentor-info.service";
import { PassportModule } from "@nestjs/passport";
import HttpAdapter from "../../lib/adapter/httpAdapter";
import { GetAllCalendlyMentorInfosService } from "./services/get-all-calendly-mentor-infos.service";

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [CalendlyController],
  providers: [
    OAuthCallbackService,
    InitiateOAuthService,
    RefreshTokenService,
    FetchSchedulesService,
    CreateCalendlyInfoService,
    UpdateCalendlyInfoService,
    GetCalendlyMentorInfoService,
    GetAllCalendlyMentorInfosService,
    CalendlyRepository,
    MentorRepository,
    PrismaService,
    JwtService,
    {
       provide: "IHttpAdapter",
       useClass: HttpAdapter
    }
  ],
  

  exports: [CalendlyRepository]
})
export class CalendlyModule {}
