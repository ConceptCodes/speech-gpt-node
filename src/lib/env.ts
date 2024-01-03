import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import "dotenv/config";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["local", "development", "production"]),
    OPEN_AI_API_KEY: z.string().optional(),
  },
  runtimeEnv: process.env,
});
