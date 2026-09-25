import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateFooterSettingsDto } from './dto/update-footer-settings.dto';

@Injectable()
export class FooterRepository {
  constructor(private readonly prisma: PrismaService) {}

  get() {
    return this.prisma.footerSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  update(dto: UpdateFooterSettingsDto) {
    return this.prisma.footerSettings.upsert({
      where: { id: 1 },
      update: dto,
      create: { id: 1, ...dto },
    });
  }
}