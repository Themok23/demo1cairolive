# Demo1cairolive - Master Implementation Prompt

**Project Name:** Demo1cairolive (Cairo Live - People Edition)

**Tagline:** Every Egyptian has a story.

**Status:** DRAFT v1.0

**Last Updated:** 2026-03-27

---

## Executive Summary

Demo1cairolive is a content platform dedicated to publishing human-interest articles about Egyptian professionals and creators. The platform publishes regular articles featuring one male and one female Egyptian, showcasing their careers, achievements, and stories. Each featured person receives a "Micro KRTK" - a shareable digital business card with its own URL and customizable profile.

The platform operates on a freemium model: platform-created profiles are free, but users can claim and upgrade their profiles to premium tiers with premium analytics, custom data, and verified badges. The platform also offers a subscription system for self-service profile submissions.

---

## Project Overview

### Platform Philosophy

- **Human-Centric:** Stories about real Egyptians, told authentically
- **Celebratory:** Highlight achievement and potential
- **Accessible:** Free to read, free to be profiled (platform-created)
- **Modern:** Minimal, interactive design; smooth animations
- **Bilingual:** Full English and Arabic support throughout
- **Shareable:** Micro KRTK cards are designed for social sharing

### Target Users

1. **Readers:** Egyptians interested in success stories and professional profiles
2. **Featured People:** Those profiled on the platform (claimed their profiles)
3. **Creators:** Self-service profile submissions from professionals
4. **Admins:** Internal team managing articles, approvals, and content

### Key Features

1. **Article Publishing:** Curated articles pairing one male and one female Egyptian
2. **Micro KRTK Profiles:** Digital business cards with unique URLs
3. **People Directory:** Browsable, searchable directory of all profiled people
4. **Profile Tiers:** Free (platform-created) and Premium (claimed + upgraded)
5. **Self-Service Submissions:** Public form for people to submit their data
6. **Admin Dashboard:** Internal tools for content management
7. **Newsletter:** Email subscription to new articles and updates
8. **Authentication:** Email/password and Google OAuth for admins and premium users

---

## Tech Stack

All technical choices are made to match the proven architecture of Demo2cairolive, ensuring consistency across MOK's platform ecosystem.

### Frontend

- **Framework:** Next.js 14 (App Router)
  - Reason: Server components enable clean separation of concerns, built-in API routes
  - Data fetching happens on the server; minimal client state

- **Styling:** Tailwind CSS v3
  - Dark mode as primary design
  - Utility-first CSS for rapid iteration
  - DarkMode plugin pre-configured

- **Animations:** GSAP v3 + ScrollTrigger
  - Sophisticated scroll-triggered animations
  - Entrance animations for cards
  - Page transition animations
  - Hover effects on interactive elements

- **Localization:** next-intl v3
  - Server-side routing: `/en/` and `/ar/` prefixes
  - Context provider for client-side translations
  - Full bilingual support in all pages

- **Date Handling:** date-fns v3
  - Locale-aware formatting for English and Arabic
  - Consistent date display across the platform

### Backend

- **Database:** Neon PostgreSQL via @neondatabase/serverless
  - Serverless PostgreSQL with HTTP connections
  - No persistent connection pooling needed for Vercel
  - Automatic backups and point-in-time recovery

- **ORM:** Drizzle ORM v0.29+
  - Type-safe SQL generation
  - Zero-runtime overhead
  - Full TypeScript support for schema and queries

- **Authentication:** NextAuth.js v5
  - Email/password provider (for admin/premium users)
  - Google OAuth for frictionless login
  - JWT session strategy for serverless
  - Role-based access control (admin, free, premium)

- **Validation:** Zod v3
  - Runtime schema validation
  - Type inference from schemas
  - Consistent error messages

### Deployment & DevOps

- **Hosting:** Vercel
  - Automatic deployments from GitHub
  - Edge functions for API routes
  - Built-in analytics and monitoring
  - Environment variable management

- **Version Control:** Git + GitHub
  - Conventional commit messages
  - Feature branches with PR reviews

- **Environment Variables:**
  ```
  DATABASE_URL=postgresql://...
  NEXTAUTH_URL=https://cairolive.vercel.app
  NEXTAUTH_SECRET=<random-32-chars>
  GOOGLE_ID=<from-google-console>
  GOOGLE_SECRET=<from-google-console>
  ```

### Development Tools

- **Language:** TypeScript v5
  - Strict mode enabled
  - Full type coverage for domain layer

- **Testing Framework:** Vitest + React Testing Library
  - Unit tests for domain logic
  - Component tests for React components
  - Integration tests for API routes
  - Minimum 80% coverage requirement

- **Linting:** ESLint + Prettier
  - Airbnb config extended for React
  - Prettier for consistent formatting
  - Pre-commit hooks via Husky

- **Build Tools:** Turbo (monorepo optimization)
  - Caching for faster builds
  - Task orchestration across packages

---

## Architecture: Clean Architecture

The codebase is organized following Clean Architecture principles, ensuring testability, maintainability, and clear separation of concerns. Each layer is independent and can be tested in isolation.

### Folder Structure

```
src/
├── domain/                  # Pure business logic, zero framework dependencies
│   ├── entities/            # Data classes (Person, Article, Submission)
│   ├── value-objects/       # Gender, TierType, ArticleStatus, etc.
│   ├── repositories/        # Abstract repository interfaces
│   ├── use-cases/           # One use case = one business action
│   └── errors/              # Domain-specific error types
├── application/             # Application services and DTOs
│   ├── use-cases/           # Concrete use case implementations
│   ├── dtos/                # Data transfer objects for external communication
│   ├── mappers/             # Map between entities and DTOs
│   └── services/            # Application-level services
├── infrastructure/          # All I/O: database, external APIs, file storage
│   ├── database/            # Drizzle schemas and migrations
│   ├── repositories/        # Concrete repository implementations
│   ├── external/            # External service integrations (email, storage)
│   └── config/              # Environment configuration
├── presentation/            # Next.js UI layer
│   ├── app/                 # Next.js app router pages
│   ├── components/          # Reusable React components
│   ├── layouts/             # Layout components
│   ├── hooks/               # Custom React hooks
│   ├── api/                 # API route handlers
│   └── middleware/          # Next.js middleware (auth, logging)
├── shared/                  # Utilities, constants, helpers
│   ├── constants/           # App-wide constants (colors, sizes)
│   ├── utils/               # Pure utility functions
│   ├── types/               # Shared TypeScript types
│   └── i18n/                # Localization setup
└── index.ts                 # Entry point exports

test/
├── unit/                    # Unit tests for domain and utils
├── integration/             # Integration tests for use cases and repos
└── e2e/                     # End-to-end tests for critical user flows
```

### Layer Descriptions

#### Domain Layer (`src/domain/`)

The core of the application. Contains zero framework dependencies. This layer defines what the business does.

- **Entities:** Immutable data classes representing core concepts
  - Person: Individual profiles with all career/education data
  - Article: Published articles pairing two people
  - Submission: Self-service submissions pending review
  - Subscriber: Email subscribers

- **Value Objects:** Small immutable objects representing specific values
  - Gender: "male" | "female"
  - TierType: "free" | "premium"
  - ArticleStatus: "draft" | "published"
  - Slug: URL-friendly identifier (validated)

- **Repositories:** Abstract interfaces defining data operations
  - PersonRepository: findAll, findById, findBySlug, create, update, delete
  - ArticleRepository: findAll, findById, findBySlug, create, update, delete, publish
  - SubmissionRepository: findAll, findById, create, updateStatus
  - SubscriberRepository: findAll, create, delete, updateStatus

- **Use Cases:** One class per action. Implements business rules.
  - CreateArticleUseCase: Validates, saves article, emits event
  - ClaimProfileUseCase: Transitions person from free to claimed
  - UpgradeToPremiумUseCase: Upgrades claimed profile to premium
  - SubmitProfileUseCase: Creates submission for review
  - ApproveSubmissionUseCase: Reviews and approves/rejects submissions
  - SearchPeopleUseCase: Filters and searches people directory

- **Errors:** Domain-specific error types
  - InvalidEmailError
  - DuplicateSlugError
  - ProfileNotFoundError
  - UnauthorizedAccessError

#### Application Layer (`src/application/`)

