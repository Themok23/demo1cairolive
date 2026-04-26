import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  decimal,
  date,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';

// Persons table
export const persons = pgTable(
  'persons',
  {
    id: varchar('id', { length: 36 }).primaryKey(),

    // Bilingual name + content fields
    firstNameEn: varchar('first_name_en', { length: 255 }).notNull(),
    firstNameAr: varchar('first_name_ar', { length: 255 }),
    lastNameEn:  varchar('last_name_en',  { length: 255 }).notNull(),
    lastNameAr:  varchar('last_name_ar',  { length: 255 }),
    bioEn:              text('bio_en'),
    bioAr:              text('bio_ar'),
    // KRTK2: short tagline (1 sentence) — distinct from full bio
    taglineEn:          varchar('tagline_en', { length: 280 }),
    taglineAr:          varchar('tagline_ar', { length: 280 }),
    shortBioEn:         text('short_bio_en'),
    shortBioAr:         text('short_bio_ar'),
    currentPositionEn:  varchar('current_position_en', { length: 255 }),
    currentPositionAr:  varchar('current_position_ar', { length: 255 }),
    currentCompanyEn:   varchar('current_company_en',  { length: 255 }),
    currentCompanyAr:   varchar('current_company_ar',  { length: 255 }),
    locationEn:         varchar('location_en',          { length: 255 }),
    locationAr:         varchar('location_ar',          { length: 255 }),

    // Language-neutral fields
    email:           varchar('email',        { length: 255 }).notNull().unique(),
    phoneNumber:     varchar('phone_number', { length: 20 }),
    dateOfBirth:     date('date_of_birth'),
    gender:          varchar('gender', { length: 20 }).default('prefer-not-to-say'),
    profileImageUrl: text('profile_image_url'),
    coverImageUrl:   text('cover_image_url'),
    tier:            varchar('tier', { length: 20 }).default('bronze').notNull(),
    isVerified:      boolean('is_verified').default(false),
    isClaimed:       boolean('is_claimed').default(false),
    claimedBy:       varchar('claimed_by', { length: 36 }),
    keywords:        text('keywords'), // JSON stringified array
    linkedinUrl:     text('linkedin_url'),
    twitterUrl:      text('twitter_url'),
    instagramUrl:    text('instagram_url'),
    websiteUrl:      text('website_url'),
    // KRTK profile analytics counters (Rec 7)
    viewCount:            integer('view_count').default(0).notNull(),
    shareCount:           integer('share_count').default(0).notNull(),
    vcardDownloadCount:   integer('vcard_download_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx:     index('persons_email_idx').on(table.email),
    tierIdx:      index('persons_tier_idx').on(table.tier),
    createdAtIdx: index('persons_created_at_idx').on(table.createdAt),
  })
);

// Articles table
export const articles = pgTable(
  'articles',
  {
    id: varchar('id', { length: 36 }).primaryKey(),

    // Bilingual content fields
    titleEn:   varchar('title_en',   { length: 500 }).notNull(),
    titleAr:   varchar('title_ar',   { length: 500 }),
    slugEn:    varchar('slug_en',    { length: 500 }).notNull().unique(),
    slugAr:    varchar('slug_ar',    { length: 500 }),
    contentEn: text('content_en').notNull(),
    contentAr: text('content_ar'),
    excerptEn: text('excerpt_en').notNull(),
    excerptAr: text('excerpt_ar'),

    // Language-neutral fields
    authorId:        varchar('author_id',   { length: 36  }).notNull(),
    authorName:      varchar('author_name', { length: 255 }).notNull(),
    featuredImageUrl: text('featured_image_url'),
    status:          varchar('status', { length: 20 }).default('draft').notNull(),
    publishedAt:     timestamp('published_at', { withTimezone: true }),
    createdAt:       timestamp('created_at',   { withTimezone: true }).defaultNow().notNull(),
    updatedAt:       timestamp('updated_at',   { withTimezone: true }).defaultNow().notNull(),
    tags:            text('tags'), // JSON stringified array
    category:        varchar('category', { length: 100 }),
    readTimeMinutes: integer('read_time_minutes').default(0),
    viewCount:       integer('view_count').default(0),
    malePersonId:    varchar('male_person_id',   { length: 36 }),
    femalePersonId:  varchar('female_person_id', { length: 36 }),
  },
  (table) => ({
    slugEnIdx:      index('articles_slug_en_idx').on(table.slugEn),
    authorIdx:      index('articles_author_idx').on(table.authorId),
    statusIdx:      index('articles_status_idx').on(table.status),
    publishedAtIdx: index('articles_published_at_idx').on(table.publishedAt),
    malePersonIdx:  index('articles_male_person_idx').on(table.malePersonId),
    femalePersonIdx:index('articles_female_person_idx').on(table.femalePersonId),
  })
);

