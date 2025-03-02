import { z } from 'zod';

export const userRoles = ['admin', 'user'] as const;

export const SessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
});

export type UserSessionData = z.infer<typeof SessionSchema>;

export type UserRoleType = (typeof userRoles)[number];
