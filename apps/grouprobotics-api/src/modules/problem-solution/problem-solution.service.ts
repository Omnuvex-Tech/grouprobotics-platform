import { Injectable } from '@nestjs/common';
import { ProblemSolutionRepository } from './problem-solution.repository';
import { UpdateProblemSolutionDto } from './dto/update-problem-solution.dto';

@Injectable()
export class ProblemSolutionService {
  constructor(private readonly repository: ProblemSolutionRepository) {}

  get() {
    return this.repository.get();
  }

  update(dto: UpdateProblemSolutionDto) {
    return this.repository.update(dto);
  }
}