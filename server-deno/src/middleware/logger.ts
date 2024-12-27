import { pinoLogger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";
import env from "../env.ts";

function logger() {
  return pinoLogger({
    pino: pino(
      { level: env.LOG_LEVEL },
      env.DENO_ENV === "production" ? undefined : pretty(),
    ),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}

export default logger;
