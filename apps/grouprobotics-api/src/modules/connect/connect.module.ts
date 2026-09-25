import { Module } from '@nestjs/common';
import { ConnectController } from './connect.controller';
import { ConnectService } from './connect.service';
import { ConnectRepository } from './connect.repository';

@Module({
  controllers: [ConnectController],
  providers: [ConnectService, ConnectRepository],
})
export class ConnectModule {}