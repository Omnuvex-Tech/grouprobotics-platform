import {
  Controller, Get, Put, Post, Delete, Patch,
  Body, Param, ParseIntPipe, UseGuards,
  UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { CapabilitiesService } from './capabilities.service';
import { UpdateCapabilitiesSettingsDto } from './dto/update-capabilities-settings.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ReorderCardsDto } from './dto/reorder-cards.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('capabilities')
export class CapabilitiesController {
  constructor(private readonly service: CapabilitiesService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateSettings(@Body() dto: UpdateCapabilitiesSettingsDto) {
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

  @UseGuards(JwtAuthGuard)
  @Post('cards/:id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './public/uploads/capabilities';
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
  async uploadCardImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = `/uploads/capabilities/${file.filename}`;
    await this.service.updateCard(id, { image: url });
    return { url };
  }
}