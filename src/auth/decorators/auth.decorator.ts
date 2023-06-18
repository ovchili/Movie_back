import { UseGuards, applyDecorators } from '@nestjs/common';
import { onlyAdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { TypeRole } from '../auth.interface';

export const Auth = (role: TypeRole = 'user') =>
  applyDecorators(
    role === 'admin'
      ? UseGuards(JwtAuthGuard, onlyAdminGuard)
      : UseGuards(JwtAuthGuard),
  );
