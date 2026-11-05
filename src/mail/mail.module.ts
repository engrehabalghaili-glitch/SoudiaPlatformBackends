import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

/**
 * MailModule — وحدة خدمة البريد الإلكتروني
 *
 * تُصدَّر MailService للاستخدام في RegistrationsModule وغيرها.
 */
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
