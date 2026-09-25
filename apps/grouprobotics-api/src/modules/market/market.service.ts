import { Injectable } from '@nestjs/common';
import { MarketRepository } from './market.repository';
import { UpdateMarketSettingsDto } from './dto/update-market-settings.dto';
import { CreatePillDto } from './dto/create-pill.dto';
import { UpdatePillDto } from './dto/update-pill.dto';
import { ReorderPillsDto } from './dto/reorder-pills.dto';

@Injectable()
export class MarketService {
  constructor(private readonly repository: MarketRepository) {}

  async get() {
    const [settings, pills] = await Promise.all([
      this.repository.getSettings(),
      this.repository.getPills(),
    ]);
    return { ...settings, pills };
  }

  updateSettings(dto: UpdateMarketSettingsDto) {
    return this.repository.updateSettings(dto);
  }

  createPill(dto: CreatePillDto) {
    return this.repository.createPill(dto);
  }

  updatePill(id: number, dto: UpdatePillDto) {
    return this.repository.updatePill(id, dto);
  }

  deletePill(id: number) {
    return this.repository.deletePill(id);
  }

  reorderPills(dto: ReorderPillsDto) {
    return this.repository.reorderPills(dto.ids);
  }
}