Orchestrates use cases and adapts data for external communication. Handles DTOs and cross-cutting concerns.

- **DTOs:** Data Transfer Objects for API communication
  - PersonDTO: Data returned in API responses
  - ArticleDTO: Full article with embedded PersonDTOs
  - CreatePersonRequest: Input validation schema
  - UpdatePersonRequest: Partial updates

- **Mappers:** Convert between entities and DTOs
  - PersonMapper: Entity <-> DTO
  - ArticleMapper: Entity <-> DTO
  - One mapper per entity type

- **Services:** Application-level orchestration
  - AuthService: Login, token generation, permissions
  - NotificationService: Email sends, event notifications
  - StorageService: File uploads (profile photos, covers)

#### Infrastructure Layer (`src/infrastructure/`)

All I/O and framework integrations. Database, external APIs, file storage.

- **Database:**
  - Drizzle schemas (schema.ts, migrations/)
  - Database connection management
  - Query builders (read-only safe queries)

- **Repositories:** Concrete implementations of domain interfaces
  - DrizzlePersonRepository: Implements PersonRepository
  - DrizzleArticleRepository: Implements ArticleRepository
  - Database queries use Drizzle for type safety

- **External Services:**
  - EmailService: SendGrid or Resend integration
  - StorageService: Vercel Blob or Cloudinary for images
  - GoogleOAuthProvider: NextAuth.js integration

- **Configuration:** Environment setup
  - Database connection strings
  - API keys and secrets
  - Feature flags

#### Presentation Layer (`src/presentation/`)

Next.js UI and API routes. Thin layer that calls use cases and renders results.

- **Pages:** Next.js App Router pages
  - `/` - Homepage
  - `/articles` - Article listing
  - `/articles/[slug]` - Article detail
  - `/krtk/[slug]` - Micro KRTK profile
  - `/people` - People directory
  - `/submit` - Self-service form
  - `/admin/*` - Admin pages (protected)

- **Components:** Reusable React components
  - ArticleCard: Displays single article in grid
  - PersonCard: Micro KRTK display
  - ArticleContent: Rich text rendering
  - AdminTable: Reusable data table
  - SearchBar: Filterable search component

- **API Routes:** Next.js route handlers
  - POST /api/articles - Create article (admin)
  - GET /api/articles - List articles
  - GET /api/articles/[id] - Get single article
  - PUT /api/articles/[id] - Update article (admin)
  - DELETE /api/articles/[id] - Delete article (admin)
  - Similar pattern for people, submissions, subscribers

- **Middleware:**
  - Authentication middleware (checks NextAuth session)
  - Authorization middleware (role-based access)
  - Localization middleware (sets language from URL)
  - Logging middleware (request/response logging)

- **Hooks:** Custom React hooks
  - useAuth: Current user and auth state
  - useTranslation: i18n helper
  - useArticles: Fetch and cache articles
  - usePeople: Fetch and filter people

#### Shared Layer (`src/shared/`)

Utilities, constants, and helpers used throughout the app.

- **Constants:**
  - Color palette definitions
  - Animation timings
  - Form field configurations
  - Validation rules

- **Utils:**
  - formatDate(date, locale): Format dates for display
  - slugify(text): Generate URL-friendly slugs
  - validateEmail(email): Email validation
  - groupByGender(people): Group people by gender
  - cn(...classes): Tailwind class merger

- **Types:**
  - Common TypeScript interfaces and types
  - Re-exports from domain layer

- **i18n:**
  - Translation file structure
  - Locale detection
  - Language switcher helpers

### Data Flow

1. **User Action** (e.g., click "Submit Profile")
2. **API Route Handler** (`POST /api/submissions`)
   - Validates input with Zod
   - Creates use case instance
   - Calls use case execute
3. **Use Case** (`SubmitProfileUseCase`)
   - Checks business rules
   - Calls repository to save data
   - Returns result DTO
4. **Repository** (`DrizzleSubmissionRepository`)
   - Executes database query
   - Returns entity
5. **Mapper**
   - Converts entity to DTO
6. **API Response**
   - Returns DTO as JSON
7. **Frontend Component**
   - Receives response
   - Updates UI state
   - Shows success/error message

---

## Data Model

The database schema is designed for the specific needs of a people-focused content platform. All data is stored in PostgreSQL via Neon.

### Entity: Person

Represents an individual profiled on the platform. Every article features exactly two people: one male and one female.

```sql
TABLE persons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(255) UNIQUE NOT NULL,
  firstName       VARCHAR(100) NOT NULL,
  firstNameAr     VARCHAR(100) NOT NULL,
  lastName        VARCHAR(100) NOT NULL,
  lastNameAr      VARCHAR(100) NOT NULL,
  gender          ENUM('male', 'female') NOT NULL,
  bio             TEXT,
  bioAr           TEXT,
  photo           VARCHAR(500),
  coverPhoto      VARCHAR(500),
  currentEmployer VARCHAR(255),
  currentTitle    VARCHAR(255),
  employmentHistory JSONB DEFAULT '[]',
  certifications  JSONB DEFAULT '[]',
  education       JSONB DEFAULT '[]',
  tier            ENUM('free', 'premium') DEFAULT 'free',
  contactEmail    VARCHAR(255),
  contactPhone    VARCHAR(20),
  website         VARCHAR(500),
  linkedin        VARCHAR(500),
  twitter         VARCHAR(500),
  isVerified      BOOLEAN DEFAULT FALSE,
  isClaimed       BOOLEAN DEFAULT FALSE,
  claimedBy       UUID REFERENCES auth_users(id),
  claimedAt       TIMESTAMP,
  createdAt       TIMESTAMP DEFAULT NOW(),
  updatedAt       TIMESTAMP DEFAULT NOW(),

  -- Indexes for performance
  CREATE INDEX idx_persons_slug ON persons(slug);
  CREATE INDEX idx_persons_gender ON persons(gender);
  CREATE INDEX idx_persons_tier ON persons(tier);
  CREATE INDEX idx_persons_isClaimed ON persons(isClaimed);
)
```

**Field Descriptions:**

- `id`: Unique identifier (UUID)
- `slug`: URL-friendly identifier (lowercase, hyphens, e.g., "ahmed-essam")
- `firstName` / `firstNameAr`: First name in English and Arabic
- `lastName` / `lastNameAr`: Last name in English and Arabic
- `gender`: "male" or "female" (used in article pairing)
- `bio` / `bioAr`: Short biography in English and Arabic
- `photo`: URL to profile photo (JPG/PNG)
- `coverPhoto`: URL to cover/banner image
- `currentEmployer`: Current company name
- `currentTitle`: Current job title
- `employmentHistory`: JSONB array of employment records
  ```json
  [
    { "company": "Microsoft Egypt", "title": "Senior Engineer", "from": "2022", "to": null },
    { "company": "Google", "title": "Software Engineer", "from": "2019", "to": "2022" }
  ]
  ```
- `certifications`: JSONB array of certifications
  ```json
  [
    { "name": "AWS Solutions Architect", "issuer": "Amazon", "year": 2021 },
    { "name": "Google Cloud Professional", "issuer": "Google", "year": 2023 }
  ]
  ```
- `education`: JSONB array of educational background
  ```json
  [
    { "institution": "Cairo University", "degree": "BSc", "field": "Computer Engineering", "year": 2017 }
  ]
  ```
- `tier`: "free" (platform-created) or "premium" (claimed + upgraded)
- `contactEmail` / `contactPhone` / `website` / `linkedin` / `twitter`: Contact details (null for free tier)
- `isVerified`: Premium tier perk; shows verified badge
- `isClaimed`: TRUE if person has claimed their profile
- `claimedBy`: FK to auth user who claimed the profile
- `claimedAt`: Timestamp of claim
- `createdAt` / `updatedAt`: Timestamps

**Tier Behavior:**

Free Tier (platform-created):
- Contact fields are NULL (hidden)
- Can be viewed but not edited by non-admins
- No verified badge
- Appears in directory with read-only data

Premium Tier (claimed + upgraded):
- Contact fields are visible and editable by owner
- Verified badge displayed
- Can add custom data (website, social links, etc.)
- Analytics available (view count, article mentions)

### Entity: Article

Represents a published article featuring two people.

