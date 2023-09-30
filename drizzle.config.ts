import type { Config } from "drizzle-kit";

export default {
  schema: "./app/database/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env["DATABASE_URL"] as string,
  },
} satisfies Config;
