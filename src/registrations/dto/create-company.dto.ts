import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * CreateCompanyDto — بيانات طلب تسجيل الشركة
 * يُستخدم مع ValidationPipe لضمان صحة البيانات الواردة.
 */
export class CreateCompanyDto {
  @IsString({ message: 'اسم الشركة يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'اسم الشركة مطلوب' })
  companyName: string;

  @IsString({ message: 'اسم المسؤول يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'اسم المسؤول مطلوب' })
  contactPerson: string;

  @IsEmail({}, { message: 'صيغة البريد الإلكتروني الرسمي غير صحيحة' })
  @IsNotEmpty({ message: 'البريد الإلكتروني الرسمي مطلوب' })
  officialEmail: string;

  @IsString({ message: 'رقم الجوال يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'رقم الجوال مطلوب' })
  @Matches(/^[+\d\s\-()]{7,20}$/, { message: 'صيغة رقم الجوال غير صحيحة' })
  phone: string;

  @IsString({ message: 'المدينة يجب أن تكون نصاً' })
  @IsNotEmpty({ message: 'المدينة مطلوبة' })
  city: string;

  @IsString({ message: 'المنطقة يجب أن تكون نصاً' })
  @IsNotEmpty({ message: 'المنطقة مطلوبة' })
  region: string;

  @IsString({ message: 'قطاع الشركة يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'قطاع الشركة مطلوب' })
  industry: string;

  @Type(() => Number)
  @IsInt({ message: 'عدد المتدربين يجب أن يكون رقماً صحيحاً' })
  @Min(1, { message: 'عدد المتدربين يجب أن يكون 1 على الأقل' })
  expectedTraineesCount: number;

  @IsString({ message: 'مجالات التدريب يجب أن تكون نصاً' })
  @IsNotEmpty({ message: 'مجالات التدريب مطلوبة' })
  trainingFields: string;
}
