import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;
