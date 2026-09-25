import {
  Controller, Get, Put, Post,
  Body, UseGuards,
  UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { FooterService } from './footer.service';
import { UpdateFooterSettingsDto } from './dto/update-footer-settings.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('footer')
export class FooterController {
  constructor(private readonly service: FooterService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Body() dto: UpdateFooterSettingsDto) {
    return this.service.update(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './public/uploads/footer';
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
    const url = `/uploads/footer/${file.filename}`;
    await this.service.update({ logo: url });
    return { url };
  }
}