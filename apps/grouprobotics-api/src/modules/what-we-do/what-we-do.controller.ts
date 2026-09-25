import {
  Controller, Get, Put, Post, Delete, Patch,
  Body, Param, ParseIntPipe, UseGuards,
  UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { WhatWeDoService } from './what-we-do.service';
import { UpdateWhatWeDoSettingsDto } from './dto/update-what-we-do-settings.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ReorderItemsDto } from './dto/reorder-items.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('what-we-do')
export class WhatWeDoController {
  constructor(private readonly service: WhatWeDoService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateSettings(@Body() dto: UpdateWhatWeDoSettingsDto) {
    return this.service.updateSettings(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('items')
  createItem(@Body() dto: CreateItemDto) {
    return this.service.createItem(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('items/:id')
  updateItem(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateItemDto) {
    return this.service.updateItem(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('items/:id')
  deleteItem(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteItem(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('items/reorder')
  reorderItems(@Body() dto: ReorderItemsDto) {
    return this.service.reorderItems(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('items/:id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './public/uploads/what-we-do';
          if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
        if (!allowed.includes(file.mimetype)) {
          return cb(new Error('Yalnız PNG, JPEG, WebP və ya SVG qəbul edilir'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadItemImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = `/uploads/what-we-do/${file.filename}`;
    await this.service.updateItem(id, { image: url });
    return { url };
  }
}