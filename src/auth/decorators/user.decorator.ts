import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User as user } from 'src/user/user.model';

type TypeData = keyof user;

export const User = createParamDecorator(
  (data: TypeData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: user }>();
    const user = request.user;

    return data ? user[data] : user;
  },
);
