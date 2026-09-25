import { Module } from '@nestjs/common';
import { CapabilitiesController } from './capabilities.controller';
import { CapabilitiesService } from './capabilities.service';
import { CapabilitiesRepository } from './capabilities.repository';

@Module({
  controllers: [CapabilitiesController],
  providers: [CapabilitiesService, CapabilitiesRepository],
})
export class CapabilitiesModule {}