import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

/**
 * AdminModule — وحدة الإدارة
 *
 * تشمل: قائمة الطلاب والشركات، تصدير CSV، RolesGuard
 * PrismaService مُتاح عبر PrismaModule @Global() في AppModule
 */
@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
