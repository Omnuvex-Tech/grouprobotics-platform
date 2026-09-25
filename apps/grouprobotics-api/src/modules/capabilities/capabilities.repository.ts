import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCapabilitiesSettingsDto } from './dto/update-capabilities-settings.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CapabilitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  getSettings() {
    return this.prisma.capabilitiesSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  updateSettings(dto: UpdateCapabilitiesSettingsDto) {
    return this.prisma.capabilitiesSettings.upsert({
      where: { id: 1 },
      update: dto,
      create: { id: 1, ...dto },
    });
  }

  getCards() {
    return this.prisma.capabilityCard.findMany({ orderBy: { order: 'asc' } });
  }

  async createCard(dto: CreateCardDto) {
    const count = await this.prisma.capabilityCard.count();
    return this.prisma.capabilityCard.create({
      data: { title: dto.title, description: dto.description, order: count },
    });
  }

  updateCard(id: number, dto: UpdateCardDto) {
    return this.prisma.capabilityCard.update({ where: { id }, data: dto });
  }

  async deleteCard(id: number) {
    await this.prisma.capabilityCard.delete({ where: { id } });

    const remaining = await this.prisma.capabilityCard.findMany({ orderBy: { order: 'asc' } });
    await this.prisma.$transaction(
      remaining.map((card, index) =>
        this.prisma.capabilityCard.update({ where: { id: card.id }, data: { order: index } }),
      ),
    );

    return { success: true };
  }

  reorderCards(ids: number[]) {
    return this.prisma.$transaction(
      ids.map((id, index) => this.prisma.capabilityCard.update({ where: { id }, data: { order: index } })),
    );
  }
}