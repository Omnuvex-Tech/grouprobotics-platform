import { Injectable } from '@nestjs/common';
import { FooterRepository } from './footer.repository';
import { UpdateFooterSettingsDto } from './dto/update-footer-settings.dto';

@Injectable()
export class FooterService {
  constructor(private readonly repository: FooterRepository) {}

  get() {
    return this.repository.get();
  }

  update(dto: UpdateFooterSettingsDto) {
    return this.repository.update(dto);
  }
}