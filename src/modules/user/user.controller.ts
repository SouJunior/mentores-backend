import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../../database/entities/user.entity';
import GetEntity from '../../shared/pipes/pipe-entity.pipe';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @ApiParam({
    type: 'string',
    name: 'id',
    example: 'be9cafb2-9eb7-44b9-b265-77b8d19c1bdb',
  })
  @Get(':id')
  getUserById(
    @Param('id', new GetEntity(UserEntity))
    user: UserEntity,
  ) {
    return user;
  }

  @Put()
  updateUser() {
    return this.userService.updateUser();
  }

  @Delete()
  deleteUser() {
    return this.userService.deleteUser();
  }
}
