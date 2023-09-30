import { Body, Controller, Delete, Param, Post, Put, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TestimonyService } from './testimony.service';
import { CreateTestimonyDto } from './dto/create-testimony.dto';
import { SwaggerCreateTestimony } from 'src/shared/Swagger/decorators/testimony/create-testimony.swagger.decorator';
import { GetTestimonyByParamDto } from './dto/get-testimony-by-param.dto';
import { SwaggerEditTestimony } from 'src/shared/Swagger/decorators/testimony/edit-testimony.swagger.decorator';
import { SwaggerDeleteTestimony } from 'src/shared/Swagger/decorators/testimony/delete-testimony.swagger.decorator';
import { GetByIdDto } from './dto/get-by-id.dto copy';

@ApiTags('Testimony')
@Controller('Testimony')
export class TestimonyController {
  constructor(private testimonyService: TestimonyService) {}

  @Post()
  @SwaggerCreateTestimony()
  async createTestimony(@Body() createTestimonyDto: CreateTestimonyDto) {
    return this.testimonyService.createTestimony(createTestimonyDto);
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
