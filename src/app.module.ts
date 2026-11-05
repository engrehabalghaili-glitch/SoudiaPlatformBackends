import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { AdminModule } from './admin/admin.module';

/**
 * AppModule — الوحدة الجذر للمنصة
 *
 * - ConfigModule     : تحميل .env عالمياً
 * - ThrottlerModule  : Rate Limiting (100 طلب / 60 ثانية للحدود العامة)
 *                      نماذج التسجيل تُعرِّف حدودها الخاصة (5/دقيقة) في Controller
 * - PrismaModule     : @Global — متاح لجميع الوحدات
 * - MailModule       : خدمة البريد الإلكتروني
 * - RegistrationsModule : POST /api/registrations/*
 * - AdminModule      : GET  /api/admin/*
 */
@Module({
  imports: [
    // متغيرات البيئة متاحة عالمياً
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate Limiting عام: 100 طلب / دقيقة
    // نماذج التسجيل تُطبّق حدها الأكثر صرامة (5/دقيقة) عبر @Throttle
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60000, // 60 ثانية بالمللي ثانية
        limit: 100,
      },
    ]),

    PrismaModule,
    MailModule,
    RegistrationsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // تطبيق ThrottlerGuard عالمياً على جميع المسارات
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
