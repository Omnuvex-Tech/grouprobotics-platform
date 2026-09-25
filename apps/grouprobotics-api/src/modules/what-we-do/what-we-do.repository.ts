import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateWhatWeDoSettingsDto } from './dto/update-what-we-do-settings.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class WhatWeDoRepository {
  constructor(private readonly prisma: PrismaService) {}

  getSettings() {
    return this.prisma.whatWeDoSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  updateSettings(dto: UpdateWhatWeDoSettingsDto) {
    return this.prisma.whatWeDoSettings.upsert({
      where: { id: 1 },
      update: dto,
      create: { id: 1, ...dto },
    });
  }

  getItems() {
    return this.prisma.whatWeDoItem.findMany({ orderBy: { order: 'asc' } });
  }

  async createItem(dto: CreateItemDto) {
    const count = await this.prisma.whatWeDoItem.count();
    return this.prisma.whatWeDoItem.create({
      data: { label: dto.label, description: dto.description, order: count },
    });
  }

  updateItem(id: number, dto: UpdateItemDto) {
    return this.prisma.whatWeDoItem.update({ where: { id }, data: dto });
  }

  async deleteItem(id: number) {
    await this.prisma.whatWeDoItem.delete({ where: { id } });

    const remaining = await this.prisma.whatWeDoItem.findMany({ orderBy: { order: 'asc' } });
    await this.prisma.$transaction(
      remaining.map((item, index) =>
        this.prisma.whatWeDoItem.update({ where: { id: item.id }, data: { order: index } }),
      ),
    );

    return { success: true };
  }

  reorderItems(ids: number[]) {
    return this.prisma.$transaction(
      ids.map((id, index) => this.prisma.whatWeDoItem.update({ where: { id }, data: { order: index } })),
    );
  }
}