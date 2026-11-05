import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterStudentsDto, FilterCompaniesDto } from './dto/filter.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // -------------------------------------------------------
  // جلب قائمة الطلاب مع الفلترة
  // -------------------------------------------------------
  async getStudents(filter: FilterStudentsDto) {
    const where: Record<string, unknown> = {};

    if (filter.region) where['region'] = { contains: filter.region };
    if (filter.city) where['city'] = { contains: filter.city };
    if (filter.university)
      where['university'] = { contains: filter.university };
    if (filter.status) where['status'] = filter.status;

    const [data, total] = await Promise.all([
      this.prisma.studentRegistration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.studentRegistration.count({ where }),
    ]);

    return { total, data };
  }

  // -------------------------------------------------------
  // جلب قائمة الشركات مع الفلترة
  // -------------------------------------------------------
  async getCompanies(filter: FilterCompaniesDto) {
    const where: Record<string, unknown> = {};

    if (filter.region) where['region'] = { contains: filter.region };
    if (filter.city) where['city'] = { contains: filter.city };
    if (filter.industry) where['industry'] = { contains: filter.industry };
    if (filter.status) where['status'] = filter.status;

    const [data, total] = await Promise.all([
      this.prisma.companyRegistration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.companyRegistration.count({ where }),
    ]);

    return { total, data };
  }

  // -------------------------------------------------------
  // تصدير الطلاب كـ CSV (UTF-8 BOM لدعم Excel بالعربية)
  // -------------------------------------------------------
  async exportStudentsCsv(): Promise<string> {
    const students = await this.prisma.studentRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'الرقم',
      'الاسم الكامل',
      'البريد الإلكتروني',
      'رقم الجوال',
      'الجامعة',
      'التخصص',
      'المعدل التراكمي',
      'المدينة',
      'المنطقة',
      'رابط السيرة الذاتية',
      'المهارات',
      'الحالة',
      'تاريخ التسجيل',
    ];

    const rows = students.map((s) => [
      s.id,
      this.escapeCsv(s.fullName),
      this.escapeCsv(s.email),
      this.escapeCsv(s.phone),
      this.escapeCsv(s.university),
      this.escapeCsv(s.major),
      s.gpa ?? '',
      this.escapeCsv(s.city),
      this.escapeCsv(s.region),
      this.escapeCsv(s.cvUrl ?? ''),
      this.escapeCsv(s.skills),
      this.escapeCsv(s.status),
      s.createdAt.toISOString().replace('T', ' ').substring(0, 19),
    ]);

    return this.buildCsv(headers, rows);
  }

  // -------------------------------------------------------
  // تصدير الشركات كـ CSV (UTF-8 BOM لدعم Excel بالعربية)
  // -------------------------------------------------------
  async exportCompaniesCsv(): Promise<string> {
    const companies = await this.prisma.companyRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'الرقم',
      'اسم الشركة',
      'المسؤول',
      'البريد الإلكتروني الرسمي',
      'رقم الجوال',
      'المدينة',
      'المنطقة',
      'القطاع',
      'عدد المتدربين المتوقع',
      'مجالات التدريب',
      'الحالة',
      'تاريخ التسجيل',
    ];

    const rows = companies.map((c) => [
      c.id,
      this.escapeCsv(c.companyName),
      this.escapeCsv(c.contactPerson),
      this.escapeCsv(c.officialEmail),
      this.escapeCsv(c.phone),
      this.escapeCsv(c.city),
      this.escapeCsv(c.region),
      this.escapeCsv(c.industry),
      c.expectedTraineesCount,
      this.escapeCsv(c.trainingFields),
      this.escapeCsv(c.status),
      c.createdAt.toISOString().replace('T', ' ').substring(0, 19),
    ]);

    return this.buildCsv(headers, rows);
  }

  // -------------------------------------------------------
  // مساعد: بناء نص CSV مع UTF-8 BOM للعربية في Excel
  // -------------------------------------------------------
  private buildCsv(headers: string[], rows: (string | number)[][]): string {
    const BOM = '\uFEFF'; // UTF-8 BOM — ضروري لعرض العربية صح في Excel
    const headerLine = headers.join(',');
    const dataLines = rows.map((row) => row.join(','));
    return BOM + [headerLine, ...dataLines].join('\r\n');
  }

  // -------------------------------------------------------
  // مساعد: escape قيم CSV (التعامل مع الفواصل والاقتباسات)
  // -------------------------------------------------------
  private escapeCsv(value: string): string {
    if (!value) return '';
    const str = String(value);
    // إذا احتوت القيمة على فاصلة أو اقتباس أو سطر جديد — لفّها بـ quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }
}
