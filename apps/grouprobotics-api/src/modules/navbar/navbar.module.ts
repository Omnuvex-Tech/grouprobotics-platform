import { Module } from '@nestjs/common';
import { NavbarController } from './navbar.controller';
import { NavbarService } from './navbar.service';
import { NavbarRepository } from './navbar.repository';

@Module({
  controllers: [NavbarController],
  providers: [NavbarService, NavbarRepository],
})
export class NavbarModule {}