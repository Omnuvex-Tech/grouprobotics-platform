import { Controller, Get, Put, Post, Delete, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { UpdatePartnersSettingsDto } from './dto/update-partners-settings.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ReorderCardsDto } from './dto/reorder-cards.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('partners')
export class PartnersController {
  constructor(private readonly service: PartnersService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateSettings(@Body() dto: UpdatePartnersSettingsDto) {
    return this.service.updateSettings(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cards')
  createCard(@Body() dto: CreateCardDto) {
    return this.service.createCard(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('cards/:id')
  updateCard(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCardDto) {
    return this.service.updateCard(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cards/:id')
  deleteCard(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteCard(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('cards/reorder')
  reorderCards(@Body() dto: ReorderCardsDto) {
    return this.service.reorderCards(dto);
  }
}