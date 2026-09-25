import { Injectable } from '@nestjs/common';
import { WhatWeDoRepository } from './what-we-do.repository';
import { UpdateWhatWeDoSettingsDto } from './dto/update-what-we-do-settings.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ReorderItemsDto } from './dto/reorder-items.dto';

@Injectable()
export class WhatWeDoService {
  constructor(private readonly repository: WhatWeDoRepository) {}

  async get() {
    const [settings, items] = await Promise.all([
      this.repository.getSettings(),
      this.repository.getItems(),
    ]);
    return { ...settings, items };
  }

  updateSettings(dto: UpdateWhatWeDoSettingsDto) {
    return this.repository.updateSettings(dto);
  }

  createItem(dto: CreateItemDto) {
    return this.repository.createItem(dto);
  }

  updateItem(id: number, dto: UpdateItemDto) {
    return this.repository.updateItem(id, dto);
  }

  deleteItem(id: number) {
    return this.repository.deleteItem(id);
  }

  reorderItems(dto: ReorderItemsDto) {
    return this.repository.reorderItems(dto.ids);
  }
}