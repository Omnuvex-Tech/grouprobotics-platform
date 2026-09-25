import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateApproachDto } from './dto/update-approach.dto';

@Injectable()
export class ApproachRepository {
  constructor(private readonly prisma: PrismaService) {}

  get() {
    return this.prisma.approach.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  update(dto: UpdateApproachDto) {
    return this.prisma.approach.upsert({
      where: { id: 1 },
      update: dto,
      create: { id: 1, ...dto },
    });
  }
}