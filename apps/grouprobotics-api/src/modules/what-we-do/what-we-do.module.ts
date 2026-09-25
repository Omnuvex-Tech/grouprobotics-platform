import { Module } from '@nestjs/common';
import { WhatWeDoController } from './what-we-do.controller';
import { WhatWeDoService } from './what-we-do.service';
import { WhatWeDoRepository } from './what-we-do.repository';

@Module({
  controllers: [WhatWeDoController],
  providers: [WhatWeDoService, WhatWeDoRepository],
})
export class WhatWeDoModule {}