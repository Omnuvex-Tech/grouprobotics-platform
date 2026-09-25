import {
  Controller, Get, Put, Post, Delete, Patch,
  Body, Param, ParseIntPipe, UseGuards,
  UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { NavbarService } from './navbar.service';
import { UpdateNavbarSettingsDto } from './dto/update-navbar-settings.dto';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { ReorderLinksDto } from './dto/reorder-links.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('navbar')
export class NavbarController {
  constructor(private readonly service: NavbarService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateSettings(@Body() dto: UpdateNavbarSettingsDto) {
    return this.service.updateSettings(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './public/uploads/navbar';
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
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    const url = `/uploads/navbar/${file.filename}`;
    await this.service.updateSettings({ logo: url });
    return { url };
  }

  @UseGuards(JwtAuthGuard)
  @Post('links')
  createLink(@Body() dto: CreateLinkDto) {
    return this.service.createLink(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('links/:id')
  updateLink(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLinkDto) {
    return this.service.updateLink(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('links/:id')
  deleteLink(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteLink(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('links/reorder')
  reorderLinks(@Body() dto: ReorderLinksDto) {
    return this.service.reorderLinks(dto);
  }
}