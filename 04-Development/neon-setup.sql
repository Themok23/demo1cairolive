-- Demo1cairolive: Schema + Seed Data for Neon
-- Run this in Neon SQL Editor (console.neon.tech > SQL Editor)

-- ============================================
-- 1. CREATE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS persons (
  id VARCHAR(36) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20) DEFAULT 'prefer-not-to-say',
  bio TEXT,
  profile_image_url TEXT,
  cover_image_url TEXT,
  current_position VARCHAR(255),
  current_company VARCHAR(255),
  location VARCHAR(255),
  tier VARCHAR(20) NOT NULL DEFAULT 'bronze',
  is_verified BOOLEAN DEFAULT false,
  is_claimed BOOLEAN DEFAULT false,
  claimed_by VARCHAR(36),
  keywords TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS persons_email_idx ON persons(email);
CREATE INDEX IF NOT EXISTS persons_tier_idx ON persons(tier);
CREATE INDEX IF NOT EXISTS persons_created_at_idx ON persons(created_at);

CREATE TABLE IF NOT EXISTS articles (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author_id VARCHAR(36) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  featured_image_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tags TEXT,
  category VARCHAR(100),
  read_time_minutes INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  male_person_id VARCHAR(36),
  female_person_id VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug);
CREATE INDEX IF NOT EXISTS articles_author_idx ON articles(author_id);
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status);
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles(published_at);
CREATE INDEX IF NOT EXISTS articles_male_person_idx ON articles(male_person_id);
CREATE INDEX IF NOT EXISTS articles_female_person_idx ON articles(female_person_id);

CREATE TABLE IF NOT EXISTS submissions (
  id VARCHAR(36) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20) DEFAULT 'prefer-not-to-say',
  bio TEXT,
  profile_image_url TEXT,
  current_position VARCHAR(255),
  current_company VARCHAR(255),
  location VARCHAR(255),
  keywords TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  website_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  submitted_by VARCHAR(255) NOT NULL,
  reviewed_by VARCHAR(36),
  review_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS submissions_status_idx ON submissions(status);
CREATE INDEX IF NOT EXISTS submissions_email_idx ON submissions(email);
CREATE INDEX IF NOT EXISTS submissions_submitted_at_idx ON submissions(submitted_at);