// Submissions table
export const submissions = pgTable(
  'submissions',
  {
    id:               varchar('id',           { length: 36 }).primaryKey(),
    firstName:        varchar('first_name',   { length: 255 }).notNull(),
    lastName:         varchar('last_name',    { length: 255 }).notNull(),
    email:            varchar('email',        { length: 255 }).notNull(),
    phoneNumber:      varchar('phone_number', { length: 20  }),
    dateOfBirth:      date('date_of_birth'),
    gender:           varchar('gender',       { length: 20  }).default('prefer-not-to-say'),
    bio:              text('bio'),
    profileImageUrl:  text('profile_image_url'),
    currentPosition:  varchar('current_position', { length: 255 }),
    currentCompany:   varchar('current_company',  { length: 255 }),
    location:         varchar('location',          { length: 255 }),
    keywords:         text('keywords'),
    linkedinUrl:      text('linkedin_url'),
    twitterUrl:       text('twitter_url'),
    instagramUrl:     text('instagram_url'),
    websiteUrl:       text('website_url'),
    status:           varchar('status', { length: 20 }).default('pending').notNull(),
    submittedBy:      varchar('submitted_by', { length: 255 }).notNull(),
    reviewedBy:       varchar('reviewed_by',  { length: 36  }),
    reviewNotes:      text('review_notes'),
    submittedAt:      timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
    reviewedAt:       timestamp('reviewed_at',  { withTimezone: true }),
    updatedAt:        timestamp('updated_at',   { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    statusIdx:      index('submissions_status_idx').on(table.status),
    emailIdx:       index('submissions_email_idx').on(table.email),
    submittedAtIdx: index('submissions_submitted_at_idx').on(table.submittedAt),
  })
);

// Subscribers table
export const subscribers = pgTable(
  'subscribers',
  {
    id:             varchar('id',         { length: 36  }).primaryKey(),
    email:          varchar('email',      { length: 255 }).notNull().unique(),
    firstName:      varchar('first_name', { length: 255 }),
    lastName:       varchar('last_name',  { length: 255 }),
    isActive:       boolean('is_active').default(true).notNull(),
    subscribedAt:   timestamp('subscribed_at',   { withTimezone: true }).defaultNow().notNull(),
    unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
    updatedAt:      timestamp('updated_at',       { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx:    index('subscribers_email_idx').on(table.email),
    isActiveIdx: index('subscribers_is_active_idx').on(table.isActive),
  })
);

// NextAuth Tables
export const accounts = pgTable(
  'account',
  {
    userId:            varchar('userId',            { length: 255 }).notNull(),
    type:              varchar('type',              { length: 255 }).notNull(),
    provider:          varchar('provider',          { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token:     text('refresh_token'),
    access_token:      text('access_token'),
    expires_at:        integer('expires_at'),
    token_type:        varchar('token_type',  { length: 255 }),
    scope:             text('scope'),
    id_token:          text('id_token'),
    session_state:     varchar('session_state', { length: 255 }),
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
    userId:       varchar('userId',       { length: 255 }).notNull(),
    expires:      timestamp('expires', { withTimezone: true }).notNull(),
  },
  (session) => ({
    userIdIdx: index('session_userId_idx').on(session.userId),
  })
);

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token:      varchar('token',      { length: 255 }).notNull(),
    expires:    timestamp('expires',  { withTimezone: true }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// ────────────────────────────────────────────────────────────────────
// D1CL Enhancement Plan v1.2 — Pillars, Places, KRTK2, Inquiries, Experiences
// Migration: schema-first via `npm run db:push`
// ────────────────────────────────────────────────────────────────────

// Pillars — top-level categories (Tourism, Restaurants, Heritage, Arts, Tech)
export const pillars = pgTable(
  'pillars',
  {
    id:            varchar('id',             { length: 36 }).primaryKey(),
    slug:          varchar('slug',           { length: 100 }).notNull().unique(),
    nameEn:        varchar('name_en',        { length: 100 }).notNull(),
    nameAr:        varchar('name_ar',        { length: 100 }),
    descriptionEn: text('description_en'),
    descriptionAr: text('description_ar'),
    iconKey:       varchar('icon_key',       { length: 50 }),    // lucide icon name
    coverImageUrl: text('cover_image_url'),
    displayOrder:  integer('display_order').default(0).notNull(),
    isActive:      boolean('is_active').default(true).notNull(),
    createdAt:     timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt:     timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx:         index('pillars_slug_idx').on(table.slug),
    isActiveIdx:     index('pillars_is_active_idx').on(table.isActive),
    displayOrderIdx: index('pillars_display_order_idx').on(table.displayOrder),
  })
);

// Places — restaurants, museums, landmarks, cafés, shops
export const places = pgTable(
  'places',
  {
    id:               varchar('id',             { length: 36 }).primaryKey(),
    slug:             varchar('slug',           { length: 200 }).notNull().unique(),
    pillarId:         varchar('pillar_id',      { length: 36 }).notNull(),
    type:             varchar('type',           { length: 30 }).notNull(),  // restaurant, museum, landmark, cafe, shop
    nameEn:           varchar('name_en',        { length: 200 }).notNull(),
    nameAr:           varchar('name_ar',        { length: 200 }),
    taglineEn:        varchar('tagline_en',     { length: 280 }),
    taglineAr:        varchar('tagline_ar',     { length: 280 }),
    descriptionEn:    text('description_en'),
    descriptionAr:    text('description_ar'),
    locationEn:       varchar('location_en',    { length: 255 }),
    locationAr:       varchar('location_ar',    { length: 255 }),
    mapUrl:           text('map_url'),
    latitude:         decimal('latitude',  { precision: 10, scale: 7 }),
    longitude:        decimal('longitude', { precision: 10, scale: 7 }),
    phone:            varchar('phone',          { length: 30 }),
    email:            varchar('email',          { length: 200 }),
    websiteUrl:       text('website_url'),
    instagramUrl:     text('instagram_url'),
    openingHoursJson: text('opening_hours_json'),
    coverImageUrl:    text('cover_image_url'),
    galleryImagesJson:text('gallery_images_json'),
    isFeatured:       boolean('is_featured').default(false).notNull(),
    status:           varchar('status', { length: 20 }).default('draft').notNull(),
    createdAt:        timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt:        timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx:     index('places_slug_idx').on(table.slug),
    pillarIdx:   index('places_pillar_idx').on(table.pillarId),
    typeIdx:     index('places_type_idx').on(table.type),
    statusIdx:   index('places_status_idx').on(table.status),
    featuredIdx: index('places_featured_idx').on(table.isFeatured),
  })
);

// place_persons — M2M between places and persons with role label (Decision 4)
export const placePersons = pgTable(
  'place_persons',
  {
    placeId:   varchar('place_id',  { length: 36 }).notNull(),
    personId:  varchar('person_id', { length: 36 }).notNull(),
    role:      varchar('role',      { length: 50 }).notNull(),  // chef, owner, manager, curator, etc.
    roleEn:    varchar('role_en',   { length: 100 }),
    roleAr:    varchar('role_ar',   { length: 100 }),
    displayOrder: integer('display_order').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pk:        primaryKey({ columns: [table.placeId, table.personId, table.role] }),
    placeIdx:  index('place_persons_place_idx').on(table.placeId),
    personIdx: index('place_persons_person_idx').on(table.personId),
  })
);

// person_education — KRTK2 sub-resource (optional, hidden when empty)
export const personEducation = pgTable(
  'person_education',
  {
    id:            varchar('id',             { length: 36 }).primaryKey(),
    personId:      varchar('person_id',      { length: 36 }).notNull(),
    institutionEn: varchar('institution_en', { length: 200 }).notNull(),
    institutionAr: varchar('institution_ar', { length: 200 }),
    degreeEn:      varchar('degree_en',      { length: 100 }),
    degreeAr:      varchar('degree_ar',      { length: 100 }),
    fieldEn:       varchar('field_en',       { length: 200 }),
    fieldAr:       varchar('field_ar',       { length: 200 }),
    fromYear:      integer('from_year'),
    toYear:        integer('to_year'),
    imageUrl:      text('image_url'),
    displayOrder:  integer('display_order').default(0).notNull(),
    createdAt:     timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    personIdx: index('person_education_person_idx').on(table.personId),
  })
);

// person_workplace — KRTK2 sub-resource
export const personWorkplace = pgTable(
  'person_workplace',
  {
    id:            varchar('id',             { length: 36 }).primaryKey(),
    personId:      varchar('person_id',      { length: 36 }).notNull(),
    companyEn:     varchar('company_en',     { length: 200 }).notNull(),
    companyAr:     varchar('company_ar',     { length: 200 }),
    positionEn:    varchar('position_en',    { length: 200 }),
    positionAr:    varchar('position_ar',    { length: 200 }),
    descriptionEn: text('description_en'),
    descriptionAr: text('description_ar'),
    fromDate:      date('from_date'),
    toDate:        date('to_date'),
    isCurrent:     boolean('is_current').default(false).notNull(),
    imageUrl:      text('image_url'),
    displayOrder:  integer('display_order').default(0).notNull(),
    createdAt:     timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    personIdx:    index('person_workplace_person_idx').on(table.personId),
    isCurrentIdx: index('person_workplace_is_current_idx').on(table.isCurrent),
  })
);

