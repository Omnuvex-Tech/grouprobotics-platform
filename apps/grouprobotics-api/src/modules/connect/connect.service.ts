import { Injectable } from '@nestjs/common';
import { ConnectRepository } from './connect.repository';
import { UpdateConnectDto } from './dto/update-connect.dto';

@Injectable()
export class ConnectService {
  constructor(private readonly repository: ConnectRepository) {}

  get() {
    return this.repository.get();
  }

  update(dto: UpdateConnectDto) {
    return this.repository.update(dto);
  }
}