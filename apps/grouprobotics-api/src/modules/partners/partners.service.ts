import { Injectable } from '@nestjs/common';
import { PartnersRepository } from './partners.repository';
import { UpdatePartnersSettingsDto } from './dto/update-partners-settings.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ReorderCardsDto } from './dto/reorder-cards.dto';

@Injectable()
export class PartnersService {
  constructor(private readonly repository: PartnersRepository) {}

  async get() {
    const [settings, cards] = await Promise.all([
      this.repository.getSettings(),
      this.repository.getCards(),
    ]);
    return { ...settings, cards };
  }

  updateSettings(dto: UpdatePartnersSettingsDto) {
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