import { Module } from '@nestjs/common';
import { CmsController } from '../controllers/cms.controller';
import { CmsService } from '../services/cms.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}
