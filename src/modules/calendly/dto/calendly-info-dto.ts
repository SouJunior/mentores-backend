import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCalendlyInfoDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  calendlyUserUuid: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  calendlyAccessToken: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  calendlyRefreshToken: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  accessTokenExpiration: Date;

  @IsNotEmpty()
  @IsString()
  calendlyName: string;

  @IsNotEmpty()
  @IsString()
  agendaName: string;

}

export class UpdateCalendlyInfoDto {
  @IsOptional()
  @IsString()
  calendlyUserUuid?: string;

  @IsOptional()
  @IsString()
  calendlyAccessToken?: string;

  @IsOptional()
  @IsString()
  calendlyRefreshToken?: string;

  @IsOptional()
  @IsDate()
  accessTokenExpiration?: Date;

  @IsOptional()
  @IsString()
  calendlyName?: string;

  @IsOptional()
  @IsString()
  agendaName?: string;

  @IsOptional()
  @IsString()
  mentorId?: string;
}
