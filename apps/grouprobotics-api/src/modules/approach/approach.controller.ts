import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApproachService } from './approach.service';
import { UpdateApproachDto } from './dto/update-approach.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('approach')
export class ApproachController {
  constructor(private readonly service: ApproachService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Body() dto: UpdateApproachDto) {
    return this.service.update(dto);
  }
}