```sql
TABLE articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(255) UNIQUE NOT NULL,
  title           VARCHAR(255) NOT NULL,
  titleAr         VARCHAR(255) NOT NULL,
  excerpt         TEXT NOT NULL,
  excerptAr       TEXT NOT NULL,
  content         TEXT NOT NULL,
  contentAr       TEXT NOT NULL,
  coverImage      VARCHAR(500),
  malePersonId    UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  femalePersonId  UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  tags            TEXT[] DEFAULT '{}',
  status          ENUM('draft', 'published') DEFAULT 'draft',
  publishedAt     TIMESTAMP,
  createdAt       TIMESTAMP DEFAULT NOW(),
  updatedAt       TIMESTAMP DEFAULT NOW(),

  CREATE INDEX idx_articles_slug ON articles(slug);
  CREATE INDEX idx_articles_status ON articles(status);
  CREATE INDEX idx_articles_publishedAt ON articles(publishedAt DESC);
  CREATE INDEX idx_articles_malePersonId ON articles(malePersonId);
  CREATE INDEX idx_articles_femalePersonId ON articles(femalePersonId);
)
```

**Field Descriptions:**

- `id`: Unique identifier
- `slug`: URL-friendly identifier
- `title` / `titleAr`: Article headline in English and Arabic
- `excerpt` / `excerptAr`: 1-2 sentence summary
- `content` / `contentAr`: Full article body (markdown or HTML)
- `coverImage`: Feature image URL
- `malePersonId`: Foreign key to male featured person
- `femalePersonId`: Foreign key to female featured person
- `tags`: Array of tag strings for filtering (e.g., ["tech", "entrepreneurship"])
- `status`: "draft" or "published"
- `publishedAt`: Timestamp when article was published to public
- `createdAt` / `updatedAt`: Timestamps

### Entity: Submission

Represents a self-service profile submission pending admin review.

```sql
TABLE submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) NOT NULL,
  fullName        VARCHAR(255) NOT NULL,
  gender          ENUM('male', 'female') NOT NULL,
  submittedData   JSONB NOT NULL,
  status          ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  rejectionReason TEXT,
  createdAt       TIMESTAMP DEFAULT NOW(),
  reviewedAt      TIMESTAMP,
  reviewedBy      UUID REFERENCES auth_users(id),

  CREATE INDEX idx_submissions_status ON submissions(status);
  CREATE INDEX idx_submissions_email ON submissions(email);
)
```

**Field Descriptions:**

- `id`: Unique identifier
- `email`: Submitter's email
- `fullName`: Name provided in submission
- `gender`: Self-selected gender
- `submittedData`: Full form data as JSONB
  ```json
  {
    "firstName": "Ahmed",
    "lastName": "Essam",
    "bio": "Cairo-born software engineer...",
    "currentEmployer": "Microsoft",
    "currentTitle": "Senior Engineer",
    "employmentHistory": [...],
    "certifications": [...],
    "education": [...]
  }
  ```
- `status`: "pending" (awaiting review), "approved" (created person), "rejected"
- `rejectionReason`: Admin notes on why submission was rejected
- `createdAt`: When submission was created
- `reviewedAt`: When admin reviewed submission
- `reviewedBy`: FK to admin who reviewed

### Entity: Subscriber

Represents newsletter email subscribers.

```sql
TABLE subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  name            VARCHAR(100),
  isActive        BOOLEAN DEFAULT TRUE,
  subscribedAt    TIMESTAMP DEFAULT NOW(),
  unsubscribedAt  TIMESTAMP,

  CREATE INDEX idx_subscribers_email ON subscribers(email);
  CREATE INDEX idx_subscribers_isActive ON subscribers(isActive);
)
```

**Field Descriptions:**

- `id`: Unique identifier
- `email`: Email address
- `name`: Optional name
- `isActive`: TRUE if subscribed, FALSE if unsubscribed
- `subscribedAt`: When subscription was created
- `unsubscribedAt`: When unsubscribed (null if still active)

### Entity: AuthUser (NextAuth)

NextAuth.js manages user authentication. The default schema includes:

```sql
TABLE auth_users (
  id              VARCHAR(255) PRIMARY KEY,
  name            VARCHAR(255),
  email           VARCHAR(255) UNIQUE,
  emailVerified   TIMESTAMP,
  image           VARCHAR(255),
  password        VARCHAR(255),  -- hashed with bcrypt
  role            ENUM('user', 'admin') DEFAULT 'user',
  createdAt       TIMESTAMP DEFAULT NOW(),

  CREATE INDEX idx_users_email ON auth_users(email);
)

TABLE sessions (
  id              VARCHAR(255) PRIMARY KEY,
  sessionToken    VARCHAR(255) UNIQUE,
  userId          VARCHAR(255) REFERENCES auth_users(id) ON DELETE CASCADE,
  expires         TIMESTAMP,

  CREATE INDEX idx_sessions_userId ON sessions(userId);
)

TABLE accounts (
  id              VARCHAR(255) PRIMARY KEY,
  userId          VARCHAR(255) REFERENCES auth_users(id) ON DELETE CASCADE,
  type            VARCHAR(255),
  provider        VARCHAR(255),
  providerAccountId VARCHAR(255),
  ...
)
```

---

## Pages & Routes

The application is structured around user journeys. All pages support bilingual content (English and Arabic).

### Public Pages

All public pages are accessible without authentication.

#### 1. Homepage (`/` and `/ar/`)

**Purpose:** Land on the platform, understand the mission, and discover content.

**Key Elements:**

- **Hero Section**
  - Large headline: "Every Egyptian has a story."
  - Subheadline: Tagline explaining the platform
  - CTA button: "Read Articles"
  - Background: Subtle animated hero image
  - Animation: GSAP fade-in on page load

- **Latest Articles Grid**
  - Show 6-8 most recent published articles
  - Card layout: Cover image + title + excerpt + featured people
  - Hover effect: Card lifts, border glow (gold accent)
  - Click to navigate to article detail

- **Featured Micro KRTK Cards**
  - Display 4-6 recent people
  - Minimal card design: photo, name, title
  - Hover: Show bio excerpt
  - Click to navigate to full Micro KRTK page

- **Newsletter Subscribe CTA**
  - Email input + submit button
  - Success message: "Check your email for confirmation"
  - Simple, non-intrusive placement

- **Platform Stats**
  - Total articles published
  - Total people featured
  - Total subscribers (optional)

**Route Handler:**
- GET / -> Fetch 8 latest articles, 6 latest people, render homepage

#### 2. Articles List (`/articles` and `/ar/articles`)

**Purpose:** Browse all published articles with filtering and search.

**Key Elements:**

- **Search Bar**
  - Search by article title or people names
  - Real-time filtering (client-side search for UX)

- **Filter Sidebar**
  - Filter by tag (tech, entrepreneurship, etc.)
  - Filter by gender of featured people (male, female, mixed)
  - Sort by: newest, oldest, trending

- **Articles Grid**
  - Card-based layout responsive to screen size
  - 3 columns on desktop, 2 on tablet, 1 on mobile
  - Infinite scroll or pagination
  - Each card: cover image, title, excerpt, featured people names, publish date

**Route Handler:**
- GET /articles?tag=tech&sort=newest -> Fetch and filter articles, render list

#### 3. Article Detail (`/articles/[slug]` and `/ar/articles/[slug]`)

**Purpose:** Read full article and discover featured people.

**Key Elements:**

- **Article Header**
  - Cover image (full width)
  - Title + headline
  - Publish date + estimated read time
  - Social share buttons (Twitter, LinkedIn, email)

- **Article Body**
  - Rich text rendering (markdown or HTML)
  - Properly styled for readability
  - Inline images if present
  - Pull quotes with styling

- **Featured People Cards**
  - Two prominent cards (one male, one female)
  - Large photo
  - Name + title + current company
  - Short bio
  - Link to full Micro KRTK page

- **Related Articles**
  - Show 3-4 articles with same tags or featured people
  - Grid layout at bottom of page

- **Comments / Engagement** (optional for v1)
  - Reactions (like, share)
  - Links to social sharing

**Route Handler:**
- GET /articles/[slug] -> Fetch article by slug, render with embedded person data

#### 4. Micro KRTK Profile (`/krtk/[slug]` and `/ar/krtk/[slug]`)

