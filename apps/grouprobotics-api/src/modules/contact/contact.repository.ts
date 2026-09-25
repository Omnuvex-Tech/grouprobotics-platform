import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateContactSettingsDto } from './dto/update-contact-settings.dto';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Injectable()
export class ContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  getSettings() {
    return this.prisma.contactSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  updateSettings(dto: UpdateContactSettingsDto) {
    return this.prisma.contactSettings.upsert({
      where: { id: 1 },
      update: dto,
      create: { id: 1, ...dto },
    });
  }

  getOptions() {
    return this.prisma.contactInterestOption.findMany({ orderBy: { order: 'asc' } });
  }

  async createOption(dto: CreateOptionDto) {
    const count = await this.prisma.contactInterestOption.count();
    return this.prisma.contactInterestOption.create({
      data: { label: dto.label, order: count },
    });
  }

  updateOption(id: number, dto: UpdateOptionDto) {
    return this.prisma.contactInterestOption.update({ where: { id }, data: dto });
  }

  async deleteOption(id: number) {
    await this.prisma.contactInterestOption.delete({ where: { id } });

    const remaining = await this.prisma.contactInterestOption.findMany({ orderBy: { order: 'asc' } });
    await this.prisma.$transaction(
      remaining.map((opt, index) =>
        this.prisma.contactInterestOption.update({ where: { id: opt.id }, data: { order: index } }),
      ),
    );

    return { success: true };
  }

  reorderOptions(ids: number[]) {
    return this.prisma.$transaction(
      ids.map((id, index) => this.prisma.contactInterestOption.update({ where: { id }, data: { order: index } })),
    );
  }
}