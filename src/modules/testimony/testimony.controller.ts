import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTestimonyDto } from './dto/create-testimony.dto';
import { SwaggerEditTestimony } from 'src/shared/Swagger/decorators/testimony/edit-testimony.swagger.decorator';
import { SwaggerDeleteTestimony } from 'src/shared/Swagger/decorators/testimony/delete-testimony.swagger.decorator';
import { GetByIdDto } from './dto/get-by-id.dto copy';
import { SwaggerGetTestimony } from 'src/shared/Swagger/decorators/testimony/get-testimony.swagger.decorator';
import { SwaggerCreateTestimony } from 'src/shared/Swagger/decorators/testimony/create-testimony.swagger.decorator';
import { AuthGuard } from '@nestjs/passport';
import { LoggedEntity } from '../auth/decorator/loggedEntity.decorator';
import { MentorEntity } from '../mentors/entities/mentor.entity';
import { CreateTestimonyService } from './services/createTestimony.service';
import { EditTestimonyService } from './services/editTestimony.service';
import { GetAllTestimoniesService } from './services/getTestimonies.service';
import { DeleteTestimonyService } from './services/deleteTestimony.service';

@ApiTags('Testimony')
@Controller('testimony')
export class TestimonyController {
  constructor(
    private createTestimonyService: CreateTestimonyService,
    private editTestimonyService: EditTestimonyService,
    private getAllTestimoniesService: GetAllTestimoniesService,
    private deleteTestimonyService: DeleteTestimonyService,
  ) {}

  @Get()
  @SwaggerGetTestimony()
  async getTestimonies() {
    return this.getAllTestimoniesService.execute();
  }

  @UseGuards(AuthGuard())
  @Post()
  @SwaggerCreateTestimony()
  async createTestimony(
    @LoggedEntity() mentor: MentorEntity,
    @Body() createTestimonyDto: CreateTestimonyDto,
  ) {
    return this.createTestimonyService.execute(createTestimonyDto, mentor);
  }

  @Put(':id')
  @SwaggerEditTestimony()
  async editTestimony(
    @Body() createTestimonyDto: CreateTestimonyDto,
    @Param() { id }: GetByIdDto,
  ) {
    return this.editTestimonyService.execute(id, createTestimonyDto);
  }

  @Delete(':id')
  @SwaggerDeleteTestimony()
  async deleteTestimony(@Param() { id }: GetByIdDto) {
    return this.deleteTestimonyService.execute(id);
  }
}