**Purpose:** Showcase individual digital business card with full profile details.

**Design Concept:** Minimal, premium, shareable - designed for LinkedIn, email, and social sharing.

**Key Elements:**

- **Header Section**
  - Cover photo (full width, parallax scroll effect)
  - Profile photo (circular, overlaid on cover)
  - Name (large, typewriter animation on first load)
  - Current title + company
  - Verified badge (if premium)

- **Quick Stats**
  - Years in industry
  - Total certifications
  - Total articles featured
  - View count (if premium)

- **About Section**
  - Full bio
  - Geographic location
  - Key skills/interests

- **Employment Timeline**
  - Vertical timeline showing career progression
  - Company name, title, duration
  - Smooth scroll animation for timeline entries

- **Education**
  - Degree, institution, year
  - GPA if available

- **Certifications**
  - Badge-style display
  - Issuing organization + year

- **Contact & Social** (only for premium)
  - Email
  - Phone
  - Website
  - LinkedIn, Twitter links
  - Social badges/icons

- **Featured Articles**
  - Show all articles this person appears in
  - Card preview with other featured person

- **Share Buttons**
  - Twitter, LinkedIn, email
  - Copy link to clipboard
  - WhatsApp (for mobile)

**Design Philosophy:**
- Clean, professional
- Gold/amber accents for premium
- Plenty of whitespace
- Mobile-responsive (designed for sharing via phone)
- Fast load time (optimized images)

**Route Handler:**
- GET /krtk/[slug] -> Fetch person by slug, render Micro KRTK page

#### 5. Browse People (`/people` and `/ar/people`)

**Purpose:** Discover all profiled people with search and filtering.

**Key Elements:**

- **Search & Filter Sidebar**
  - Search by name, title, company
  - Filter by gender
  - Filter by industry (derived from current/past titles)
  - Filter by tier (free/premium)
  - Sort by: name, newest, most featured

- **People Grid**
  - Card layout: photo, name, title, current company
  - Hover effect: Show bio excerpt
  - Tier badge (free/premium)
  - Verified badge
  - Click to navigate to Micro KRTK page

- **Infinite Scroll / Pagination**
  - Load more people as user scrolls
  - Or paginate with numbered buttons

**Route Handler:**
- GET /people?gender=female&sort=newest -> Fetch and filter people, render directory

#### 6. Submit Profile (`/submit` and `/ar/submit`)

**Purpose:** Self-service form for people to submit their profile data.

**Key Elements:**

- **Hero Section**
  - Headline: "Share Your Story"
  - Subheadline: Explaining the submission process

- **Multi-Step Form**
  - Step 1: Basic info (name, gender, email)
  - Step 2: Current role (company, title, bio)
  - Step 3: Career history (employment, education, certifications)
  - Step 4: Review + submit

- **Form Fields**
  - All fields match Person entity (first name, last name, bio, etc.)
  - Photo upload (with client-side resize/optimization)
  - Rich text editor for bio
  - Add multiple employment/education records

- **Validation**
  - Real-time validation feedback
  - Clear error messages
  - Required field indicators

- **Success State**
  - Confirmation message: "Thank you! We'll review your submission soon."
  - Link to follow status or contact us

**Route Handler:**
- POST /api/submissions -> Validate with Zod, create submission, send confirmation email

#### 7. Subscribe (`/subscribe` and `/ar/subscribe`)

**Purpose:** Email newsletter signup (can be inline on homepage or dedicated page).

**Key Elements:**

- **Email Input + Subscribe Button**
- **Privacy note:** "We respect your privacy. Unsubscribe anytime."
- **Success state:** "Check your email to confirm subscription."

**Route Handler:**
- POST /api/subscribers -> Validate email, create subscriber, send confirmation

---

### Admin Pages (Protected)

All admin pages require authentication and admin role. Protected by NextAuth middleware.

#### 8. Admin Dashboard (`/admin` and `/ar/admin`)

**Purpose:** Overview of platform metrics and quick actions.

**Key Metrics:**

- Total articles published
- Total people profiled
- Submissions pending review
- Active subscribers
- Recent activity feed (latest articles, submissions, claims)

**Key Actions:**

- Create new article (button links to article editor)
- Review submissions (links to submission queue)
- View all people
- View all subscribers

**Route Handler:**
- GET /admin -> Fetch metrics, render dashboard

#### 9. Manage Articles (`/admin/articles` and `/ar/admin/articles`)

**Purpose:** CRUD operations for articles.

**Key Elements:**

- **Articles Table**
  - Columns: title, featured people, status, publish date, actions
  - Sortable by date, status
  - Search by title

- **Create Article Button**
  - Links to article editor form

- **Row Actions:**
  - Edit: Open editor
  - Preview: View published version
  - Publish/Unpublish: Toggle status
  - Delete: Remove article (confirm dialog)

**Editor UI (Modal or Separate Page):**
- Title (English + Arabic)
- Excerpt (English + Arabic)
- Content (Rich text editor)
- Cover image upload
- Select male person (dropdown/search)
- Select female person (dropdown/search)
- Add tags
- Set status (draft/published)
- Save/Cancel buttons

**Route Handlers:**
- GET /api/articles -> List all articles
- POST /api/articles -> Create article
- GET /api/articles/[id] -> Get single article
- PUT /api/articles/[id] -> Update article
- DELETE /api/articles/[id] -> Delete article

#### 10. Manage People (`/admin/people` and `/ar/admin/people`)

**Purpose:** CRUD operations for person profiles.

**Key Elements:**

- **People Table**
  - Columns: name, gender, tier, claimed by, actions
  - Search by name
  - Filter by gender, tier

- **Create Person Button**
  - Links to person editor form (same form as submissions)

- **Row Actions:**
  - Edit: Open editor
  - View Micro KRTK: Navigate to public page
  - Delete: Remove profile
  - View Claims: See if someone claimed this profile

**Person Editor Form:**
- Mirrors Submission form
- All fields from Person entity
- Photo + cover photo uploads
- Employment history: add/edit/remove rows
- Education: add/edit/remove rows
- Certifications: add/edit/remove rows

**Route Handlers:**
- GET /api/people -> List all people
- POST /api/people -> Create person
- GET /api/people/[id] -> Get single person
- PUT /api/people/[id] -> Update person
- DELETE /api/people/[id] -> Delete person

#### 11. Review Submissions (`/admin/submissions` and `/ar/admin/submissions`)

**Purpose:** Approve or reject self-service profile submissions.

**Key Elements:**

- **Submissions Queue**
  - Table showing pending submissions
  - Columns: name, email, gender, submitted date, actions
  - Filter by status (pending/approved/rejected)
  - Search by name or email

- **Review Modal**
  - Display submitted data
  - Preview how person would appear on platform
  - Approve button: Creates person profile, sends confirmation email
  - Reject button: Shows text input for rejection reason, sends rejection email

**Route Handlers:**
- GET /api/submissions -> List submissions
- PUT /api/submissions/[id]/review -> Update submission status (approve/reject)

#### 12. Manage Subscribers (`/admin/subscribers` and `/ar/admin/subscribers`)

**Purpose:** View and manage email subscribers.

**Key Elements:**

- **Subscribers Table**
  - Columns: email, name, subscribed date, status, actions
  - Search by email
  - Filter by status (active/unsubscribed)

- **Row Actions:**
  - Send email: Prepare email to subscriber
  - Unsubscribe: Remove from list

- **Bulk Actions:**
  - Send newsletter to all active subscribers

**Route Handlers:**
- GET /api/subscribers -> List subscribers
- DELETE /api/subscribers/[id] -> Unsubscribe
- POST /api/subscribers/[id]/email -> Send email

---

## API Routes

All API routes follow a consistent response envelope pattern and implement proper error handling. Routes are implemented as Next.js Route Handlers.

### Response Envelope Pattern

Every API response follows this structure:

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Ahmed Essam",
    ...
  },
  "error": null
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": {
      "field": "email",
      "rule": "required"
    }
  }
}
```

**List Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "id": "...", "name": "..." },
    { "id": "...", "name": "..." }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  },
  "error": null
}
```

### Articles API

#### GET /api/articles

**Purpose:** Fetch all published articles with optional filtering.

