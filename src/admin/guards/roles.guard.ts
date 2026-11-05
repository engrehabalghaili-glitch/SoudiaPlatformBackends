import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/roles.decorator';

/**
 * RolesGuard — حارس الصلاحيات
 *
 * يتحقق من أن المستخدم الحالي يمتلك الدور المطلوب
 * المحدد عبر @Roles(...) decorator.
 *
 * ملاحظة: في هذه المرحلة، الـ guard مُعدّ ومجهّز،
 * وسيُفعَّل بالكامل مع نظام JWT Auth في المرحلة القادمة.
 * حالياً: إذا لم تكن هناك أدوار محددة، يُسمح بالوصول.
 * إذا كانت هناك أدوار، يتحقق من request.user.role.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // جلب الأدوار المطلوبة من الـ metadata
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // إذا لم تكن هناك أدوار محددة — يُسمح بالوصول
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // في المرحلة القادمة: سيُضاف JWT Guard ويُعبّأ request.user
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role?: Role } }>();
    const user = request.user;

    // إذا لم يكن هناك مستخدم مُصادق — يُسمح مؤقتاً في التطوير
    // TODO: استبدل بـ false عند تفعيل JWT Auth
    if (!user) {
      return true;
    }

    return requiredRoles.includes(user.role as Role);
  }
}
