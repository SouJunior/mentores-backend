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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SwaggerConfirmEmail } from '../../shared/Swagger/decorators/confirm-email.swagger.decorator';
import { SwaggerCreateMentor } from '../../shared/Swagger/decorators/mentor/create-mentor.swagger.decorator';
import { SwaggerGetMentor } from '../../shared/Swagger/decorators/mentor/get-mentor.swagger.decorator';
import { ActiveMentorDto } from './dtos/active-mentor.dto';
import { CreateMentorDto } from './dtos/create-mentor.dto';
import { SearchMentorDto } from './dtos/search-mentor.dto';
import { UpdateMentorDto } from './dtos/update-mentor.dto';
import { MentorService } from './mentor.service';
import { SearchByEmailDto } from './dtos/search-by-email.dto';
import { MentorPassConfirmationDto } from './dtos/mentor-pass-confirmation.dto';
import { SwaggerRestoreAccountEmail } from 'src/shared/Swagger/decorators/mentor/classes/restoreAccountEmail.swagger';
import { LoggedEntity } from '../auth/decorator/loggedEntity.decorator';
import { MentorEntity } from './entities/mentor.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { SwaggerUpdateMentorById } from 'src/shared/Swagger/decorators/mentor/update-mentor-by-id.swagger';
import { GetByIdDto } from './dtos/get-by-id.dto copy';
import { SwaggerRestoreAccount } from 'src/shared/Swagger/decorators/restore-account.swagger.decorator';

@ApiTags('mentor')
@Controller('mentor')
export class MentorController {
  constructor(private mentorService: MentorService) {}

  @Post()
  @SwaggerCreateMentor()
  async createMentor(@Body() createMentorDto: CreateMentorDto) {
    return this.mentorService.createMentor(createMentorDto);
  }

  @ApiExcludeEndpoint()
  @Get()
  async getAllMentors() {
    return this.mentorService.getAllMentors();
  }

  @Get('search')
  @SwaggerGetMentor()
  async findByNameAndRole(
    @Res() res: Response,
    @Query() { fullName, specialty }: SearchMentorDto
  ) {
    const data = await this.mentorService.findMentorByNameAndRole(
      fullName,
      specialty,
    );

    return res.status(HttpStatus.OK).send(data);
  }

  @Get([':id'])
  @SwaggerGetMentor()
  async getMentorById(
    @Param() { id }: GetByIdDto,
    @Res() res: Response,
  ) {
    const { status, data } = await this.mentorService.findMentorById(id);

    return res.status(status).send(data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @SwaggerUpdateMentorById()
  @Put(':id')
  async updateMentor(
    @LoggedEntity() mentor: MentorEntity,
    @Body() data: UpdateMentorDto,
  ) {
    return await this.mentorService.updateMentor(mentor.id, data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor("file"))
  @Post("uploadProfileImage")
  async uploadProfileImage(@LoggedEntity() mentor: MentorEntity, @UploadedFile("file") file) {
    
    return await this.mentorService.uploadProfileImage(mentor.id, mentor, file )
  }

  @Patch('active')
  @SwaggerConfirmEmail()
  async activeMentor(@Query() queryData: ActiveMentorDto, @Res() res: Response) {
    const { data, status } = await this.mentorService.activeMentor(queryData);
    return res.status(status).send(data);
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  async desactivateLoggedEntity(@Param() { id }: GetByIdDto) {
    return this.mentorService.desactivateLoggedMentor(id);
  }

  @SwaggerRestoreAccountEmail()
  @Post('restoreAccount/:email')
  async restoreAccount(@Param() { email }: SearchByEmailDto) {
    return this.mentorService.sendRestorationEmail(email);
  }

  @Patch('restoreAccount/redefinePass')
  @SwaggerRestoreAccount()
  async redefineMentorPassword(
    @Query() queryData: ActiveMentorDto,
    @Body() passData: MentorPassConfirmationDto,
  ) {
    return this.mentorService.redefineMentorPassword(queryData, passData);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post('completeRegister')
  async finishMentorRegister(@LoggedEntity() mentor: MentorEntity) {
    try {
    return this.mentorService.finishMentorRegister(mentor.id)
    } catch (error) {
      console.log(error.message)
    }
  }
}
