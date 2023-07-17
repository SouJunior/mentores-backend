import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GenerateCodeUtil } from '../../shared/utils/generate-code.util';
import { TestimonyController } from './testimony.controller';
import { TestimonyService } from './testimony.service';
import { TestimonyRepository } from './repository/testimony.repository';

@Module({
  imports: [ PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [TestimonyController],
  providers: [TestimonyService, TestimonyRepository, GenerateCodeUtil],
  exports: [TestimonyRepository],
})
export class TestimonyModule {}