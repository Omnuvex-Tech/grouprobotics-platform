import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateConnectDto } from './dto/update-connect.dto';

@Injectable()
export class ConnectRepository {
  constructor(private readonly prisma: PrismaService) {}

  get() {
    return this.prisma.connect.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  }

  update(dto: UpdateConnectDto) {
    return this.prisma.connect.upsert({
      where: { id: 1 },
      update: dto,
      create: { id: 1, ...dto },
    });
  }
}