import { Injectable } from '@nestjs/common';
import { ContactRepository } from './contact.repository';
import { UpdateContactSettingsDto } from './dto/update-contact-settings.dto';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { ReorderOptionsDto } from './dto/reorder-options.dto';

@Injectable()
export class ContactService {
  constructor(private readonly repository: ContactRepository) {}

  async get() {
    const [settings, options] = await Promise.all([
      this.repository.getSettings(),
      this.repository.getOptions(),
    ]);
    return { ...settings, options };
  }

  updateSettings(dto: UpdateContactSettingsDto) {
    return this.repository.updateSettings(dto);
  }

  createOption(dto: CreateOptionDto) {
    return this.repository.createOption(dto);
  }

  updateOption(id: number, dto: UpdateOptionDto) {
    return this.repository.updateOption(id, dto);
  }

  deleteOption(id: number) {
    return this.repository.deleteOption(id);
  }

  reorderOptions(dto: ReorderOptionsDto) {
    return this.repository.reorderOptions(dto.ids);
  }
}