**Query Parameters:**
- `status` (optional): "draft" | "published" - default "published"
- `skip` (optional): Number of articles to skip for pagination - default 0
- `take` (optional): Number of articles to return - default 20
- `sortBy` (optional): "publishedAt" | "createdAt" - default "publishedAt"
- `sortOrder` (optional): "asc" | "desc" - default "desc"

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "two-egyptians-tech",
      "title": "Two Egyptians Shaping Tech",
      "titleAr": "مصريان يشكلان التكنولوجيا",
      "excerpt": "...",
      "coverImage": "https://...",
      "malePersonId": "uuid",
      "femalePersonId": "uuid",
      "tags": ["tech", "innovation"],
      "status": "published",
      "publishedAt": "2026-03-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 24,
    "page": 1,
    "pageSize": 20,
    "totalPages": 2
  }
}
```

**Implementation:**
```typescript
// src/presentation/api/articles/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get('skip') || '0');
  const take = parseInt(searchParams.get('take') || '20');

  const articles = await articleRepository.findAll({ skip, take });
  const total = await articleRepository.count();

  return Response.json({
    success: true,
    data: articles.map(articleMapper.toDTO),
    meta: { total, page: 1, pageSize: take, totalPages: Math.ceil(total / take) }
  });
}
```

#### POST /api/articles

**Purpose:** Create a new article (admin only).

**Request Body:**
```json
{
  "title": "Two Egyptians Shaping Tech",
  "titleAr": "مصريان يشكلان التكنولوجيا",
  "excerpt": "...",
  "excerptAr": "...",
  "content": "...",
  "contentAr": "...",
  "coverImage": "https://...",
  "malePersonId": "uuid",
  "femalePersonId": "uuid",
  "tags": ["tech", "innovation"],
  "status": "draft"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "two-egyptians-tech",
    "title": "Two Egyptians Shaping Tech",
    ...
  }
}
```

**Implementation:**
```typescript
// src/presentation/api/articles/route.ts
export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.isAdmin) {
    return Response.json(
      { success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Admin only' } },
      { status: 401 }
    );
  }

  const body = await request.json();
  const validation = CreateArticleSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: validation.error.message } },
      { status: 400 }
    );
  }

  const article = await createArticleUseCase.execute(validation.data);
  return Response.json({ success: true, data: articleMapper.toDTO(article) }, { status: 201 });
}
```

#### GET /api/articles/[id]

**Purpose:** Fetch a single article by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "two-egyptians-tech",
    "title": "Two Egyptians Shaping Tech",
    "malePersonId": "uuid",
    "femalePersonId": "uuid",
    ...
  }
}
```

#### PUT /api/articles/[id]

**Purpose:** Update an article (admin only).

**Request Body:** Partial article data (any fields to update)

**Response:** Updated article

#### DELETE /api/articles/[id]

**Purpose:** Delete an article (admin only).

**Response:**
```json
{
  "success": true,
  "data": { "id": "uuid", "deleted": true }
}
```

### People API

#### GET /api/people

**Purpose:** Fetch all people profiles with optional filtering.

**Query Parameters:**
- `skip` (optional): Default 0
- `take` (optional): Default 20
- `gender` (optional): "male" | "female"
- `tier` (optional): "free" | "premium"
- `search` (optional): Search by name (full-text search)
- `sortBy` (optional): "name" | "createdAt"

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "ahmed-essam",
      "firstName": "Ahmed",
      "lastName": "Essam",
      "gender": "male",
      "photo": "https://...",
      "bio": "...",
      "currentEmployer": "Microsoft Egypt",
      "currentTitle": "Senior Engineer",
      "tier": "free",
      "isVerified": false,
      "isClaimed": false
    }
  ],
  "meta": { "total": 48, "page": 1, "pageSize": 20, "totalPages": 3 }
}
```

#### POST /api/people

**Purpose:** Create a new person profile (admin only).

**Request Body:**
```json
{
  "firstName": "Ahmed",
  "lastName": "Essam",
  "gender": "male",
  "bio": "...",
  "photo": "https://...",
  "currentEmployer": "Microsoft",
  "currentTitle": "Senior Engineer",
  ...
}
```

**Response:** Created person

#### GET /api/people/[id]

**Purpose:** Fetch a single person by ID.

**Response:** Person object

#### PUT /api/people/[id]

**Purpose:** Update a person profile.

**Implementation Note:** Only allow updates to the owner (if claimed) or admins.

#### DELETE /api/people/[id]

**Purpose:** Delete a person profile (admin only).

### Submissions API

#### GET /api/submissions

**Purpose:** Fetch all submissions with filtering (admin only).

**Query Parameters:**
- `status` (optional): "pending" | "approved" | "rejected"
- `skip`, `take` (optional): Pagination

#### POST /api/submissions

**Purpose:** Create a new submission (public).

**Request Body:**
```json
{
  "email": "ahmed@example.com",
  "fullName": "Ahmed Essam",
  "gender": "male",
  "submittedData": {
    "bio": "...",
    "currentEmployer": "...",
    ...
  }
}
```

**Response:** Confirmation with submission ID and next steps

#### PUT /api/submissions/[id]/review

**Purpose:** Approve or reject a submission (admin only).

**Request Body:**
```json
{
  "action": "approve" | "reject",
  "rejectionReason": "Optional reason if rejecting"
}
```

**On Approve:**
- Create new Person from submission data
- Mark submission as approved
- Send confirmation email to submitter

**On Reject:**
- Mark submission as rejected
- Send rejection email with reason

### Subscribers API

#### POST /api/subscribers

**Purpose:** Subscribe to newsletter (public).

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

#### DELETE /api/subscribers/[email]

**Purpose:** Unsubscribe from newsletter (public).

#### GET /api/subscribers

**Purpose:** List all subscribers (admin only).

### Authentication API (NextAuth)

NextAuth.js v5 handles authentication. Available routes:

- `POST /api/auth/signin` - Sign in with email/password or Google OAuth
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/providers` - Get available providers
- `POST /api/auth/callback/google` - Google OAuth callback

---

## Design System

The platform uses a modern, minimal dark-mode-first design system inspired by contemporary SaaS and content platforms.

### Color Palette

**Primary Colors (Dark Mode):**
- **Background:** `#0A0A0B` - Near black, easy on the eyes
- **Surface:** `#141416` - Card and component backgrounds
- **Surface Elevated:** `#1C1C1F` - For elevated modals and overlays
- **Border:** `#2A2A2E` - Subtle dividers and borders

**Text Colors:**
- **Primary Text:** `#FAFAFA` - Main text on dark backgrounds
- **Secondary Text:** `#A1A1AA` - Muted text, captions, hints
- **Muted Text:** `#71717A` - Very subtle, secondary information

**Accent Colors:**
- **Accent Gold:** `#D4A853` - Primary accent (Egyptian gold)
- **Accent Amber:** `#F59E0B` - Secondary accent for highlights
- **Success:** `#22C55E` - Success states (confirmations)
- **Error:** `#EF4444` - Error states
- **Warning:** `#F97316` - Warning states

**Gradients:**
- **Premium Badge:** `linear-gradient(135deg, #D4A853 0%, #F59E0B 100%)`
- **Card Hover:** Subtle gradient from Surface to Surface Elevated
- **Hero Overlay:** Radial gradient fade for text legibility

**Tailwind Configuration:**
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    colors: {
      bg: {
        primary: '#0A0A0B',
        surface: '#141416',
        elevated: '#1C1C1F',
      },
      text: {
        primary: '#FAFAFA',
        secondary: '#A1A1AA',
        muted: '#71717A',
      },
      border: {
        primary: '#2A2A2E',
      },
      accent: {
        gold: '#D4A853',
        amber: '#F59E0B',
      },
    }
  }
}
```

### Typography

**Font Selection:**
- **Heading Font:** Inter (600, 700 weights)
  - Clean, modern, professional
  - Used for all h1-h6 headings

- **Body Font:** Inter (400, 500 weights)
  - Excellent readability
  - Used for paragraphs, lists, body copy

- **Arabic Font:** IBM Plex Sans Arabic (400, 600 weights)
  - Professional Arabic font
  - Pairs well with Inter
  - Used for all Arabic text and headings

**Type Scale:**
```
h1: 3.5rem (56px) - 600 weight - Page titles
h2: 2.5rem (40px) - 600 weight - Section headings
h3: 2rem (32px) - 600 weight - Subsection headings
h4: 1.5rem (24px) - 600 weight - Card titles
body: 1rem (16px) - 400 weight - Body text
small: 0.875rem (14px) - 400 weight - Captions, hints
xs: 0.75rem (12px) - 400 weight - Badge text
```

**Line Height:**
- Headings: 1.2
- Body: 1.6
- Compact: 1.4

**Letter Spacing:**
- Headings: -0.02em (tight)
- Body: 0
- Casual: 0.02em (for some accent text)

### Component Styles

#### Card (Micro KRTK Base)

**Visual Treatment:**
- Background: Surface (`#141416`)
- Border: 1px solid Border (`#2A2A2E`)
- Border Radius: 12px
- Padding: 24px
- Box Shadow: `0 4px 6px rgba(0, 0, 0, 0.1)` (subtle)

