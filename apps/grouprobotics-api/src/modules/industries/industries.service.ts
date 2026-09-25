import { Injectable } from '@nestjs/common';
import { IndustriesRepository } from './industries.repository';
import { UpdateIndustriesSettingsDto } from './dto/update-industries-settings.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ReorderTagsDto } from './dto/reorder-tags.dto';

@Injectable()
export class IndustriesService {
  constructor(private readonly repository: IndustriesRepository) {}

  async get() {
    const [settings, tags] = await Promise.all([
      this.repository.getSettings(),
      this.repository.getTags(),
    ]);
    return { ...settings, tags };
  }

  updateSettings(dto: UpdateIndustriesSettingsDto) {
    return this.repository.updateSettings(dto);
  }

  createTag(dto: CreateTagDto) {
    return this.repository.createTag(dto);
  }

  updateTag(id: number, dto: UpdateTagDto) {
    return this.repository.updateTag(id, dto);
  }

  deleteTag(id: number) {
    return this.repository.deleteTag(id);
  }

  reorderTags(dto: ReorderTagsDto) {
    return this.repository.reorderTags(dto.ids);
  }
}