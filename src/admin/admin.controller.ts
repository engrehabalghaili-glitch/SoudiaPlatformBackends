import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { AdminService } from './admin.service';
import { RolesGuard } from './guards/roles.guard';
import { Roles, Role } from './decorators/roles.decorator';
import { FilterStudentsDto, FilterCompaniesDto } from './dto/filter.dto';

/**
 * AdminController — لوحة إدارة المنصة
 *
 * جميع المسارات تبدأ بـ /api/admin
 * محمية بـ RolesGuard وتتطلب دور SUPER_ADMIN
 * (الـ guard جاهز — سيُفعَّل كاملاً مع JWT في المرحلة القادمة)
 *
 * @SkipThrottle — لا نريد Rate Limiting على الأدوات الإدارية
 */
@SkipThrottle()
@UseGuards(RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  // -------------------------------------------------------
  // GET /api/admin/students
  // جلب قائمة الطلاب مع فلترة اختيارية
  // Query: ?region=الرياض&city=الرياض&university=KSU&status=PENDING
  // -------------------------------------------------------
  @Roles(Role.SUPER_ADMIN, Role.UNIVERSITY_ADMIN)
  @Get('students')
  async getStudents(@Query() filter: FilterStudentsDto) {
    return this.service.getStudents(filter);
  }

  // -------------------------------------------------------
  // GET /api/admin/companies
  // جلب قائمة الشركات مع فلترة اختيارية
  // Query: ?region=جدة&industry=تقنية&status=APPROVED
  // -------------------------------------------------------
  @Roles(Role.SUPER_ADMIN)
  @Get('companies')
  async getCompanies(@Query() filter: FilterCompaniesDto) {
    return this.service.getCompanies(filter);
  }

  // -------------------------------------------------------
  // GET /api/admin/export/students
  // تصدير جميع الطلاب كملف CSV بدعم العربية الكاملة
  // -------------------------------------------------------
  @Roles(Role.SUPER_ADMIN, Role.UNIVERSITY_ADMIN)
  @Get('export/students')
  async exportStudents(@Res() res: Response) {
    const csv = await this.service.exportStudentsCsv();
    const filename = `students-${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }

  // -------------------------------------------------------
  // GET /api/admin/export/companies
  // تصدير جميع الشركات كملف CSV بدعم العربية الكاملة
  // -------------------------------------------------------
  @Roles(Role.SUPER_ADMIN)
  @Get('export/companies')
  async exportCompanies(@Res() res: Response) {
    const csv = await this.service.exportCompaniesCsv();
    const filename = `companies-${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }
}
