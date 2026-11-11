import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const storeRequests = pgTable("sifr_requests", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
export const insertStoreRequestSchema = createInsertSchema(storeRequests);
export type StoreRequest = typeof storeRequests.$inferSelect;
