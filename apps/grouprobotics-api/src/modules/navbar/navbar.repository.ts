import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateNavbarSettingsDto } from './dto/update-navbar-settings.dto';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';

@Injectable()
export class NavbarRepository {
  constructor(private readonly prisma: PrismaService) {}

  getSettings() {
    return this.prisma.navbarSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  updateSettings(dto: UpdateNavbarSettingsDto) {
    return this.prisma.navbarSettings.upsert({
      where: { id: 1 },
      update: dto,
      create: { id: 1, ...dto },
    });
  }

  getLinks() {
    return this.prisma.navLink.findMany({ orderBy: { order: 'asc' } });
  }

  async createLink(dto: CreateLinkDto) {
    const count = await this.prisma.navLink.count();
    return this.prisma.navLink.create({
      data: { label: dto.label, href: dto.href, order: count },
    });
  }

  updateLink(id: number, dto: UpdateLinkDto) {
    return this.prisma.navLink.update({ where: { id }, data: dto });
  }

  async deleteLink(id: number) {
    await this.prisma.navLink.delete({ where: { id } });

    const remaining = await this.prisma.navLink.findMany({ orderBy: { order: 'asc' } });
    await this.prisma.$transaction(
      remaining.map((link, index) =>
        this.prisma.navLink.update({ where: { id: link.id }, data: { order: index } }),
      ),
    );

    return { success: true };
  }

  reorderLinks(ids: number[]) {
    return this.prisma.$transaction(
      ids.map((id, index) => this.prisma.navLink.update({ where: { id }, data: { order: index } })),
    );
  }
}