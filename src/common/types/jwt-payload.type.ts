// JwtPayload: minimal shape stored in JWTs
import { Role } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};
