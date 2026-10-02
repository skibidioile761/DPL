import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const discordProfiles = pgTable("discord_profiles", {
  id: serial("id").primaryKey(),
  discordId: varchar("discord_id", { length: 40 }).notNull().unique(),
  username: varchar("username", { length: 40 }).notNull().unique(),
  displayName: varchar("display_name", { length: 80 }).notNull(),
  avatarUrl: text("avatar_url").notNull(),
  bio: text("bio").notNull().default(""),
  status: varchar("status", { length: 20 }).notNull().default("online"),
  interests: text("interests")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type DiscordProfileRow = typeof discordProfiles.$inferSelect;
