import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { MarketRepository } from './market.repository';

@Module({
  controllers: [MarketController],
  providers: [MarketService, MarketRepository],
})
export class MarketModule {}