import { Injectable } from '@nestjs/common';
import { ApproachRepository } from './approach.repository';
import { UpdateApproachDto } from './dto/update-approach.dto';

@Injectable()
export class ApproachService {
  constructor(private readonly repository: ApproachRepository) {}

  get() {
    return this.repository.get();
  }

  update(dto: UpdateApproachDto) {
    return this.repository.update(dto);
  }
}