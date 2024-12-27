import app from "./app.ts";
import env from "./src/env.ts";

Deno.serve({ port: env.PORT }, app.fetch);