CREATE TABLE IF NOT EXISTS subscribers (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscribers_email_idx ON subscribers(email);
CREATE INDEX IF NOT EXISTS subscribers_is_active_idx ON subscribers(is_active);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  entity_id VARCHAR(36),
  entity_type VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NextAuth tables
CREATE TABLE IF NOT EXISTS account (
  "userId" VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type VARCHAR(255),
  scope TEXT,
  id_token TEXT,
  session_state VARCHAR(255),
  PRIMARY KEY (provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS session (
  "sessionToken" VARCHAR(255) PRIMARY KEY,
  "userId" VARCHAR(255) NOT NULL,
  expires TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS "session_userId_idx" ON session("userId");

CREATE TABLE IF NOT EXISTS "verificationToken" (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ============================================
-- 2. SEED DATA
-- ============================================

-- Persons (6 Egyptian profiles)
INSERT INTO persons (id, first_name, last_name, email, gender, bio, profile_image_url, current_position, current_company, location, tier, is_verified, keywords, linkedin_url, twitter_url) VALUES
('p1-ahmed-elsayed', 'Ahmed', 'El-Sayed', 'ahmed.elsayed@example.com', 'male',
 'Award-winning Egyptian architect known for blending traditional Islamic geometric patterns with modern sustainable design. His work on the New Administrative Capital cultural center earned international recognition.',
 'https://ui-avatars.com/api/?name=Ahmed+El-Sayed&size=400&background=D4AF37&color=fff',
 'Principal Architect', 'El-Sayed Design Studio', 'Cairo, Egypt', 'platinum', true,
 '["architecture","sustainable design","Islamic geometry","urban planning"]',
 'https://linkedin.com/in/ahmed-elsayed', 'https://twitter.com/ahmedelsayed'),

('p2-nour-hassan', 'Nour', 'Hassan', 'nour.hassan@example.com', 'female',
 'Pioneering Egyptian marine biologist studying coral reef restoration in the Red Sea. Her research has led to new conservation methods adopted by the Egyptian Environmental Affairs Agency.',
 'https://ui-avatars.com/api/?name=Nour+Hassan&size=400&background=2196F3&color=fff',
 'Lead Marine Biologist', 'Red Sea Research Institute', 'Hurghada, Egypt', 'gold', true,
 '["marine biology","coral reefs","conservation","Red Sea"]',
 'https://linkedin.com/in/nour-hassan', 'https://twitter.com/nourhassan'),

('p3-omar-farouk', 'Omar', 'Farouk', 'omar.farouk@example.com', 'male',
 'Egyptian tech entrepreneur who built one of the largest fintech platforms in North Africa. Forbes 30 Under 30 MENA, passionate about financial inclusion for the unbanked population.',
 'https://ui-avatars.com/api/?name=Omar+Farouk&size=400&background=4CAF50&color=fff',
 'CEO & Co-founder', 'PayNile Technologies', 'Cairo, Egypt', 'gold', true,
 '["fintech","entrepreneurship","financial inclusion","startups"]',
 'https://linkedin.com/in/omar-farouk', 'https://twitter.com/omarfarouk'),

('p4-yasmine-khalil', 'Yasmine', 'Khalil', 'yasmine.khalil@example.com', 'female',
 'Acclaimed Egyptian novelist and screenwriter. Her debut novel "Daughters of the Nile" was translated into 14 languages. Currently adapting her work for an international streaming platform.',
 'https://ui-avatars.com/api/?name=Yasmine+Khalil&size=400&background=9C27B0&color=fff',
 'Author & Screenwriter', 'Independent', 'Alexandria, Egypt', 'silver', true,
 '["literature","screenwriting","Egyptian culture","storytelling"]',
 'https://linkedin.com/in/yasmine-khalil', 'https://twitter.com/yasminekhalil'),

('p5-karim-mostafa', 'Karim', 'Mostafa', 'karim.mostafa@example.com', 'male',
 'Egyptian neuroscientist researching Alzheimer''s disease at Cairo University. His groundbreaking work on early detection biomarkers has been published in Nature and The Lancet.',
 'https://ui-avatars.com/api/?name=Karim+Mostafa&size=400&background=FF5722&color=fff',
 'Associate Professor of Neuroscience', 'Cairo University', 'Cairo, Egypt', 'silver', true,
 '["neuroscience","Alzheimer''s research","biomarkers","medical research"]',
 'https://linkedin.com/in/karim-mostafa', NULL),

('p6-laila-abdelrahman', 'Laila', 'Abdel-Rahman', 'laila.abdelrahman@example.com', 'female',
 'Rising Egyptian photographer documenting daily life in Cairo''s historic neighborhoods. Her "Faces of Khan El-Khalili" exhibition toured museums across Europe.',
 'https://ui-avatars.com/api/?name=Laila+Abdel-Rahman&size=400&background=795548&color=fff',
 'Documentary Photographer', 'Freelance', 'Cairo, Egypt', 'bronze', false,
 '["photography","documentary","Egyptian culture","visual arts"]',
 'https://linkedin.com/in/laila-abdelrahman', 'https://twitter.com/lailaabdelrahman')
ON CONFLICT (id) DO NOTHING;

-- Articles (4 articles, 3 published + 1 draft)
INSERT INTO articles (id, title, slug, content, excerpt, author_id, author_name, featured_image_url, status, published_at, tags, category, read_time_minutes, view_count) VALUES
('a1-reimagining-cairo', 'Reimagining Cairo: How Ahmed El-Sayed Blends Tradition with Tomorrow',
 'reimagining-cairo-ahmed-elsayed',
 'In the heart of Egypt''s New Administrative Capital, a cultural center rises that tells the story of a nation looking forward while honoring its past. Ahmed El-Sayed, the visionary architect behind this landmark project, has spent two decades perfecting the art of weaving Islamic geometric patterns into contemporary sustainable architecture.

"Every building should tell a story," El-Sayed explains from his studio overlooking the Nile. "In Egypt, we have 5,000 years of architectural wisdom. My job is not to replicate the past but to let it inform the future."

His approach has earned him recognition from the Aga Khan Award for Architecture and commissions across the Middle East and North Africa. But it''s his commitment to sustainability that sets his work apart.',
 'How architect Ahmed El-Sayed is transforming Egypt''s skyline by merging Islamic geometric traditions with cutting-edge sustainable design.',
 'p1-ahmed-elsayed', 'Cairo Live Editorial',
 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800',
 'published', NOW() - INTERVAL '5 days',
 '["architecture","Cairo","sustainable design","culture"]', 'Culture', 6, 342),

('a2-coral-guardians', 'Guardians of the Red Sea: Nour Hassan''s Mission to Save Egypt''s Coral Reefs',
 'guardians-red-sea-nour-hassan',
 'Beneath the crystal waters of the Red Sea lies one of the world''s most biodiverse marine ecosystems. But rising temperatures and coastal development threaten this underwater paradise. Dr. Nour Hassan has dedicated her career to ensuring these coral reefs survive for future generations.

"The Red Sea corals are unique," Hassan says, adjusting her diving equipment at the Hurghada research station. "They''re naturally more heat-resistant than corals elsewhere. Understanding why could hold the key to saving reefs worldwide."

Her team''s innovative coral transplantation technique has successfully restored over 500 square meters of damaged reef, a breakthrough that has attracted attention from marine conservation organizations globally.',
 'Marine biologist Nour Hassan''s innovative research is giving hope to coral reef conservation efforts across the Red Sea.',
 'p2-nour-hassan', 'Cairo Live Editorial',
 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800',
 'published', NOW() - INTERVAL '3 days',
 '["marine biology","Red Sea","conservation","environment"]', 'Science', 7, 218),

('a3-fintech-revolution', 'From Cairo to the Continent: Omar Farouk''s Fintech Revolution',
 'cairo-continent-omar-farouk-fintech',
 'When Omar Farouk graduated from the American University in Cairo, he noticed something that would change his life: millions of Egyptians had smartphones but no bank accounts. This observation led to the creation of PayNile, now one of North Africa''s largest mobile payment platforms.

"Financial inclusion isn''t just about technology," Farouk emphasizes during our conversation at PayNile''s Maadi headquarters. "It''s about trust. We had to build a product that a street vendor in Bab El-Sha''riya would trust as much as a businessman in Zamalek."

Today, PayNile processes over 2 million transactions daily and has expanded to three other African countries.',
 'How Omar Farouk''s PayNile is bringing financial services to millions of unbanked Egyptians and expanding across Africa.',
 'p3-omar-farouk', 'Cairo Live Editorial',
 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
 'published', NOW() - INTERVAL '1 day',
 '["fintech","entrepreneurship","Africa","financial inclusion"]', 'Business', 5, 156),

('a4-daughters-of-nile', 'Yasmine Khalil: Writing Egypt''s Stories for the World',
 'yasmine-khalil-writing-egypt-stories',
 'Draft article about Yasmine Khalil''s literary journey and her upcoming streaming adaptation.',
 'An intimate look at how novelist Yasmine Khalil captures the essence of Egyptian life in her internationally acclaimed works.',
 'p4-yasmine-khalil', 'Cairo Live Editorial',
 NULL, 'draft', NULL,
 '["literature","Egyptian culture","storytelling","arts"]', 'Arts', 8, 0)
ON CONFLICT (id) DO NOTHING;

-- Submissions (2 pending)
INSERT INTO submissions (id, first_name, last_name, email, gender, bio, current_position, current_company, location, keywords, status, submitted_by) VALUES
('s1-tarek-ibrahim', 'Tarek', 'Ibrahim', 'tarek.ibrahim@example.com', 'male',
 'Egyptian space scientist working at the European Space Agency on Mars exploration missions.',
 'Senior Space Scientist', 'European Space Agency', 'Darmstadt, Germany',
 '["space science","Mars exploration","ESA","aerospace"]',
 'pending', 'tarek.ibrahim@example.com'),

('s2-dina-rashid', 'Dina', 'Rashid', 'dina.rashid@example.com', 'female',
 'Egyptian chef bringing traditional Egyptian cuisine to fine dining. Owner of a Michelin-starred restaurant in London.',
 'Executive Chef & Owner', 'Papyrus Restaurant', 'London, UK',
 '["culinary arts","Egyptian cuisine","fine dining","Michelin"]',
 'pending', 'dina.rashid@example.com')
ON CONFLICT (id) DO NOTHING;

-- Subscribers (4 subscribers)
INSERT INTO subscribers (id, email, first_name, last_name, is_active) VALUES
('sub1', 'fan1@example.com', 'Sara', 'Mohamed', true),
('sub2', 'fan2@example.com', 'Hassan', 'Ali', true),
('sub3', 'fan3@example.com', 'Mona', 'Samir', true),
('sub4', 'fan4@example.com', 'Khaled', 'Nasser', false)
ON CONFLICT (id) DO NOTHING;

-- Done!
SELECT 'Schema created and seeded successfully!' as status;
SELECT 'persons: ' || COUNT(*) FROM persons;
SELECT 'articles: ' || COUNT(*) FROM articles;
SELECT 'submissions: ' || COUNT(*) FROM submissions;
SELECT 'subscribers: ' || COUNT(*) FROM subscribers;
