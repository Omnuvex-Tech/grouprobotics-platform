import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePartnersSettingsDto } from './dto/update-partners-settings.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class PartnersRepository {
  constructor(private readonly prisma: PrismaService) {}

  getSettings() {
    return this.prisma.partnersSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  updateSettings(dto: UpdatePartnersSettingsDto) {
    return this.prisma.partnersSettings.upsert({
      where: { id: 1 },
      update: dto,
      create: { id: 1, ...dto },
    });
  }

  getCards() {
    return this.prisma.partnerCard.findMany({ orderBy: { order: 'asc' } });
  }

  async createCard(dto: CreateCardDto) {
    const count = await this.prisma.partnerCard.count();
    return this.prisma.partnerCard.create({
      data: { title: dto.title, description: dto.description, icon: dto.icon ?? 'Building2', order: count },
    });
  }

  updateCard(id: number, dto: UpdateCardDto) {
    return this.prisma.partnerCard.update({ where: { id }, data: dto });
  }

  async deleteCard(id: number) {
    await this.prisma.partnerCard.delete({ where: { id } });

    const remaining = await this.prisma.partnerCard.findMany({ orderBy: { order: 'asc' } });
    await this.prisma.$transaction(
      remaining.map((card, index) =>
        this.prisma.partnerCard.update({ where: { id: card.id }, data: { order: index } }),
      ),
    );

    return { success: true };
  }

  reorderCards(ids: number[]) {
    return this.prisma.$transaction(
      ids.map((id, index) => this.prisma.partnerCard.update({ where: { id }, data: { order: index } })),
    );
  }
}