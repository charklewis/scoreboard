import { serial, mysqlTable, text, timestamp } from "drizzle-orm/mysql-core";

const user = mysqlTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  stytchId: text("stytch_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export { user };
