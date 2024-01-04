import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import "dotenv/config";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["local", "development", "production"]),
    OPEN_AI_API_KEY: z.string().optional(),
    LANGCHAIN_TRACING_V2: z.string().optional(),
    LANGCHAIN_ENDPOINT: z.string().url().optional(),
    LANGCHAIN_API_KEY: z.string().optional(),
    LANGCHAIN_PROJECT: z.string().optional(),
  },
  runtimeEnv: process.env,
});
