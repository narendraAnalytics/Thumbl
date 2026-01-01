import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkUserId: text('clerk_user_id').unique().notNull(),
  email: text('email'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const thumbnails = pgTable('thumbnails', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  imagekitUrl: text('imagekit_url').notNull(),
  imagekitFileId: text('imagekit_file_id').notNull(),
  headline: text('headline'),
  prompt: text('prompt').notNull(),
  language: text('language').notNull(),
  size: text('size'),
  aspectRatio: text('aspect_ratio').notNull(),
  style: text('style').notNull(),
  searchContext: text('search_context'),
  groundingLinks: jsonb('grounding_links').$type<{ title: string; uri: string }[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
