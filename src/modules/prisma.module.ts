// PrismaModule: exposes PrismaService for database access
import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
