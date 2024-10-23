import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './jtw/jwt.strategy';
import { UserModule } from '../user/user.module';
import { MentorModule } from '../mentors/mentor.module';
import { InitiateOAuthService } from '../calendly/services/calendlyOAuth.service';
import { OAuthCallbackService } from '../calendly/services/calendly-callback.service';
import { RefreshTokenService } from '../calendly/services/refresh-token.service';

@Module({
  imports: [
    MentorModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
