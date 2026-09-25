import { Injectable } from '@nestjs/common';
import { NavbarRepository } from './navbar.repository';
import { UpdateNavbarSettingsDto } from './dto/update-navbar-settings.dto';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { ReorderLinksDto } from './dto/reorder-links.dto';

@Injectable()
export class NavbarService {
  constructor(private readonly repository: NavbarRepository) {}

  async get() {
    const [settings, links] = await Promise.all([
      this.repository.getSettings(),
      this.repository.getLinks(),
    ]);
    return { ...settings, links };
  }

  updateSettings(dto: UpdateNavbarSettingsDto) {
    return this.repository.updateSettings(dto);
  }

  createLink(dto: CreateLinkDto) {
    return this.repository.createLink(dto);
  }

  updateLink(id: number, dto: UpdateLinkDto) {
    return this.repository.updateLink(id, dto);
  }

  deleteLink(id: number) {
    return this.repository.deleteLink(id);
  }

  reorderLinks(dto: ReorderLinksDto) {
    return this.repository.reorderLinks(dto.ids);
  }
}