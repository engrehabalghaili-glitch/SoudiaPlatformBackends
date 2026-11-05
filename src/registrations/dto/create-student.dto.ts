import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * CreateStudentDto — بيانات طلب التسجيل للطالب
 * يُستخدم مع ValidationPipe لضمان صحة البيانات الواردة.
 */
export class CreateStudentDto {
  @IsString({ message: 'الاسم الكامل يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'الاسم الكامل مطلوب' })
  fullName: string;

  @IsEmail({}, { message: 'صيغة البريد الإلكتروني غير صحيحة' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @IsString({ message: 'رقم الجوال يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'رقم الجوال مطلوب' })
  @Matches(/^[+\d\s\-()]{7,20}$/, { message: 'صيغة رقم الجوال غير صحيحة' })
  phone: string;

  @IsString({ message: 'اسم الجامعة يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'اسم الجامعة مطلوب' })
  university: string;

  @IsString({ message: 'التخصص يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'التخصص مطلوب' })
  major: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'المعدل التراكمي يجب أن يكون رقماً' })
  @Min(0, { message: 'المعدل لا يمكن أن يكون أقل من 0' })
  @Max(5, { message: 'المعدل لا يمكن أن يتجاوز 5' })
  gpa?: number;

  @IsString({ message: 'المدينة يجب أن تكون نصاً' })
  @IsNotEmpty({ message: 'المدينة مطلوبة' })
  city: string;

  @IsString({ message: 'المنطقة يجب أن تكون نصاً' })
  @IsNotEmpty({ message: 'المنطقة مطلوبة' })
  region: string;

  @IsOptional()
  @IsUrl({}, { message: 'رابط السيرة الذاتية غير صحيح' })
  cvUrl?: string;

  @IsString({ message: 'المهارات يجب أن تكون نصاً' })
  @IsNotEmpty({ message: 'المهارات مطلوبة' })
  skills: string;
}
