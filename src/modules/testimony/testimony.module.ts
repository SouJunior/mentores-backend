import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GenerateCodeUtil } from '../../shared/utils/generate-code.util';
import { TestimonyController } from './testimony.controller';
import { TestimonyRepository } from './repository/testimony.repository';
import { MentorRepository } from '../mentors/repository/mentor.repository';
import { CreateTestimonyService } from './services/createTestimony.service';
import { DeleteTestimonyService } from './services/deleteTestimony.service';
import { EditTestimonyService } from './services/editTestimony.service';
import { GetAllTestimoniesService } from './services/getTestimonies.service';

@Module({
  imports: [ PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [TestimonyController],
  providers: [CreateTestimonyService, DeleteTestimonyService, EditTestimonyService, GetAllTestimoniesService, TestimonyRepository, MentorRepository, GenerateCodeUtil],
  exports: [TestimonyRepository],
})
export class TestimonyModule {}