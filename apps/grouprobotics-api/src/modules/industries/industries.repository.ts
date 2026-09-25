import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateIndustriesSettingsDto } from './dto/update-industries-settings.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class IndustriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  getSettings() {
    return this.prisma.industriesSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  updateSettings(dto: UpdateIndustriesSettingsDto) {
    return this.prisma.industriesSettings.upsert({
      where: { id: 1 },
      update: dto,
      create: { id: 1, ...dto },
    });
  }

  getTags() {
    return this.prisma.industryTag.findMany({ orderBy: { order: 'asc' } });
  }

  async createTag(dto: CreateTagDto) {
    const count = await this.prisma.industryTag.count();
    return this.prisma.industryTag.create({
      data: { label: dto.label, icon: dto.icon ?? '🏭', order: count },
    });
  }

  updateTag(id: number, dto: UpdateTagDto) {
    return this.prisma.industryTag.update({ where: { id }, data: dto });
  }

  async deleteTag(id: number) {
    await this.prisma.industryTag.delete({ where: { id } });

    const remaining = await this.prisma.industryTag.findMany({ orderBy: { order: 'asc' } });
    await this.prisma.$transaction(
      remaining.map((tag, index) =>
        this.prisma.industryTag.update({ where: { id: tag.id }, data: { order: index } }),
      ),
    );

    return { success: true };
  }

  reorderTags(ids: number[]) {
    return this.prisma.$transaction(
      ids.map((id, index) => this.prisma.industryTag.update({ where: { id }, data: { order: index } })),
    );
  }
}