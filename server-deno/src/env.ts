import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  DENO_ENV: z.string().default("development"),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"]),
  PORT: z.coerce.number().default(9999),
});

const env = EnvSchema.parse(Deno.env.toObject());

export default env;
