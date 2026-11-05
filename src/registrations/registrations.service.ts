import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class RegistrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  // -------------------------------------------------------
  // تسجيل طالب جديد
  // -------------------------------------------------------
  async createStudent(dto: CreateStudentDto) {
    // التحقق من عدم تسجيل البريد مسبقاً
    const existing = await this.prisma.studentRegistration.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException(
        'هذا البريد الإلكتروني مسجّل مسبقاً في النظام',
      );
    }

    let student;
    try {
      student = await this.prisma.studentRegistration.create({ data: dto });
    } catch {
      throw new InternalServerErrorException('حدث خطأ أثناء حفظ بيانات الطالب');
    }

    // إرسال إشعار بريدي — بشكل غير متزامن (لا يوقف الاستجابة)
    void this.mail.sendStudentRegistrationAlert({ ...student });

    return {
      success: true,
      message: 'تم استلام طلبك بنجاح، سيتم التواصل معك قريباً',
      data: { id: student.id, status: student.status },
    };
  }

  // -------------------------------------------------------
  // تسجيل شركة جديدة
  // -------------------------------------------------------
  async createCompany(dto: CreateCompanyDto) {
    // التحقق من عدم تسجيل البريد مسبقاً
    const existing = await this.prisma.companyRegistration.findUnique({
      where: { officialEmail: dto.officialEmail },
    });

    if (existing) {
      throw new ConflictException(
        'هذا البريد الإلكتروني الرسمي مسجّل مسبقاً في النظام',
      );
    }

    let company;
    try {
      company = await this.prisma.companyRegistration.create({ data: dto });
    } catch {
      throw new InternalServerErrorException('حدث خطأ أثناء حفظ بيانات الشركة');
    }

    // إرسال إشعار بريدي — بشكل غير متزامن
    void this.mail.sendCompanyRegistrationAlert({ ...company });

    return {
      success: true,
      message: 'تم استلام طلب شركتك بنجاح، سيتم التواصل معكم قريباً',
      data: { id: company.id, status: company.status },
    };
  }
}