// person_achievement — KRTK2 sub-resource (top 2-3 awards/articles)
export const personAchievement = pgTable(
  'person_achievement',
  {
    id:               varchar('id',             { length: 36 }).primaryKey(),
    personId:         varchar('person_id',      { length: 36 }).notNull(),
    titleEn:          varchar('title_en',       { length: 280 }).notNull(),
    titleAr:          varchar('title_ar',       { length: 280 }),
    descriptionEn:    text('description_en'),
    descriptionAr:    text('description_ar'),
    imageUrl:         text('image_url'),
    iconKey:          varchar('icon_key',       { length: 50 }),
    externalLink:     text('external_link'),
    relatedArticleId: varchar('related_article_id', { length: 36 }),  // optional FK to articles
    displayOrder:     integer('display_order').default(0).notNull(),
    createdAt:        timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    personIdx: index('person_achievement_person_idx').on(table.personId),
  })
);

// person_service — KRTK2 sub-resource (services offered)
export const personService = pgTable(
  'person_service',
  {
    id:            varchar('id',             { length: 36 }).primaryKey(),
    personId:      varchar('person_id',      { length: 36 }).notNull(),
    titleEn:       varchar('title_en',       { length: 200 }).notNull(),
    titleAr:       varchar('title_ar',       { length: 200 }),
    descriptionEn: text('description_en'),
    descriptionAr: text('description_ar'),
    imageUrl:      text('image_url'),
    externalLink:  text('external_link'),
    priceText:     varchar('price_text',     { length: 100 }),  // free-form ("From $50/hr")
    displayOrder:  integer('display_order').default(0).notNull(),
    isActive:      boolean('is_active').default(true).notNull(),
    createdAt:     timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    personIdx:   index('person_service_person_idx').on(table.personId),
    isActiveIdx: index('person_service_is_active_idx').on(table.isActive),
  })
);

