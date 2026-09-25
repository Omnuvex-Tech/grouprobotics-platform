import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateMarketSettingsDto } from './dto/update-market-settings.dto';
import { CreatePillDto } from './dto/create-pill.dto';
import { UpdatePillDto } from './dto/update-pill.dto';

@Injectable()
export class MarketRepository {
  constructor(private readonly prisma: PrismaService) {}

  getSettings() {
    return this.prisma.marketSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  updateSettings(dto: UpdateMarketSettingsDto) {
    return this.prisma.marketSettings.upsert({
      where: { id: 1 },
      update: dto,
      create: { id: 1, ...dto },
    });
  }

  getPills() {
    return this.prisma.marketPill.findMany({ orderBy: { order: 'asc' } });
  }

  async createPill(dto: CreatePillDto) {
    const count = await this.prisma.marketPill.count();
    return this.prisma.marketPill.create({
      data: { label: dto.label, order: count },
    });
  }

  updatePill(id: number, dto: UpdatePillDto) {
    return this.prisma.marketPill.update({
      where: { id },
      data: { label: dto.label },
    });
  }

  async deletePill(id: number) {
    await this.prisma.marketPill.delete({ where: { id } });

    const remaining = await this.prisma.marketPill.findMany({ orderBy: { order: 'asc' } });
    await this.prisma.$transaction(
      remaining.map((pill, index) =>
        this.prisma.marketPill.update({ where: { id: pill.id }, data: { order: index } }),
      ),
    );

    return { success: true };
  }

  reorderPills(ids: number[]) {
    return this.prisma.$transaction(
      ids.map((id, index) => this.prisma.marketPill.update({ where: { id }, data: { order: index } })),
    );
  }
}