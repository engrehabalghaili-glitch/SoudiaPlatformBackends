import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // -------------------------------------------------------
  // بادئة عامة لجميع المسارات
  // -------------------------------------------------------
  app.setGlobalPrefix('api');

  // -------------------------------------------------------
  // CORS — مسموح بالكامل للربط مع Vercel والبيئات المختلفة
  // -------------------------------------------------------
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // -------------------------------------------------------
  // ValidationPipe الصارم — يعتمد class-validator + class-transformer
  // -------------------------------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // يحذف الحقول غير المعرّفة في DTO
      forbidNonWhitelisted: true, // يرفع 400 إذا أُرسلت حقول زائدة
      transform: true, // يحوّل القيم للأنواع المطلوبة تلقائياً
    }),
  );

  // -------------------------------------------------------
  // تشغيل الخادم — Rate Limiting مُعدّ في AppModule
  // -------------------------------------------------------
  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  console.log(
    `\n🚀 منصة سوديا — الخادم يعمل على: http://localhost:${port}/api`,
  );
  console.log(
    `📋 طلبات الطلاب  : POST http://localhost:${port}/api/registrations/student`,
  );
  console.log(
    `🏢 طلبات الشركات : POST http://localhost:${port}/api/registrations/company`,
  );
  console.log(
    `📊 لوحة الإدارة  : GET  http://localhost:${port}/api/admin/students\n`,
  );
}

bootstrap();
