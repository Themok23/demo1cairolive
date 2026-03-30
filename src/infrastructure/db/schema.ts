import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  date,
  primaryKey,
  index,
  unique,
} from 'drizzle-orm/pg-core';

// Persons table
export const persons = pgTable(
  'persons',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phoneNumber: varchar('phone_number', { length: 20 }),
    dateOfBirth: date('date_of_birth'),
    gender: varchar('gender', { length: 20 }).default('prefer-not-to-say'),
    bio: text('bio'),
    profileImageUrl: text('profile_image_url'),
    coverImageUrl: text('cover_image_url'),
    currentPosition: varchar('current_position', { length: 255 }),
    currentCompany: varchar('current_company', { length: 255 }),
    location: varchar('location', { length: 255 }),
    tier: varchar('tier', { length: 20 }).default('bronze').notNull(),
    isVerified: boolean('is_verified').default(false),
    isClaimed: boolean('is_claimed').default(false),
    claimedBy: varchar('claimed_by', { length: 36 }),
    keywords: text('keywords'), // JSON stringified array
    linkedinUrl: text('linkedin_url'),
    twitterUrl: text('twitter_url'),
    instagramUrl: text('instagram_url'),
    websiteUrl: text('website_url'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailIdx: index('persons_email_idx').on(table.email),
    tierIdx: index('persons_tier_idx').on(table.tier),
    createdAtIdx: index('persons_created_at_idx').on(table.createdAt),
  })
);

// Articles table
export const articles = pgTable(
  'articles',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 500 }).notNull().unique(),
    content: text('content').notNull(),
    excerpt: text('excerpt').notNull(),
    authorId: varchar('author_id', { length: 36 }).notNull(),
    authorName: varchar('author_name', { length: 255 }).notNull(),
    featuredImageUrl: text('featured_image_url'),
    status: varchar('status', { length: 20 }).default('draft').notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    tags: text('tags'), // JSON stringified array
    category: varchar('category', { length: 100 }),
    readTimeMinutes: integer('read_time_minutes').default(0),
    viewCount: integer('view_count').default(0),
    malePersonId: varchar('male_person_id', { length: 36 }),
    femalePersonId: varchar('female_person_id', { length: 36 }),
  },
  (table) => ({
    slugIdx: index('articles_slug_idx').on(table.slug),
    authorIdx: index('articles_author_idx').on(table.authorId),
    statusIdx: index('articles_status_idx').on(table.status),
    publishedAtIdx: index('articles_published_at_idx').on(table.publishedAt),
    malePersonIdx: index('articles_male_person_idx').on(table.malePersonId),
    femalePersonIdx: index('articles_female_person_idx').on(table.femalePersonId),
  })
);

// Submissions table
export const submissions = pgTable(
  'submissions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phoneNumber: varchar('phone_number', { length: 20 }),
    dateOfBirth: date('date_of_birth'),
    gender: varchar('gender', { length: 20 }).default('prefer-not-to-say'),
    bio: text('bio'),
    profileImageUrl: text('profile_image_url'),
    currentPosition: varchar('current_position', { length: 255 }),
    currentCompany: varchar('current_company', { length: 255 }),
    location: varchar('location', { length: 255 }),
    keywords: text('keywords'), // JSON stringified array
    linkedinUrl: text('linkedin_url'),
    twitterUrl: text('twitter_url'),
    instagramUrl: text('instagram_url'),
    websiteUrl: text('website_url'),
    status: varchar('status', { length: 20 }).default('pending').notNull(),
    submittedBy: varchar('submitted_by', { length: 255 }).notNull(),
    reviewedBy: varchar('reviewed_by', { length: 36 }),
    reviewNotes: text('review_notes'),
    submittedAt: timestamp('submitted_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    statusIdx: index('submissions_status_idx').on(table.status),
    emailIdx: index('submissions_email_idx').on(table.email),
    submittedAtIdx: index('submissions_submitted_at_idx').on(table.submittedAt),
  })
);

// Subscribers table
export const subscribers = pgTable(
  'subscribers',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    firstName: varchar('first_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }),
    isActive: boolean('is_active').default(true).notNull(),
    subscribedAt: timestamp('subscribed_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailIdx: index('subscribers_email_idx').on(table.email),
    isActiveIdx: index('subscribers_is_active_idx').on(table.isActive),
  })
);

// NextAuth Tables
export const accounts = pgTable(
  'account',
  {
    userId: varchar('userId', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: varchar('session_state', { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable(
  'session',
  {
    sessionToken: varchar('sessionToken', { length: 255 }).primaryKey(),
    userId: varchar('userId', { length: 255 }).notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (session) => ({
    userIdIdx: index('session_userId_idx').on(session.userId),
  })
);

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({
      columns: [vt.identifier, vt.token],
    }),
  })
);