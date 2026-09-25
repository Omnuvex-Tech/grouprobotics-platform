import { Injectable } from '@nestjs/common';
import { CapabilitiesRepository } from './capabilities.repository';
import { UpdateCapabilitiesSettingsDto } from './dto/update-capabilities-settings.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ReorderCardsDto } from './dto/reorder-cards.dto';

@Injectable()
export class CapabilitiesService {
  constructor(private readonly repository: CapabilitiesRepository) {}

  async get() {
    const [settings, cards] = await Promise.all([
      this.repository.getSettings(),
      this.repository.getCards(),
    ]);
    return { ...settings, cards };
  }

  updateSettings(dto: UpdateCapabilitiesSettingsDto) {
    return this.repository.updateSettings(dto);
  }

  createCard(dto: CreateCardDto) {
    return this.repository.createCard(dto);
  }

  updateCard(id: number, dto: UpdateCardDto) {
    return this.repository.updateCard(id, dto);
  }

  deleteCard(id: number) {
    return this.repository.deleteCard(id);
  }

  reorderCards(dto: ReorderCardsDto) {
    return this.repository.reorderCards(dto.ids);
  }
}