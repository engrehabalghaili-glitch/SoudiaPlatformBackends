import { IsEnum, IsOptional, IsString } from 'class-validator';

/** قيم الحالة المسموحة في الفلتر */
export enum RegistrationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

/**
 * FilterStudentsDto — Query params لفلترة قائمة الطلاب
 * مثال: GET /api/admin/students?region=الرياض&status=PENDING
 */
export class FilterStudentsDto {
  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsEnum(RegistrationStatus, {
    message: 'الحالة يجب أن تكون: PENDING أو APPROVED أو REJECTED',
  })
  status?: RegistrationStatus;
}

/**
 * FilterCompaniesDto — Query params لفلترة قائمة الشركات
 * مثال: GET /api/admin/companies?region=جدة&status=APPROVED
 */
export class FilterCompaniesDto {
  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsEnum(RegistrationStatus, {
    message: 'الحالة يجب أن تكون: PENDING أو APPROVED أو REJECTED',
  })
  status?: RegistrationStatus;
}