**Hover State:**
- Border Color: Accent Gold (`#D4A853`)
- Box Shadow: `0 8px 16px rgba(212, 168, 83, 0.15)` (gold glow)
- Transform: `translateY(-4px)` (lift effect)
- Transition: 200ms ease-out

**Example HTML:**
```html
<div class="bg-[#141416] border border-[#2A2A2E] rounded-[12px] p-6
            hover:border-[#D4A853] hover:shadow-[0_8px_16px_rgba(212,168,83,0.15)]
            hover:-translate-y-1 transition-all duration-200">
  <!-- Card content -->
</div>
```

#### Button Styles

**Primary Button (CTA):**
- Background: Accent Gold (`#D4A853`)
- Text: Background Primary (`#0A0A0B`)
- Padding: 12px 24px
- Border Radius: 8px
- Font Weight: 600
- Hover: Brightness 110%, cursor pointer
- Active: Brightness 90%
- Transition: 150ms ease-out

**Secondary Button:**
- Background: Surface Elevated (`#1C1C1F`)
- Text: Primary Text (`#FAFAFA`)
- Border: 1px solid Border (`#2A2A2E`)
- Padding: 12px 24px
- Hover: Border color changes to Gold

**Ghost Button:**
- Background: Transparent
- Text: Accent Gold (`#D4A853`)
- Border: 1px solid Accent Gold
- Padding: 12px 24px
- Hover: Background becomes Surface with 20% opacity

#### Input Fields

- Background: Surface (`#141416`)
- Border: 1px solid Border (`#2A2A2E`)
- Border Radius: 8px
- Padding: 10px 14px
- Text Color: Primary Text (`#FAFAFA`)
- Focus: Border color Gold, outline none
- Placeholder: Secondary Text (`#A1A1AA`)
- Transition: 150ms ease-out

#### Badge (Tier Indicator)

**Premium Badge:**
- Background: Gradient (Gold to Amber)
- Text: Background Primary (`#0A0A0B`)
- Padding: 4px 12px
- Border Radius: 12px (pill shape)
- Font Size: 12px
- Font Weight: 600
- Box Shadow: `0 4px 12px rgba(212, 168, 83, 0.3)` (glow effect)

**Free Badge (Optional):**
- Background: Surface Elevated (`#1C1C1F`)
- Text: Secondary Text (`#A1A1AA`)
- Border: 1px solid Border
- Padding: 4px 12px
- Border Radius: 12px

#### Micro KRTK Card (Premium Style)

**Glass Morphism Effect:**
- Background: `rgba(20, 20, 22, 0.8)` (transparent with blur)
- Backdrop Filter: `blur(10px)`
- Border: 1px solid `rgba(212, 168, 83, 0.2)` (subtle gold border)
- Border Radius: 16px

**Premium Micro KRTK (On Hover):**
- Border: 1.5px solid Accent Gold
- Box Shadow: `0 8px 32px rgba(212, 168, 83, 0.25)` (gold glow)
- Background: Slightly more opaque

### Animation Specifications

All animations use GSAP v3 with ScrollTrigger for scroll-triggered effects.

#### Page Load Animations

**Entrance Animation (Stagger):**
```javascript
// src/shared/animations/entrance.ts
export const staggerCards = (target: string, delay = 0) => {
  gsap.fromTo(
    target,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      delay,
    }
  );
};
```

**Usage in Component:**
```typescript
useEffect(() => {
  staggerCards('.article-card', 0.2);
}, []);
```

#### Scroll Animations

**Parallax Hero:**
```javascript
gsap.to('.hero-image', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 0.5,
  },
  y: 100,
  ease: 'none',
});
```

**Reveal on Scroll:**
```javascript
gsap.to('.section', {
  scrollTrigger: {
    trigger: '.section',
    start: 'top 80%',
    end: 'top 20%',
    markers: false,
  },
  opacity: 1,
  y: 0,
  duration: 0.8,
});
```

#### Hover Animations

**Card Lift + Glow:**
```javascript
const card = document.querySelector('.person-card');
card.addEventListener('mouseenter', () => {
  gsap.to(card, {
    y: -8,
    boxShadow: '0 8px 16px rgba(212, 168, 83, 0.15)',
    duration: 0.3,
    ease: 'power2.out',
  });
});
card.addEventListener('mouseleave', () => {
  gsap.to(card, {
    y: 0,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    duration: 0.3,
    ease: 'power2.out',
  });
});
```

#### Micro KRTK Page Animations

**Name Typewriter Effect:**
```javascript
const name = document.querySelector('.krtk-name');
gsap.to(name, {
  duration: 1.5,
  ease: 'none',
  onUpdate: function() {
    // Simulated character reveal
  },
});
```

**Section Slide-In:**
```javascript
gsap.from('.krtk-section', {
  opacity: 0,
  x: -30,
  duration: 0.6,
  stagger: 0.2,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.krtk-section',
    start: 'top 80%',
  },
});
```

#### Page Transitions

**Fade Between Routes:**
```javascript
// Implemented in layout.tsx
useEffect(() => {
  const handleRouteChange = () => {
    gsap.to('main', { opacity: 0, duration: 0.2 });
  };
  const handleRouteComplete = () => {
    gsap.to('main', { opacity: 1, duration: 0.3 });
  };

  router.events?.on('routeChangeStart', handleRouteChange);
  router.events?.on('routeChangeComplete', handleRouteComplete);
}, []);
```

---

## Sample Seed Data

### Article 1: "Two Egyptians Shaping the Tech Scene"

**Article Data:**
```json
{
  "title": "Two Egyptians Shaping the Tech Scene",
  "titleAr": "مصريان يشكلان المشهد التكنولوجي",
  "slug": "two-egyptians-tech",
  "excerpt": "Ahmed Essam and Nourhan El-Sherif are leading Egypt's digital transformation. Ahmed engineers distributed systems for Microsoft, while Nourhan drives product innovation at Vodafone. Together, they represent a new generation of Egyptian tech leaders.",
  "excerptAr": "أحمد عصام ونورهان الشريف يقودان التحول الرقمي في مصر. يهندس أحمد الأنظمة الموزعة في مايكروسوفت، بينما تقود نورهان الابتكار في الاتصالات. معاً، يمثلان جيلاً جديداً من القادة التكنولوجيين المصريين.",
  "content": "## The Silicon Valley of the Nile\n\nCairo's tech ecosystem is booming...",
  "contentAr": "## وادي السيليكون على النيل\n\nتزدهر النظم البيئية للتكنولوجيا في القاهرة...",
  "coverImage": "https://images.unsplash.com/...",
  "status": "published",
  "publishedAt": "2026-03-20T10:00:00Z",
  "tags": ["technology", "innovation", "career"]
}
```

