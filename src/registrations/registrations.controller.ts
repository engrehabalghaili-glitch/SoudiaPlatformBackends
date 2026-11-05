import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RegistrationsService } from './registrations.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateCompanyDto } from './dto/create-company.dto';

/**
 * RegistrationsController
 *
 * POST /api/registrations/student — تسجيل طالب جديد
 * POST /api/registrations/company — تسجيل شركة جديدة
 *
 * @Throttle صارم على مستوى الـ Controller: 5 طلبات / دقيقة
 * لحماية نماذج التسجيل من الإغراق (Spam).
 */
@Throttle({ default: { limit: 5, ttl: 60000 } })
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly service: RegistrationsService) {}

  /**
   * POST /api/registrations/student
   * يستقبل بيانات الطالب، يتحقق منها، يحفظها، ويرسل إشعار البريد.
   */
  @Post('student')
  @HttpCode(HttpStatus.CREATED)
  async registerStudent(@Body() dto: CreateStudentDto) {
    return this.service.createStudent(dto);
  }

  /**
   * POST /api/registrations/company
   * يستقبل بيانات الشركة، يتحقق منها، يحفظها، ويرسل إشعار البريد.
   */
  @Post('company')
  @HttpCode(HttpStatus.CREATED)
  async registerCompany(@Body() dto: CreateCompanyDto) {
    return this.service.createCompany(dto);
  }
}
