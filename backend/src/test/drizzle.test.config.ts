import { defineConfig } from "drizzle-kit";

export const TEST_DB_URL = process.env.DATABASE_URL as string;

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/test/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: TEST_DB_URL,
  },
  verbose: true,
  strict: true,
});