// person_product — KRTK2 sub-resource (products sold)
export const personProduct = pgTable(
  'person_product',
  {
    id:            varchar('id',             { length: 36 }).primaryKey(),
    personId:      varchar('person_id',      { length: 36 }).notNull(),
    titleEn:       varchar('title_en',       { length: 200 }).notNull(),
    titleAr:       varchar('title_ar',       { length: 200 }),
    descriptionEn: text('description_en'),
    descriptionAr: text('description_ar'),
    imageUrl:      text('image_url'),
    externalLink:  text('external_link'),
    priceText:     varchar('price_text',     { length: 100 }),
    displayOrder:  integer('display_order').default(0).notNull(),
    isActive:      boolean('is_active').default(true).notNull(),
    createdAt:     timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    personIdx:   index('person_product_person_idx').on(table.personId),
    isActiveIdx: index('person_product_is_active_idx').on(table.isActive),
  })
);

// krtk_inquiries — visitor-to-profile contact form (PRIMARY MONETIZATION TABLE)
export const krtkInquiries = pgTable(
  'krtk_inquiries',
  {
    id:          varchar('id',          { length: 36 }).primaryKey(),
    krtkSlug:    varchar('krtk_slug',   { length: 200 }).notNull(),  // person id or future polymorphic key
    senderName:  varchar('sender_name', { length: 200 }).notNull(),
    senderEmail: varchar('sender_email',{ length: 200 }).notNull(),
    senderPhone: varchar('sender_phone',{ length: 30 }),
    subject:     varchar('subject',     { length: 280 }),
    message:     text('message').notNull(),
    status:      varchar('status',      { length: 20 }).default('new').notNull(),  // new, read, forwarded, archived
    forwardedAt: timestamp('forwarded_at', { withTimezone: true }),
    forwardedTo: varchar('forwarded_to',{ length: 200 }),  // email it was forwarded to
    metaJson:    text('meta_json'),  // user agent, referrer, IP-prefix etc.
    createdAt:   timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    krtkSlugIdx:  index('krtk_inquiries_krtk_slug_idx').on(table.krtkSlug),
    statusIdx:    index('krtk_inquiries_status_idx').on(table.status),
    createdAtIdx: index('krtk_inquiries_created_at_idx').on(table.createdAt),
  })
);

