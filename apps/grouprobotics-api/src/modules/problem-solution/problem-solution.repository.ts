import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProblemSolutionDto } from './dto/update-problem-solution.dto';

@Injectable()
export class ProblemSolutionRepository {
  constructor(private readonly prisma: PrismaService) {}

  get() {
    return this.prisma.problemSolution.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  update(dto: UpdateProblemSolutionDto) {
    return this.prisma.problemSolution.upsert({
      where: { id: 1 },
      update: dto,
      create: { id: 1, ...dto },
    });
  }
}