**Male Person - Ahmed Essam:**
```json
{
  "firstName": "Ahmed",
  "firstNameAr": "أحمد",
  "lastName": "Essam",
  "lastNameAr": "عصام",
  "slug": "ahmed-essam",
  "gender": "male",
  "bio": "Ahmed is a Cairo-born engineer who went from building side projects in his university dorm to shipping products used by millions. Senior Software Engineer at Microsoft Egypt, leading distributed systems infrastructure. Known for his deep expertise in cloud architecture and his passion for mentoring junior Egyptian developers.",
  "bioAr": "أحمد مهندس ولد في القاهرة انتقل من بناء المشاريع الجانبية في سكن الجامعة إلى شحن المنتجات المستخدمة من قبل الملايين. كبير مهندسي البرمجيات في مايكروسوفت مصر، يقود البنية التحتية للأنظمة الموزعة. معروف بخبرته العميقة في معمارية السحابة وشغفه بتوجيه المطورين المصريين الشباب.",
  "photo": "https://images.unsplash.com/...",
  "coverPhoto": "https://images.unsplash.com/...",
  "currentEmployer": "Microsoft Egypt",
  "currentTitle": "Senior Software Engineer",
  "tier": "free",
  "isVerified": false,
  "isClaimed": false,
  "employmentHistory": [
    {
      "company": "Microsoft Egypt",
      "title": "Senior Software Engineer",
      "from": "2022",
      "to": null
    },
    {
      "company": "Google",
      "title": "Software Engineer",
      "from": "2019",
      "to": "2022"
    },
    {
      "company": "Valeo",
      "title": "Junior Developer",
      "from": "2017",
      "to": "2019"
    }
  ],
  "education": [
    {
      "institution": "Cairo University",
      "degree": "BSc",
      "field": "Computer Engineering",
      "year": 2017
    }
  ],
  "certifications": [
    {
      "name": "AWS Solutions Architect Associate",
      "issuer": "Amazon",
      "year": 2021
    },
    {
      "name": "Google Cloud Professional Data Engineer",
      "issuer": "Google",
      "year": 2023
    }
  ]
}
```

**Female Person - Nourhan El-Sherif:**
```json
{
  "firstName": "Nourhan",
  "firstNameAr": "نورهان",
  "lastName": "El-Sherif",
  "lastNameAr": "الشريف",
  "slug": "nourhan-el-sherif",
  "gender": "female",
  "bio": "Nourhan bridges the gap between technology and business strategy. Senior Product Manager at Vodafone Egypt, leading digital innovation initiatives. She redesigned Vodafone's self-service app, increasing user engagement by 40%. A vocal advocate for women in Egyptian tech and a mentor to emerging female leaders.",
  "bioAr": "نورهان تربط الفجوة بين التكنولوجيا والإستراتيجية التجارية. كبيرة مدير المنتجات في فودافون مصر، تقود مبادرات الابتكار الرقمي. أعادت تصميم تطبيق خدمة ذاتية في فودافون، مما زاد من تفاعل المستخدمين بنسبة 40%. مدافعة صريحة عن النساء في التكنولوجيا المصرية ومرشدة للقادة الإناث الناشئات.",
  "photo": "https://images.unsplash.com/...",
  "coverPhoto": "https://images.unsplash.com/...",
  "currentEmployer": "Vodafone Egypt",
  "currentTitle": "Senior Product Manager",
  "tier": "free",
  "isVerified": false,
  "isClaimed": false,
  "employmentHistory": [
    {
      "company": "Vodafone Egypt",
      "title": "Senior Product Manager",
      "from": "2021",
      "to": null
    },
    {
      "company": "Orange Egypt",
      "title": "Product Analyst",
      "from": "2018",
      "to": "2021"
    },
    {
      "company": "IBM",
      "title": "Business Analyst",
      "from": "2016",
      "to": "2018"
    }
  ],
  "education": [
    {
      "institution": "American University in Cairo",
      "degree": "BSc",
      "field": "Business Administration",
      "year": 2016
    },
    {
      "institution": "ESLSCA",
      "degree": "MBA",
      "field": "Business Administration",
      "year": 2020
    }
  ],
  "certifications": [
    {
      "name": "Project Management Professional (PMP)",
      "issuer": "Project Management Institute",
      "year": 2019
    },
    {
      "name": "Certified Scrum Product Owner",
      "issuer": "Scrum Alliance",
      "year": 2021
    }
  ]
}
```

### Article 2: "From Cairo to the World Stage"

**Male Person - Karim Abdel-Aziz:**
```json
{
  "firstName": "Karim",
  "firstNameAr": "كريم",
  "lastName": "Abdel-Aziz",
  "lastNameAr": "عبد العزيز",
  "slug": "karim-abdel-aziz",
  "gender": "male",
  "bio": "Karim's campaigns have won regional and international recognition. Executive Creative Director at Leo Burnett Cairo. His 'Egypt's Streets' campaign for a local NGO went viral and was featured in Communication Arts magazine. He believes Egyptian creativity is underrepresented on the global stage and works to change that.",
  "currentEmployer": "Leo Burnett Cairo",
  "currentTitle": "Executive Creative Director",
  "tier": "free",
  "employmentHistory": [
    {
      "company": "Leo Burnett Cairo",
      "title": "Executive Creative Director",
      "from": "2020",
      "to": null
    },
    {
      "company": "TBWA/RAAD Dubai",
      "title": "Senior Art Director",
      "from": "2017",
      "to": "2020"
    },
    {
      "company": "DDB Cairo",
      "title": "Designer",
      "from": "2014",
      "to": "2017"
    }
  ],
  "education": [
    {
      "institution": "Helwan University",
      "degree": "BFA",
      "field": "Graphic Design",
      "year": 2014
    }
  ],
  "certifications": [
    {
      "name": "Cannes Lions Young Creative Award",
      "issuer": "Cannes Lions",
      "year": 2019
    }
  ]
}
```

**Female Person - Mariam Hassan:**
```json
{
  "firstName": "Mariam",
  "firstNameAr": "مريم",
  "lastName": "Hassan",
  "lastNameAr": "حسن",
  "slug": "mariam-hassan",
  "gender": "female",
  "bio": "Mariam is one of Egypt's rising stars in AI research. Lead Data Scientist at IBM Egypt. Her PhD thesis on Arabic NLP models has been cited over 200 times in academic literature. She runs a free weekend workshop teaching data science to Egyptian university students, believing AI education should be accessible to all.",
  "currentEmployer": "IBM Egypt",
  "currentTitle": "Lead Data Scientist",
  "tier": "free",
  "employmentHistory": [
    {
      "company": "IBM Egypt",
      "title": "Lead Data Scientist",
      "from": "2022",
      "to": null
    },
    {
      "company": "Amazon MENA",
      "title": "Data Analyst",
      "from": "2018",
      "to": "2021"
    },
    {
      "company": "American University in Cairo",
      "title": "Research Assistant",
      "from": "2016",
      "to": "2018"
    }
  ],
  "education": [
    {
      "institution": "American University in Cairo",
      "degree": "BSc",
      "field": "Mathematics",
      "year": 2016
    },
    {
      "institution": "American University in Cairo",
      "degree": "PhD",
      "field": "Machine Learning",
      "year": 2022
    }
  ],
  "certifications": [
    {
      "name": "TensorFlow Developer Certificate",
      "issuer": "Google",
      "year": 2020
    },
    {
      "name": "IBM Data Science Professional",
      "issuer": "IBM",
      "year": 2019
    }
  ]
}
```

---

## Implementation Phases

All phases follow the standard MOK project lifecycle: Research -> Proposal -> Architecture -> Design -> Development -> Testing -> Delivery. This master prompt fulfills the Architecture phase for developer handoff.

### Phase 1: Foundation (Scaffold + Core Infrastructure)

**Duration:** 2-3 days

**Deliverables:**
- Next.js 14 project initialized with TypeScript
- Folder structure per Clean Architecture pattern
- Neon PostgreSQL database connected
- Drizzle ORM configured with migrations
- NextAuth.js v5 setup (email/password + Google OAuth)
- Dark mode Tailwind CSS configured
- Base layout with header, footer, language switcher
- Environmental configuration (.env.example created)

**Tasks:**
1. Initialize Next.js with create-next-app
2. Install and configure TypeScript (strict mode)
3. Set up Tailwind CSS with dark mode
4. Configure next-intl for bilingual support
5. Set up Neon PostgreSQL connection
6. Install Drizzle ORM and initialize schema.ts
7. Configure NextAuth.js with database adapter
8. Create folder structure
9. Write base layout component with global styles
10. Deploy to Vercel (empty project)

**Acceptance Criteria:**
- Project runs locally without errors
- Environment variables documented
- TypeScript compiles without errors
- Dark theme applied globally
- At least one migrations can run successfully
- NextAuth sign-in page loads

### Phase 2: Domain Layer & Data Schema

**Duration:** 3-4 days