// experiences — Cairo Live Experiences UGC layer (free to submit, free to view)
export const experiences = pgTable(
  'experiences',
  {
    id:                  varchar('id',                  { length: 36 }).primaryKey(),
    slug:                varchar('slug',                { length: 200 }).notNull().unique(),
    type:                varchar('type',                { length: 30 }).notNull(),  // visit, book_review, trip, event
    pillarId:            varchar('pillar_id',           { length: 36 }),  // optional
    placeId:             varchar('place_id',            { length: 36 }),  // optional
    titleEn:             varchar('title_en',            { length: 280 }).notNull(),
    titleAr:             varchar('title_ar',            { length: 280 }),
    summaryEn:           text('summary_en'),
    summaryAr:           text('summary_ar'),
    contentEn:           text('content_en'),
    contentAr:           text('content_ar'),
    coverImageUrl:       text('cover_image_url'),
    galleryImagesJson:   text('gallery_images_json'),
    videoUrlsJson:       text('video_urls_json'),
    submittedByPersonId: varchar('submitted_by_person_id', { length: 36 }),  // optional FK to persons
    submittedByName:     varchar('submitted_by_name',  { length: 200 }),
    submittedByEmail:    varchar('submitted_by_email', { length: 200 }),
    status:              varchar('status', { length: 20 }).default('pending').notNull(),  // pending, published, rejected
    moderationScoreJson: text('moderation_score_json'),  // AI moderation result (Rec 6)
    rejectionReason:     text('rejection_reason'),
    likeCount:           integer('like_count').default(0).notNull(),
    viewCount:           integer('view_count').default(0).notNull(),
    createdAt:           timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    publishedAt:         timestamp('published_at', { withTimezone: true }),
    updatedAt:           timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx:        index('experiences_slug_idx').on(table.slug),
    typeIdx:        index('experiences_type_idx').on(table.type),
    pillarIdx:      index('experiences_pillar_idx').on(table.pillarId),
    placeIdx:       index('experiences_place_idx').on(table.placeId),
    statusIdx:      index('experiences_status_idx').on(table.status),
    publishedAtIdx: index('experiences_published_at_idx').on(table.publishedAt),
  })
);

// experience_reactions — likes / visited / wishlist on experiences
export const experienceReactions = pgTable(
  'experience_reactions',
  {
    id:           varchar('id',           { length: 36 }).primaryKey(),
    experienceId: varchar('experience_id',{ length: 36 }).notNull(),
    type:         varchar('type',         { length: 20 }).notNull(),  // like, visited, wishlist
    userIdentifier: varchar('user_identifier', { length: 200 }).notNull(),  // email or anonymous IP-hash
    createdAt:    timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.experienceId, table.type, table.userIdentifier] }),
    experienceIdx: index('experience_reactions_experience_idx').on(table.experienceId),
  })
);

// experience_comments — comments on experiences (admin-moderated)
export const experienceComments = pgTable(
  'experience_comments',
  {
    id:            varchar('id',             { length: 36 }).primaryKey(),
    experienceId:  varchar('experience_id',  { length: 36 }).notNull(),
    commenterName: varchar('commenter_name', { length: 200 }).notNull(),
    commenterEmail:varchar('commenter_email',{ length: 200 }),
    contentEn:     text('content_en'),
    contentAr:     text('content_ar'),
    isApproved:    boolean('is_approved').default(false).notNull(),
    createdAt:     timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    experienceIdx: index('experience_comments_experience_idx').on(table.experienceId),
    approvedIdx:   index('experience_comments_approved_idx').on(table.isApproved),
  })
);
