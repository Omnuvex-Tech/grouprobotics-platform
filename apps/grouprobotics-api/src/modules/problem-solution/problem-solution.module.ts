import { Module } from '@nestjs/common';
import { ProblemSolutionController } from './problem-solution.controller';
import { ProblemSolutionService } from './problem-solution.service';
import { ProblemSolutionRepository } from './problem-solution.repository';

@Module({
  controllers: [ProblemSolutionController],
  providers: [ProblemSolutionService, ProblemSolutionRepository],
})
export class ProblemSolutionModule {}