**Deliverables:**
- All domain entities defined (Person, Article, Submission, Subscriber)
- Value objects (Gender, TierType, ArticleStatus)
- Repository interfaces in domain layer
- Drizzle schema fully implemented in infrastructure
- Database migrations created and tested
- Seed script with sample data

**Tasks:**
1. Define domain entities and value objects
2. Write repository interfaces
3. Create Drizzle schema (all 4 tables)
4. Generate migrations
5. Test migrations on fresh database
6. Write seed script with sample articles and people
7. Document schema (schema.md)
8. Add indices for performance

**Acceptance Criteria:**
- All 4 tables created with correct columns
- Seed script runs without errors
- 2 articles and 4 people in database
- Migrations are idempotent
- Foreign key constraints enforced
- All indices present

### Phase 3: API Layer & Use Cases

**Duration:** 4-5 days

**Deliverables:**
- All use cases implemented in application layer
- Concrete repository implementations
- All API route handlers
- Zod validation schemas
- Error handling middleware
- Response envelope standardized across all endpoints

**Tasks:**
1. Implement all use cases (CreateArticle, ClaimProfile, SubmitProfile, etc.)
2. Implement repository classes (DrizzlePersonRepository, etc.)
3. Write Zod schemas for validation
4. Create API route handlers for all endpoints
5. Implement error handling and response envelope
6. Add role-based authorization middleware
7. Write API documentation (API.md)
8. Test all endpoints with Thunder Client or Postman

**Acceptance Criteria:**
- All 12 API routes working
- Validation catches invalid input
- Response envelope consistent
- Admin routes protected
- Error messages user-friendly
- TypeScript types inferred correctly

### Phase 4: Public UI & Components

**Duration:** 5-6 days

**Deliverables:**
- Homepage fully styled and interactive
- All 7 public pages implemented
- Reusable component library (ArticleCard, PersonCard, etc.)
- GSAP animations for smooth interactions
- Mobile responsive design
- Bilingual content working

**Tasks:**
1. Create reusable components (ArticleCard, PersonCard, etc.)
2. Build homepage (hero, articles grid, featured people, subscribe CTA)
3. Implement articles list page with filtering
4. Implement article detail page with embedded person cards
5. Implement Micro KRTK profile page (the star of the design)
6. Implement people directory with search/filter
7. Implement submit profile form (multi-step)
8. Implement subscribe page
9. Add GSAP animations throughout
10. Test responsiveness on mobile, tablet, desktop

**Acceptance Criteria:**
- All pages render without console errors
- Images load optimized
- Animations are smooth (60 FPS)
- Mobile design passes responsive test
- English and Arabic text renders correctly
- Forms validate client-side
- Lighthouse score above 80

### Phase 5: Admin UI & Dashboard

**Duration:** 3-4 days

**Deliverables:**
- Admin dashboard with key metrics
- Article management (CRUD)
- People management (CRUD)
- Submission review queue
- Subscriber management
- Role-based access control

**Tasks:**
1. Build admin dashboard layout
2. Create articles management table and editor
3. Create people management table and editor
4. Create submission review queue with approve/reject
5. Create subscriber list with bulk actions
6. Add authentication checks to all admin routes
7. Test admin workflows end-to-end
8. Document admin workflows

**Acceptance Criteria:**
- Admin routes require login
- Admins can create/edit/delete articles
- Admins can create/edit/delete people
- Admins can approve/reject submissions
- Admins can manage subscribers
- All changes persisted to database

### Phase 6: Testing & Quality Assurance

**Duration:** 2-3 days

**Deliverables:**
- Unit tests for domain layer (80%+ coverage)
- Integration tests for repositories
- Component tests for UI components
- E2E tests for critical user flows
- Performance optimization

**Tasks:**
1. Write unit tests for use cases
2. Write tests for repositories
3. Write component tests for ArticleCard, PersonCard, etc.
4. Write E2E tests (homepage -> article -> profile flow)
5. Run coverage report and achieve 80%+
6. Optimize images (next/image)
7. Optimize bundle size
8. Test on real 4G connection (Lighthouse throttling)
9. Security audit (no hardcoded secrets, input validation)

**Acceptance Criteria:**
- Test coverage 80%+ for domain layer
- All tests passing
- No hardcoded secrets in codebase
- Lighthouse performance score 80+
- E2E tests pass on CI

### Phase 7: Delivery & Documentation

**Duration:** 1-2 days

**Deliverables:**
- Deployment to production Vercel
- README with setup instructions
- API documentation (Swagger/OpenAPI optional)
- Developer onboarding guide
- Architecture documentation
- Admin user guide
- Deployment runbook

**Tasks:**
1. Set up CI/CD with GitHub Actions
2. Configure production environment variables
3. Deploy to Vercel
4. Write comprehensive README
5. Create developer onboarding guide
6. Write admin user guide
7. Document deployment process
8. Set up error tracking (Sentry optional)
9. Set up analytics (Vercel Analytics)

**Acceptance Criteria:**
- Production URL live and working
- All tests passing on main branch
- README covers setup, development, deployment
- Admin guide covers all workflows
- Error tracking configured
- Documentation is up-to-date

---

## Development Standards

### Code Quality Requirements

All code must meet these standards before deployment:

**TypeScript:**
- Strict mode enabled
- No `any` types
- All function parameters typed
- All return types explicitly annotated

**Testing:**
- Minimum 80% code coverage
- All use cases have tests
- All repositories have tests
- All API routes have tests
- Component tests for interactive components

**Git Workflow:**
- Conventional commits (feat:, fix:, docs:, test:)
- Feature branches with PR reviews
- Commits reference issue numbers
- Clean history (no merge commits)

**Performance:**
- Lighthouse scores above 80
- First Contentful Paint < 2s
- Interaction to Next Paint < 100ms
- Cumulative Layout Shift < 0.1

**Security:**
- No hardcoded secrets
- All inputs validated with Zod
- SQL injection prevention via ORM
- XSS prevention (React escaping + sanitization)
- CSRF protection (NextAuth default)

### File Naming Conventions

- **React Components:** PascalCase with .tsx extension
  - Example: `ArticleCard.tsx`, `AdminDashboard.tsx`

- **Utilities:** camelCase with .ts extension
  - Example: `formatDate.ts`, `slugify.ts`

- **Tests:** [Filename].test.ts
  - Example: `ArticleCard.test.tsx`, `useArticles.test.ts`

- **Database Schemas:** snake_case in SQL
  - Example: `TABLE persons`, `employment_history`

### Import Organization

```typescript
// 1. External libraries
import { useEffect } from 'react';
import { useRouter } from 'next/router';

// 2. Internal domain
import { Person } from '@/domain/entities/Person';
import { PersonRepository } from '@/domain/repositories/PersonRepository';

// 3. Internal application
import { GetPersonUseCase } from '@/application/use-cases/GetPersonUseCase';

// 4. Internal infrastructure
import { DrizzlePersonRepository } from '@/infrastructure/repositories/DrizzlePersonRepository';

// 5. Internal presentation
import { ArticleCard } from '@/presentation/components/ArticleCard';

// 6. Shared utilities
import { cn } from '@/shared/utils/cn';
import { COLORS } from '@/shared/constants/colors';
```

---

## Conclusion

This master prompt document serves as the complete specification for Demo1cairolive. Every developer, whether human or AI agent, should be able to reference this document and understand exactly what needs to be built, how it should work, and what standards apply.

The platform is ambitious but achievable within the scope outlined. All technical choices are proven (based on Demo2cairolive) and all design decisions are intentional and documented.

**Key Takeaways:**
- Clean Architecture ensures maintainability and testability
- Dark mode + gold accents create premium visual identity
- Bilingual support (English/Arabic) is first-class, not an afterthought
- GSAP animations enhance UX without sacrificing performance
- Database schema is normalized and performant
- API endpoints follow consistent patterns
- Admin workflows are thorough and user-friendly
- Testing and quality are non-negotiable

Begin with Phase 1 and move sequentially through phases. Do not skip phases or combine them.

---

**Document Version:** 1.0 DRAFT

**Next Steps:**
1. Obtain Mohamed's review and approval
2. Move to FINAL status
3. Begin Phase 1 implementation
4. Create detailed task breakdown in MOK ERP
