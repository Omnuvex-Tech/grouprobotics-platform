import { Module } from '@nestjs/common';
import { ApproachController } from './approach.controller';
import { ApproachService } from './approach.service';
import { ApproachRepository } from './approach.repository';

@Module({
  controllers: [ApproachController],
  providers: [ApproachService, ApproachRepository],
})
export class ApproachModule {}