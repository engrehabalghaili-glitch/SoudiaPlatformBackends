import { SetMetadata } from '@nestjs/common';

/**
 * الأدوار المتاحة في النظام
 */
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  UNIVERSITY_ADMIN = 'UNIVERSITY_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
}

/** مفتاح الميتاداتا لحفظ الأدوار المطلوبة */
export const ROLES_KEY = 'roles';

/**
 * @Roles(...roles) — Decorator لتحديد الأدوار المسموحة بالوصول
 *
 * مثال:
 *   @Roles(Role.SUPER_ADMIN)
 *   @Get('students')
 *   findAll() { ... }
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
