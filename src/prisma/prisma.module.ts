import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule - وحدة Prisma العامة (Global)
 *
 * تُصدَّر PrismaService تلقائياً لجميع الوحدات في التطبيق
 * دون الحاجة لاستيرادها في كل وحدة على حدة.
 *
 * @Global() - يجعل هذه الوحدة متاحة في كامل التطبيق
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
