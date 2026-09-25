import { Controller, Get, Put, Post, Delete, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { IndustriesService } from './industries.service';
import { UpdateIndustriesSettingsDto } from './dto/update-industries-settings.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ReorderTagsDto } from './dto/reorder-tags.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('industries')
export class IndustriesController {
  constructor(private readonly service: IndustriesService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateSettings(@Body() dto: UpdateIndustriesSettingsDto) {
    return this.service.updateSettings(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('tags')
  createTag(@Body() dto: CreateTagDto) {
    return this.service.createTag(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('tags/:id')
  updateTag(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTagDto) {
    return this.service.updateTag(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('tags/:id')
  deleteTag(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteTag(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('tags/reorder')
  reorderTags(@Body() dto: ReorderTagsDto) {
    return this.service.reorderTags(dto);
  }
}