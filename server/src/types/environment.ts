import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
});

export type Envs = z.infer<typeof EnvSchema>;
