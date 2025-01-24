import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from '../prisma/service/prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MailModule } from './modules/mails/mail.module';
import { TestimonyModule } from './modules/testimony/testimony.module';
import { MentorModule } from './modules/mentors/mentor.module';
import { TokenMiddleware } from './middlewares/token.middleware';
import { MentorController } from './modules/mentors/mentor.controller';
import { CalendlyModule } from './modules/calendly/calendly.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MentorModule,
    UserModule,
    AuthModule,
    MailModule,
    TestimonyModule,
    CalendlyModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
