import { Controller, Get, Put, Post, Delete, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { UpdateContactSettingsDto } from './dto/update-contact-settings.dto';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { ReorderOptionsDto } from './dto/reorder-options.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly service: ContactService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateSettings(@Body() dto: UpdateContactSettingsDto) {
    return this.service.updateSettings(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('options')
  createOption(@Body() dto: CreateOptionDto) {
    return this.service.createOption(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('options/:id')
  updateOption(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOptionDto) {
    return this.service.updateOption(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('options/:id')
  deleteOption(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteOption(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('options/reorder')
  reorderOptions(@Body() dto: ReorderOptionsDto) {
    return this.service.reorderOptions(dto);
  }
}