import { OpenAPIHono } from '@hono/zod-openapi';
import type { PinoLogger } from 'hono-pino';
import { HTTPException } from 'hono/http-exception';
import env from './src/env.ts';
import logger from './src/middleware/logger.ts';
import type { ErrorResponse } from './src/models/api.ts';

interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
}

const app = new OpenAPIHono<AppBindings>();

app.use(logger());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.notFound((c) => {
  return c.json<ErrorResponse>(
    {
      success: false,
      error: 'Not Found',
    },
    404,
  );
});

app.onError((e, c) => {
  if (e instanceof HTTPException) {
    const errResponse =
      e.res ??
      c.json<ErrorResponse>(
        {
          success: false,
          error: e.message,
          isFormError:
            e.cause && typeof e.cause === 'object' && 'form' in e.cause
              ? e.cause.form === true
              : false,
        },
        e.status,
      );

    return errResponse;
  }

  return c.json<ErrorResponse>(
    {
      success: false,
      error:
        env.DENO_ENV === 'production'
          ? 'Internal Server Error'
          : (e.stack ?? e.message),
    },
    500,
  );
});

// The OpenAPI documentation will be available at /doc
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
});

export default app;
