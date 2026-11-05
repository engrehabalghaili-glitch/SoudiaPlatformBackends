import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService - الخدمة المركزية للتعامل مع قاعدة البيانات
 *
 * تمتد من PrismaClient وتدير دورة حياة الاتصال بقاعدة البيانات
 * تلقائياً مع دورة حياة NestJS (OnModuleInit / OnModuleDestroy).
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * يتصل بقاعدة البيانات عند بدء تشغيل الوحدة
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  /**
   * يقطع الاتصال بقاعدة البيانات عند إيقاف الوحدة
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
