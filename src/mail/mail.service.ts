import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * MailService — خدمة إرسال البريد الإلكتروني الرسمي
 *
 * تُرسل إشعاراً HTML (RTL/عربي) إلى OFFICIAL_RECEIVER_EMAIL
 * عند كل طلب تسجيل جديد (طالب أو شركة).
 *
 * إذا لم تكن بيانات SMTP مضبوطة في التطوير المحلي،
 * يُطبع محتوى الإيميل في الـ Console دون إفشال الطلب.
 */
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(this.config.get('SMTP_PORT') ?? 587),
        secure: false,
        auth: { user, pass },
      });
    }
  }

  // -------------------------------------------------------
  // إشعار تسجيل طالب جديد
  // -------------------------------------------------------
  async sendStudentRegistrationAlert(
    data: Record<string, unknown>,
  ): Promise<void> {
    const subject = `📚 طلب تدريب جديد — ${data['fullName']}`;
    const html = this.buildStudentHtml(data);
    await this.sendMail(subject, html);
  }

  // -------------------------------------------------------
  // إشعار تسجيل شركة جديدة
  // -------------------------------------------------------
  async sendCompanyRegistrationAlert(
    data: Record<string, unknown>,
  ): Promise<void> {
    const subject = `🏢 طلب استضافة متدربين — ${data['companyName']}`;
    const html = this.buildCompanyHtml(data);
    await this.sendMail(subject, html);
  }

  // -------------------------------------------------------
  // إرسال البريد — مع try/catch للتطوير المحلي
  // -------------------------------------------------------
  private async sendMail(subject: string, html: string): Promise<void> {
    const receiver =
      this.config.get<string>('OFFICIAL_RECEIVER_EMAIL') ?? 'admin@soudia.sa';

    try {
      if (!this.transporter) {
        // SMTP غير مضبوط — اطبع في Console بدلاً من الإرسال
        console.log('\n' + '═'.repeat(60));
        console.log('📧 [DEV MODE] بريد إلكتروني (لم يُرسل — SMTP غير مضبوط)');
        console.log(`إلى   : ${receiver}`);
        console.log(`الموضوع: ${subject}`);
        console.log('المحتوى (HTML):\n', html.replace(/<[^>]*>/g, '').trim());
        console.log('═'.repeat(60) + '\n');
        return;
      }

      await this.transporter.sendMail({
        from: `"منصة سوديا" <${this.config.get('SMTP_USER')}>`,
        to: receiver,
        subject,
        html,
      });

      console.log(`✅ بريد أُرسل بنجاح إلى: ${receiver}`);
    } catch (error) {
      // لا تفشل طلب التسجيل بسبب خطأ البريد
      console.error(
        '⚠️  فشل إرسال البريد الإلكتروني (لن يؤثر على التسجيل):',
        error,
      );
    }
  }

  // -------------------------------------------------------
  // قالب HTML — بيانات الطالب (RTL / عربي)
  // -------------------------------------------------------
  private buildStudentHtml(d: Record<string, unknown>): string {
    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>طلب تدريب جديد</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background:#f4f6f8; margin:0; padding:20px; direction:rtl; }
    .card { background:#fff; border-radius:12px; max-width:600px; margin:auto; padding:32px; box-shadow:0 4px 20px rgba(0,0,0,.08); }
    .header { background:linear-gradient(135deg,#1a5276,#2980b9); border-radius:8px; padding:20px 24px; margin-bottom:24px; }
    .header h1 { color:#fff; margin:0; font-size:20px; }
    .header p { color:#aed6f1; margin:6px 0 0; font-size:13px; }
    .badge { display:inline-block; background:#eaf4fb; color:#1a5276; border-radius:20px; padding:4px 14px; font-size:12px; font-weight:bold; margin-bottom:20px; }
    table { width:100%; border-collapse:collapse; }
    tr:nth-child(even) td { background:#f8f9fa; }
    td { padding:11px 14px; font-size:14px; border-bottom:1px solid #ecf0f1; }
    td:first-child { color:#7f8c8d; width:38%; font-weight:600; }
    td:last-child { color:#2c3e50; }
    .footer { text-align:center; color:#bdc3c7; font-size:12px; margin-top:28px; }
    .status { background:#fef9e7; color:#f39c12; border-radius:6px; padding:3px 12px; font-weight:bold; display:inline-block; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>📚 طلب تدريب جديد</h1>
      <p>منصة سوديا — ربط الطلاب بالشركات</p>
    </div>
    <div class="badge">طالب جديد</div>
    <table>
      <tr><td>الاسم الكامل</td><td><strong>${d['fullName']}</strong></td></tr>
      <tr><td>البريد الإلكتروني</td><td>${d['email']}</td></tr>
      <tr><td>رقم الجوال</td><td>${d['phone']}</td></tr>
      <tr><td>الجامعة</td><td>${d['university']}</td></tr>
      <tr><td>التخصص</td><td>${d['major']}</td></tr>
      <tr><td>المعدل التراكمي</td><td>${d['gpa'] ?? 'غير محدد'}</td></tr>
      <tr><td>المدينة</td><td>${d['city']}</td></tr>
      <tr><td>المنطقة</td><td>${d['region']}</td></tr>
      <tr><td>المهارات</td><td>${d['skills']}</td></tr>
      <tr><td>رابط السيرة الذاتية</td><td>${d['cvUrl'] ?? 'لم يرفع'}</td></tr>
      <tr><td>حالة الطلب</td><td><span class="status">قيد المراجعة</span></td></tr>
    </table>
    <div class="footer">
      <p>© ${new Date().getFullYear()} منصة سوديا — المملكة العربية السعودية</p>
    </div>
  </div>
</body>
</html>`;
  }

  // -------------------------------------------------------
  // قالب HTML — بيانات الشركة (RTL / عربي)
  // -------------------------------------------------------
  private buildCompanyHtml(d: Record<string, unknown>): string {
    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>طلب استضافة متدربين</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; background:#f4f6f8; margin:0; padding:20px; direction:rtl; }
    .card { background:#fff; border-radius:12px; max-width:600px; margin:auto; padding:32px; box-shadow:0 4px 20px rgba(0,0,0,.08); }
    .header { background:linear-gradient(135deg,#145a32,#27ae60); border-radius:8px; padding:20px 24px; margin-bottom:24px; }
    .header h1 { color:#fff; margin:0; font-size:20px; }
    .header p { color:#a9dfbf; margin:6px 0 0; font-size:13px; }
    .badge { display:inline-block; background:#eafaf1; color:#145a32; border-radius:20px; padding:4px 14px; font-size:12px; font-weight:bold; margin-bottom:20px; }
    table { width:100%; border-collapse:collapse; }
    tr:nth-child(even) td { background:#f8f9fa; }
    td { padding:11px 14px; font-size:14px; border-bottom:1px solid #ecf0f1; }
    td:first-child { color:#7f8c8d; width:38%; font-weight:600; }
    td:last-child { color:#2c3e50; }
    .footer { text-align:center; color:#bdc3c7; font-size:12px; margin-top:28px; }
    .status { background:#fef9e7; color:#f39c12; border-radius:6px; padding:3px 12px; font-weight:bold; display:inline-block; }
    .count { background:#eaf4fb; color:#1a5276; border-radius:6px; padding:3px 12px; font-weight:bold; display:inline-block; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🏢 طلب استضافة متدربين جديد</h1>
      <p>منصة سوديا — ربط الطلاب بالشركات</p>
    </div>
    <div class="badge">شركة جديدة</div>
    <table>
      <tr><td>اسم الشركة</td><td><strong>${d['companyName']}</strong></td></tr>
      <tr><td>المسؤول</td><td>${d['contactPerson']}</td></tr>
      <tr><td>البريد الرسمي</td><td>${d['officialEmail']}</td></tr>
      <tr><td>رقم الجوال</td><td>${d['phone']}</td></tr>
      <tr><td>المدينة</td><td>${d['city']}</td></tr>
      <tr><td>المنطقة</td><td>${d['region']}</td></tr>
      <tr><td>القطاع</td><td>${d['industry']}</td></tr>
      <tr><td>عدد المتدربين المتوقع</td><td><span class="count">${d['expectedTraineesCount']}</span></td></tr>
      <tr><td>مجالات التدريب</td><td>${d['trainingFields']}</td></tr>
      <tr><td>حالة الطلب</td><td><span class="status">قيد المراجعة</span></td></tr>
    </table>
    <div class="footer">
      <p>© ${new Date().getFullYear()} منصة سوديا — المملكة العربية السعودية</p>
    </div>
  </div>
</body>
</html>`;
  }
}
