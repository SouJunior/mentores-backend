import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseGuards, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { SwaggerConfirmEmail } from 'src/shared/Swagger/decorators/confirm-email.swagger.decorator';
import { ActivateUserDto } from './dto/activate-user.dto';
import { Response } from 'express';
import { GetByIdDto } from '../testimony/dto/get-by-id.dto copy';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { SwaggerRestoreAccountEmail } from 'src/shared/Swagger/decorators/mentor/classes/restoreAccountEmail.swagger';
import { SearchByEmailDto } from '../mentors/dtos/search-by-email.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggedEntity } from '../auth/decorator/loggedEntity.decorator';
import { UserPassConfirmationDto } from './dto/user-pass-confirmation.dto';
import { SwaggerUpdateUserById } from 'src/shared/Swagger/decorators/user/update-user-by-id.swagger';
import { SwaggerGetUser } from 'src/shared/Swagger/decorators/user/get-user.swagger.decorator';
import { SwaggerRestoreAccount } from 'src/shared/Swagger/decorators/restore-account.swagger.decorator';

@ApiTags("user")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('active')
  @SwaggerConfirmEmail()
  async activeUser(@Query() queryData: ActivateUserDto, @Res() res: Response) {
    const { data, status } = await this.userService.activateUser(queryData);
    return res.status(status).send(data);
  }

  @ApiExcludeEndpoint()
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get([':id'])
  @SwaggerGetUser()
  async getUserById(
    @Param() { id }: GetByIdDto,
    @Res() res: Response,
  ) {
    const { status, data } = await this.userService.findUserById(id);

    return res.status(status).send(data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @SwaggerUpdateUserById()
  @Put(':id')
  async updateUser(
    @LoggedEntity() user: UserEntity,
    @Body() data: UpdateUserDto,
  ) {
    return await this.userService.updateUser(user.id, data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor("file"))
  @Post("uploadProfileImage")
  async uploadProfileImage(@LoggedEntity() user: UserEntity, @UploadedFile("file") file) {
    
    return await this.userService.uploadProfileImage(user.id, user, file )
  }

  
  @ApiExcludeEndpoint()
  @Patch(':id')
  async desactivateLoggedEntity(@Param() { id }: GetByIdDto) {
    return this.userService.desactivateLoggedUser(id);
  }

  @SwaggerRestoreAccountEmail()
  @Post('restoreAccount/:email')
  async restoreAccount(@Param() { email }: SearchByEmailDto) {
    return this.userService.sendRestorationEmail(email);
  }

  @Patch('restoreAccount/redefinePass')
  @SwaggerRestoreAccount()
  async redefineUserPassword(
    @Query() queryData: ActivateUserDto,
    @Body() passData: UserPassConfirmationDto,
  ) {
    return this.userService.redefineUserPassword(queryData, passData);
  }
}
