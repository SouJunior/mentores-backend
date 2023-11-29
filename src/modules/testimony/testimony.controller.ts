import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TestimonyService } from './testimony.service';
import { CreateTestimonyDto } from './dto/create-testimony.dto';
import { SwaggerEditTestimony } from 'src/shared/Swagger/decorators/testimony/edit-testimony.swagger.decorator';
import { SwaggerDeleteTestimony } from 'src/shared/Swagger/decorators/testimony/delete-testimony.swagger.decorator';
import { GetByIdDto } from './dto/get-by-id.dto copy';
import { SwaggerGetTestimony } from 'src/shared/Swagger/decorators/testimony/get-testimony.swagger.decorator';
import { SwaggerCreateTestimony } from 'src/shared/Swagger/decorators/testimony/create-testimony.swagger.decorator';
import { AuthGuard } from '@nestjs/passport';
import { LoggedEntity } from '../auth/decorator/loggedEntity.decorator';
import { MentorEntity } from '../mentors/entities/mentor.entity';

@ApiTags('Testimony')
@Controller('Testimony')
export class TestimonyController {
  constructor(private testimonyService: TestimonyService) {}

  @Get()
  @SwaggerGetTestimony()
  async getTestimonies() {
    return this.testimonyService.getTestimonies()
  }

  @UseGuards(AuthGuard())
  @Post()
  @SwaggerCreateTestimony()
  async createTestimony(@LoggedEntity() mentor: MentorEntity, @Body() createTestimonyDto: CreateTestimonyDto) {
    return this.testimonyService.createTestimony(createTestimonyDto, mentor);
  }

  @Put(":id")
  @SwaggerEditTestimony()
  async editTestimony(
    @Body() createTestimonyDto: CreateTestimonyDto,
    @Param() { id }: GetByIdDto,
  ) {
    return this.testimonyService.editTestimony(id, createTestimonyDto);
  }

  @Delete(":id")
  @SwaggerDeleteTestimony()
  async deleteTestimony(@Param() { id }: GetByIdDto) {
    return this.testimonyService.deleteTestimony(id)
  }
}
