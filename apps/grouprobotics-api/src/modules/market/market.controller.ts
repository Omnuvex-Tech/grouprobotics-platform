import { Controller, Get, Put, Post, Delete, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MarketService } from './market.service';
import { UpdateMarketSettingsDto } from './dto/update-market-settings.dto';
import { CreatePillDto } from './dto/create-pill.dto';
import { UpdatePillDto } from './dto/update-pill.dto';
import { ReorderPillsDto } from './dto/reorder-pills.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('market')
export class MarketController {
  constructor(private readonly service: MarketService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateSettings(@Body() dto: UpdateMarketSettingsDto) {
    return this.service.updateSettings(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('pills')
  createPill(@Body() dto: CreatePillDto) {
    return this.service.createPill(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('pills/:id')
  updatePill(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePillDto) {
    return this.service.updatePill(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('pills/:id')
  deletePill(@Param('id', ParseIntPipe) id: number) {
    return this.service.deletePill(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('pills/reorder')
  reorderPills(@Body() dto: ReorderPillsDto) {
    return this.service.reorderPills(dto);
  }
}