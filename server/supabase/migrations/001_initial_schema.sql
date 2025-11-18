-- ============================================================================
-- Initial Database Schema Migration
-- Project: Influencer Travel Platform
-- Database: Supabase (PostgreSQL)
-- Version: 1.0
-- Created: 2025-01-18
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 2.1 User Related Tables
-- ----------------------------------------------------------------------------

-- profiles (extends auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),                    -- Verified phone number
    phone_verified BOOLEAN DEFAULT FALSE, -- Phone verification status
    name VARCHAR(100),                    -- Real name
    nickname VARCHAR(50),                 -- Nickname
    avatar_url TEXT,                      -- Profile image URL
    instagram_url VARCHAR(255),           -- Instagram link
    gender VARCHAR(10),                   -- male, female, other
    birth_date DATE,                      -- Date of birth
    bio TEXT,                             -- Bio/Introduction
    role VARCHAR(20) DEFAULT 'user',      -- user, influencer, admin
    status VARCHAR(20) DEFAULT 'active',  -- active, suspended, deleted
    notification_settings JSONB DEFAULT '{
        "push": true,
        "email": true,
        "sms": true
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_profiles_role CHECK (role IN ('user', 'influencer', 'admin', 'super_admin')),
    CONSTRAINT chk_profiles_status CHECK (status IN ('active', 'suspended', 'deleted')),
    CONSTRAINT chk_profiles_gender CHECK (gender IS NULL OR gender IN ('male', 'female', 'other'))
);

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON COLUMN public.profiles.phone_verified IS 'Whether the phone number has been verified';
COMMENT ON COLUMN public.profiles.role IS 'User role: user, influencer, admin, super_admin';

-- Indexes for profiles
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ----------------------------------------------------------------------------
-- influencer_profiles (Influencer additional information)
-- ----------------------------------------------------------------------------

CREATE TABLE public.influencer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Influencer information
    display_name VARCHAR(100) NOT NULL,   -- Display/Stage name
    category VARCHAR(50),                  -- Travel, Beauty, Food, etc.
    follower_count INTEGER DEFAULT 0,      -- Follower count
    description TEXT,                      -- Influencer introduction
    sns_links JSONB DEFAULT '[]',          -- [{platform, url}]

    -- Settlement information
    bank_name VARCHAR(50),                 -- Bank name
    bank_account VARCHAR(50),              -- Account number
    account_holder VARCHAR(100),           -- Account holder name
    business_number VARCHAR(20),           -- Business registration number (optional)

    -- Fee settings (individual settings, null means use default)
    custom_course_fee_rate DECIMAL(5,2),   -- Course fee rate
    custom_party_fee_rate DECIMAL(5,2),    -- Party fee rate

    -- Statistics
    total_courses INTEGER DEFAULT 0,
    total_parties INTEGER DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,

    -- Status
    verification_status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
    is_featured BOOLEAN DEFAULT FALSE,     -- Featured influencer

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_influencer_user UNIQUE (user_id),
    CONSTRAINT chk_influencer_verification_status CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    CONSTRAINT chk_influencer_fee_rates CHECK (
        (custom_course_fee_rate IS NULL OR (custom_course_fee_rate >= 0 AND custom_course_fee_rate <= 100)) AND
        (custom_party_fee_rate IS NULL OR (custom_party_fee_rate >= 0 AND custom_party_fee_rate <= 100))
    )
);

COMMENT ON TABLE public.influencer_profiles IS 'Additional profile information for influencers';
COMMENT ON COLUMN public.influencer_profiles.verification_status IS 'Account verification status';
COMMENT ON COLUMN public.influencer_profiles.custom_course_fee_rate IS 'Custom fee rate for courses, null uses default';

-- Indexes for influencer_profiles
CREATE INDEX idx_influencer_user ON influencer_profiles(user_id);
CREATE INDEX idx_influencer_category ON influencer_profiles(category);
CREATE INDEX idx_influencer_verification ON influencer_profiles(verification_status);
CREATE INDEX idx_influencer_featured ON influencer_profiles(is_featured);
CREATE INDEX idx_influencer_rating ON influencer_profiles(average_rating DESC);

-- ----------------------------------------------------------------------------
-- 2.2 Course Related Tables
-- ----------------------------------------------------------------------------

-- courses (Travel courses)
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID NOT NULL REFERENCES influencer_profiles(id),

    -- Basic information
    title VARCHAR(200) NOT NULL,           -- Course title
    description TEXT,                       -- Course description
    thumbnail_url TEXT,                     -- Thumbnail image
    images JSONB DEFAULT '[]',              -- Additional images array

    -- Destination information
    country VARCHAR(100) NOT NULL,          -- Country
    city VARCHAR(100) NOT NULL,             -- City

    -- Schedule
    start_date DATE NOT NULL,               -- Start date
    end_date DATE NOT NULL,                 -- End date
    total_days INTEGER NOT NULL,            -- Total days

    -- Recruitment information
    recruitment_start DATE NOT NULL,        -- Recruitment start date
    recruitment_end DATE NOT NULL,          -- Recruitment end date
    min_participants INTEGER DEFAULT 1,     -- Minimum participants
    max_participants INTEGER NOT NULL,      -- Maximum participants
    current_participants INTEGER DEFAULT 0, -- Current confirmed participants

    -- Participation requirements
    allowed_gender VARCHAR(20) DEFAULT 'all', -- all, male, female
    min_age INTEGER,                        -- Minimum age
    max_age INTEGER,                        -- Maximum age
    requirements TEXT,                       -- Additional requirements

    -- Pricing
    price DECIMAL(12,2) NOT NULL,           -- Participation fee
    price_includes TEXT,                     -- What's included
    price_excludes TEXT,                     -- What's not included

    -- Included/Optional items
    included_items JSONB DEFAULT '[]',      -- Included items [{name, description}]
    optional_items JSONB DEFAULT '[]',      -- Optional items [{name, description, price}]

    -- Accommodation information
    accommodation JSONB DEFAULT '{
        "name": "",
        "description": "",
        "address": "",
        "map_url": "",
        "images": []
    }',

    -- Status
    status VARCHAR(20) DEFAULT 'draft',     -- draft, recruiting, closed, ongoing, completed, cancelled
    visibility VARCHAR(20) DEFAULT 'public', -- public, private, unlisted

    -- Refund policy
    refund_policy TEXT,

    -- Metadata
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT chk_courses_status CHECK (status IN ('draft', 'recruiting', 'closed', 'ongoing', 'completed', 'cancelled')),
    CONSTRAINT chk_courses_visibility CHECK (visibility IN ('public', 'private', 'unlisted')),
    CONSTRAINT chk_courses_allowed_gender CHECK (allowed_gender IN ('all', 'male', 'female')),
    CONSTRAINT chk_courses_dates CHECK (start_date <= end_date),
    CONSTRAINT chk_courses_recruitment_dates CHECK (recruitment_start <= recruitment_end),
    CONSTRAINT chk_courses_participants CHECK (min_participants >= 0 AND max_participants >= min_participants),
    CONSTRAINT chk_courses_price CHECK (price >= 0),
    CONSTRAINT chk_courses_age CHECK ((min_age IS NULL OR min_age >= 0) AND (max_age IS NULL OR max_age >= 0))
);

COMMENT ON TABLE public.courses IS 'Travel courses organized by influencers';
COMMENT ON COLUMN public.courses.status IS 'Course status: draft, recruiting, closed, ongoing, completed, cancelled';
COMMENT ON COLUMN public.courses.allowed_gender IS 'Gender restriction: all, male, female';

-- Indexes for courses
CREATE INDEX idx_courses_influencer ON courses(influencer_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_dates ON courses(start_date, end_date);
CREATE INDEX idx_courses_recruitment ON courses(recruitment_start, recruitment_end);
CREATE INDEX idx_courses_location ON courses(country, city);
CREATE INDEX idx_courses_price ON courses(price);
CREATE INDEX idx_courses_visibility ON courses(visibility);
CREATE INDEX idx_courses_created ON courses(created_at DESC);

-- course_days (Daily schedules)
CREATE TABLE public.course_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    day_number INTEGER NOT NULL,            -- Day 1, 2, 3...
    date DATE NOT NULL,                     -- Actual date
    title VARCHAR(200),                     -- Day title

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_course_day UNIQUE (course_id, day_number),
    CONSTRAINT chk_course_days_number CHECK (day_number > 0)
);

COMMENT ON TABLE public.course_days IS 'Daily schedule structure for courses';

-- Indexes for course_days
CREATE INDEX idx_course_days_course ON course_days(course_id);
CREATE INDEX idx_course_days_date ON course_days(date);

-- course_day_items (Schedule detail items)
CREATE TABLE public.course_day_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_day_id UUID NOT NULL REFERENCES course_days(id) ON DELETE CASCADE,

    order_index INTEGER NOT NULL,           -- Order
    time_slot VARCHAR(50),                  -- Time slot (e.g., "09:00", "Morning")
    title VARCHAR(200) NOT NULL,            -- Item title
    description TEXT,                       -- Item description
    location_name VARCHAR(200),             -- Location name
    location_address TEXT,                  -- Address
    map_url TEXT,                           -- Google Maps link
    images JSONB DEFAULT '[]',              -- Images array
    item_type VARCHAR(50) DEFAULT 'activity', -- activity, meal, transport, free
    is_optional BOOLEAN DEFAULT FALSE,      -- Optional item

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_course_day_items_type CHECK (item_type IN ('activity', 'meal', 'transport', 'free', 'accommodation')),
    CONSTRAINT chk_course_day_items_order CHECK (order_index >= 0)
);

COMMENT ON TABLE public.course_day_items IS 'Individual schedule items within a course day';

-- Indexes for course_day_items
CREATE INDEX idx_course_day_items_day ON course_day_items(course_day_id);
CREATE INDEX idx_course_day_items_order ON course_day_items(course_day_id, order_index);

-- ----------------------------------------------------------------------------
-- 2.3 Application/Participation Related Tables
-- ----------------------------------------------------------------------------

-- course_applications (Course applications)
CREATE TABLE public.course_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),
    user_id UUID NOT NULL REFERENCES profiles(id),

    -- Application information
    applicant_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    instagram_url VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(10),
    introduction TEXT,                      -- Self-introduction/Application motivation

    -- Status
    status VARCHAR(20) DEFAULT 'pending',   -- pending, confirmed, rejected, cancelled
    status_reason TEXT,                      -- Status change reason

    -- Payment information
    payment_id UUID,                        -- Linked payment
    paid_amount DECIMAL(12,2),              -- Paid amount

    -- Timestamps
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_course_application UNIQUE (course_id, user_id),
    CONSTRAINT chk_course_apps_status CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled')),
    CONSTRAINT chk_course_apps_gender CHECK (gender IS NULL OR gender IN ('male', 'female', 'other'))
);

COMMENT ON TABLE public.course_applications IS 'User applications for courses';

-- Indexes for course_applications
CREATE INDEX idx_course_apps_course ON course_applications(course_id);
CREATE INDEX idx_course_apps_user ON course_applications(user_id);
CREATE INDEX idx_course_apps_status ON course_applications(status);
CREATE INDEX idx_course_apps_applied ON course_applications(applied_at DESC);

-- course_participants_expenses (Participant expenses)
CREATE TABLE public.course_participants_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),
    user_id UUID NOT NULL REFERENCES profiles(id),

    -- Expense balance
    balance DECIMAL(12,2) DEFAULT 0,        -- Current balance
    total_charged DECIMAL(12,2) DEFAULT 0,  -- Total charged amount
    total_used DECIMAL(12,2) DEFAULT 0,     -- Total used amount

    -- Requested charge amount
    requested_amount DECIMAL(12,2),          -- Amount requested by influencer

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_participant_expense UNIQUE (course_id, user_id),
    CONSTRAINT chk_expenses_balance CHECK (balance >= 0),
    CONSTRAINT chk_expenses_amounts CHECK (total_charged >= 0 AND total_used >= 0)
);

COMMENT ON TABLE public.course_participants_expenses IS 'Expense accounts for course participants';

-- Indexes for course_participants_expenses
CREATE INDEX idx_expenses_course ON course_participants_expenses(course_id);
CREATE INDEX idx_expenses_user ON course_participants_expenses(user_id);

-- expense_transactions (Expense transaction history)
CREATE TABLE public.expense_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES course_participants_expenses(id),

    type VARCHAR(20) NOT NULL,              -- charge, deduct, refund
    amount DECIMAL(12,2) NOT NULL,
    balance_after DECIMAL(12,2) NOT NULL,   -- Balance after transaction

    -- Related information
    payment_id UUID,                        -- Payment ID for charges
    nbang_item_id UUID,                     -- N-bang item ID for deductions
    description TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_expense_tx_type CHECK (type IN ('charge', 'deduct', 'refund')),
    CONSTRAINT chk_expense_tx_amount CHECK (amount > 0)
);

COMMENT ON TABLE public.expense_transactions IS 'Transaction history for participant expenses';

-- Indexes for expense_transactions
CREATE INDEX idx_expense_tx_expense ON expense_transactions(expense_id);
CREATE INDEX idx_expense_tx_type ON expense_transactions(type);
CREATE INDEX idx_expense_tx_created ON expense_transactions(created_at DESC);

-- ----------------------------------------------------------------------------
-- 2.4 N-bang Settlement Related Tables
-- ----------------------------------------------------------------------------

-- course_nbang_items (N-bang settlement items)
CREATE TABLE public.course_nbang_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),

    -- Item information
    title VARCHAR(200) NOT NULL,            -- N-bang item name
    description TEXT,
    total_amount DECIMAL(12,2) NOT NULL,    -- Total amount
    per_person_amount DECIMAL(12,2) NOT NULL, -- Per person amount

    -- Fee options
    include_fee_in_amount BOOLEAN DEFAULT FALSE, -- Whether fee is included

    -- Participant count
    participant_count INTEGER NOT NULL,

    -- Status
    status VARCHAR(20) DEFAULT 'pending',   -- pending, completed, cancelled

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_nbang_items_status CHECK (status IN ('pending', 'completed', 'cancelled')),
    CONSTRAINT chk_nbang_items_amounts CHECK (total_amount >= 0 AND per_person_amount >= 0),
    CONSTRAINT chk_nbang_items_participants CHECK (participant_count > 0)
);

COMMENT ON TABLE public.course_nbang_items IS 'N-bang split payment items for courses';

-- Indexes for course_nbang_items
CREATE INDEX idx_nbang_items_course ON course_nbang_items(course_id);
CREATE INDEX idx_nbang_items_status ON course_nbang_items(status);

-- course_nbang_participants (N-bang participants)
CREATE TABLE public.course_nbang_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nbang_item_id UUID NOT NULL REFERENCES course_nbang_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),

    amount DECIMAL(12,2) NOT NULL,          -- Amount to pay
    is_paid BOOLEAN DEFAULT FALSE,          -- Whether deducted from expenses
    paid_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_nbang_participant UNIQUE (nbang_item_id, user_id),
    CONSTRAINT chk_nbang_participants_amount CHECK (amount >= 0)
);

COMMENT ON TABLE public.course_nbang_participants IS 'Participants in N-bang split payments';

-- Indexes for course_nbang_participants
CREATE INDEX idx_nbang_participants_item ON course_nbang_participants(nbang_item_id);
CREATE INDEX idx_nbang_participants_user ON course_nbang_participants(user_id);
CREATE INDEX idx_nbang_participants_paid ON course_nbang_participants(is_paid);

-- ----------------------------------------------------------------------------
-- 2.5 Party Related Tables
-- ----------------------------------------------------------------------------

-- parties (Parties/Events)
CREATE TABLE public.parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID NOT NULL REFERENCES influencer_profiles(id),

    -- Basic information
    title VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    images JSONB DEFAULT '[]',

    -- Location/Time
    location_name VARCHAR(200),
    location_address TEXT,
    map_url TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,

    -- Recruitment information
    recruitment_start DATE NOT NULL,
    recruitment_end DATE NOT NULL,
    min_participants INTEGER DEFAULT 1,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,

    -- Participation requirements
    allowed_gender VARCHAR(20) DEFAULT 'all',
    min_age INTEGER,
    max_age INTEGER,

    -- Pricing
    price DECIMAL(12,2) NOT NULL,
    price_description TEXT,

    -- Status
    status VARCHAR(20) DEFAULT 'draft',     -- draft, recruiting, closed, ongoing, completed, cancelled

    -- Refund policy
    refund_policy TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_parties_status CHECK (status IN ('draft', 'recruiting', 'closed', 'ongoing', 'completed', 'cancelled')),
    CONSTRAINT chk_parties_allowed_gender CHECK (allowed_gender IN ('all', 'male', 'female')),
    CONSTRAINT chk_parties_recruitment_dates CHECK (recruitment_start <= recruitment_end),
    CONSTRAINT chk_parties_participants CHECK (min_participants >= 0 AND max_participants >= min_participants),
    CONSTRAINT chk_parties_price CHECK (price >= 0)
);

COMMENT ON TABLE public.parties IS 'Party/Event listings by influencers';

-- Indexes for parties
CREATE INDEX idx_parties_influencer ON parties(influencer_id);
CREATE INDEX idx_parties_status ON parties(status);
CREATE INDEX idx_parties_date ON parties(event_date);
CREATE INDEX idx_parties_recruitment ON parties(recruitment_start, recruitment_end);
CREATE INDEX idx_parties_created ON parties(created_at DESC);

-- party_applications (Party applications)
CREATE TABLE public.party_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_id UUID NOT NULL REFERENCES parties(id),
    user_id UUID NOT NULL REFERENCES profiles(id),

    -- Application information
    applicant_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    instagram_url VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(10),
    introduction TEXT,

    -- Status
    status VARCHAR(20) DEFAULT 'pending',
    status_reason TEXT,

    -- Payment information
    payment_id UUID,
    paid_amount DECIMAL(12,2),

    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_party_application UNIQUE (party_id, user_id),
    CONSTRAINT chk_party_apps_status CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled')),
    CONSTRAINT chk_party_apps_gender CHECK (gender IS NULL OR gender IN ('male', 'female', 'other'))
);

COMMENT ON TABLE public.party_applications IS 'User applications for parties';

-- Indexes for party_applications
CREATE INDEX idx_party_apps_party ON party_applications(party_id);
CREATE INDEX idx_party_apps_user ON party_applications(user_id);
CREATE INDEX idx_party_apps_status ON party_applications(status);
CREATE INDEX idx_party_apps_applied ON party_applications(applied_at DESC);

-- ----------------------------------------------------------------------------
-- 2.6 Payment/Settlement Related Tables
-- ----------------------------------------------------------------------------

-- payments (Payment records)
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),

    -- Payment type
    payment_type VARCHAR(50) NOT NULL,      -- course_fee, party_fee, expense_charge
    reference_type VARCHAR(50),             -- course, party
    reference_id UUID,                      -- Course/Party ID

    -- Payment information
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50),             -- naverpay, card
    pg_provider VARCHAR(50),                -- NaverPay, Toss, etc.

    -- PG response information
    pg_transaction_id VARCHAR(100),         -- PG transaction ID
    pg_response JSONB,                      -- PG response raw data

    -- Status
    status VARCHAR(20) DEFAULT 'pending',   -- pending, completed, failed, refunded, partial_refunded

    -- Refund information
    refunded_amount DECIMAL(12,2) DEFAULT 0,
    refund_reason TEXT,
    refunded_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_payments_type CHECK (payment_type IN ('course_fee', 'party_fee', 'expense_charge')),
    CONSTRAINT chk_payments_reference_type CHECK (reference_type IS NULL OR reference_type IN ('course', 'party')),
    CONSTRAINT chk_payments_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'partial_refunded')),
    CONSTRAINT chk_payments_amount CHECK (amount > 0),
    CONSTRAINT chk_payments_refund CHECK (refunded_amount >= 0 AND refunded_amount <= amount)
);

COMMENT ON TABLE public.payments IS 'Payment transaction records';
COMMENT ON COLUMN public.payments.payment_type IS 'Type: course_fee, party_fee, expense_charge';

-- Indexes for payments
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_type ON payments(payment_type);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_reference ON payments(reference_type, reference_id);
CREATE INDEX idx_payments_pg_tx ON payments(pg_transaction_id);
CREATE INDEX idx_payments_created ON payments(created_at DESC);

-- settlements (Settlement records)
CREATE TABLE public.settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID NOT NULL REFERENCES influencer_profiles(id),

    -- Settlement target
    settlement_type VARCHAR(50) NOT NULL,   -- course, party, nbang
    reference_type VARCHAR(50),
    reference_id UUID,

    -- Amount information
    gross_amount DECIMAL(12,2) NOT NULL,    -- Gross income
    fee_rate DECIMAL(5,2) NOT NULL,         -- Fee rate
    fee_amount DECIMAL(12,2) NOT NULL,      -- Fee amount
    pg_fee_amount DECIMAL(12,2) DEFAULT 0,  -- PG fee
    net_amount DECIMAL(12,2) NOT NULL,      -- Net settlement amount

    -- Status
    status VARCHAR(20) DEFAULT 'pending',   -- pending, processing, completed, failed

    -- Payment information
    bank_name VARCHAR(50),
    bank_account VARCHAR(50),
    account_holder VARCHAR(100),

    -- Timestamps
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Documentation
    receipt_url TEXT,
    notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_settlements_type CHECK (settlement_type IN ('course', 'party', 'nbang')),
    CONSTRAINT chk_settlements_status CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    CONSTRAINT chk_settlements_amounts CHECK (gross_amount >= 0 AND fee_amount >= 0 AND net_amount >= 0),
    CONSTRAINT chk_settlements_fee_rate CHECK (fee_rate >= 0 AND fee_rate <= 100)
);

COMMENT ON TABLE public.settlements IS 'Settlement records for influencer payouts';

-- Indexes for settlements
CREATE INDEX idx_settlements_influencer ON settlements(influencer_id);
CREATE INDEX idx_settlements_type ON settlements(settlement_type);
CREATE INDEX idx_settlements_status ON settlements(status);
CREATE INDEX idx_settlements_reference ON settlements(reference_type, reference_id);
CREATE INDEX idx_settlements_created ON settlements(created_at DESC);

-- ----------------------------------------------------------------------------
-- 2.7 Announcement/Message Related Tables
-- ----------------------------------------------------------------------------

-- course_announcements (Course announcements)
CREATE TABLE public.course_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id),

    title VARCHAR(200),
    content TEXT NOT NULL,
    images JSONB DEFAULT '[]',

    is_pinned BOOLEAN DEFAULT FALSE,        -- Pin to top

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.course_announcements IS 'Announcements for course participants';

-- Indexes for course_announcements
CREATE INDEX idx_announcements_course ON course_announcements(course_id);
CREATE INDEX idx_announcements_author ON course_announcements(author_id);
CREATE INDEX idx_announcements_pinned ON course_announcements(course_id, is_pinned DESC, created_at DESC);

-- announcement_comments (Announcement comments)
CREATE TABLE public.announcement_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID NOT NULL REFERENCES course_announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),

    content TEXT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.announcement_comments IS 'Comments on course announcements';

-- Indexes for announcement_comments
CREATE INDEX idx_comments_announcement ON announcement_comments(announcement_id);
CREATE INDEX idx_comments_user ON announcement_comments(user_id);

-- direct_messages (1:1 messages)
CREATE TABLE public.direct_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES profiles(id),
    receiver_id UUID NOT NULL REFERENCES profiles(id),

    -- Related course/party (optional)
    related_type VARCHAR(50),               -- course, party
    related_id UUID,

    content TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_dm_related_type CHECK (related_type IS NULL OR related_type IN ('course', 'party')),
    CONSTRAINT chk_dm_not_self CHECK (sender_id != receiver_id)
);

COMMENT ON TABLE public.direct_messages IS 'Direct messages between users';

-- Indexes for direct_messages
CREATE INDEX idx_dm_sender ON direct_messages(sender_id);
CREATE INDEX idx_dm_receiver ON direct_messages(receiver_id);
CREATE INDEX idx_dm_conversation ON direct_messages(sender_id, receiver_id);
CREATE INDEX idx_dm_unread ON direct_messages(receiver_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_dm_created ON direct_messages(created_at DESC);

-- ----------------------------------------------------------------------------
-- 2.8 Review/Rating Related Tables
-- ----------------------------------------------------------------------------

-- reviews (Reviews)
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),

    -- Review target
    review_type VARCHAR(50) NOT NULL,       -- course, party, influencer
    reference_id UUID NOT NULL,

    -- Rating
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),

    -- Content
    content TEXT,
    images JSONB DEFAULT '[]',

    -- Status
    status VARCHAR(20) DEFAULT 'active',    -- active, hidden, deleted
    is_reported BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_review UNIQUE (user_id, review_type, reference_id),
    CONSTRAINT chk_reviews_type CHECK (review_type IN ('course', 'party', 'influencer')),
    CONSTRAINT chk_reviews_status CHECK (status IN ('active', 'hidden', 'deleted'))
);

COMMENT ON TABLE public.reviews IS 'User reviews for courses, parties, and influencers';

-- Indexes for reviews
CREATE INDEX idx_reviews_type_ref ON reviews(review_type, reference_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

-- travel_records (Travel records)
CREATE TABLE public.travel_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),
    user_id UUID NOT NULL REFERENCES profiles(id),

    title VARCHAR(200),
    content TEXT,
    images JSONB DEFAULT '[]',

    -- Visibility settings
    visibility VARCHAR(20) DEFAULT 'public', -- public, private, friends

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_records_visibility CHECK (visibility IN ('public', 'private', 'friends'))
);

COMMENT ON TABLE public.travel_records IS 'User travel records/journals for courses';

-- Indexes for travel_records
CREATE INDEX idx_records_course ON travel_records(course_id);
CREATE INDEX idx_records_user ON travel_records(user_id);
CREATE INDEX idx_records_visibility ON travel_records(visibility);
CREATE INDEX idx_records_created ON travel_records(created_at DESC);

-- ----------------------------------------------------------------------------
-- 2.9 Notification Related Tables
-- ----------------------------------------------------------------------------

-- notifications (Notifications)
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),

    type VARCHAR(50) NOT NULL,              -- Notification type
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,

    -- Related data
    data JSONB DEFAULT '{}',                -- {referenceType, referenceId, ...}

    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,

    -- Send status
    sent_push BOOLEAN DEFAULT FALSE,
    sent_email BOOLEAN DEFAULT FALSE,
    sent_sms BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.notifications IS 'User notifications';

-- Indexes for notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC)
WHERE is_read = FALSE;

-- ----------------------------------------------------------------------------
-- 2.10 Admin Settings Tables
-- ----------------------------------------------------------------------------

-- admin_settings (Admin settings)
CREATE TABLE public.admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,

    updated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.admin_settings IS 'Platform-wide admin settings';

-- Indexes for admin_settings
CREATE INDEX idx_admin_settings_key ON admin_settings(key);

-- fee_history (Fee change history)
CREATE TABLE public.fee_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID REFERENCES influencer_profiles(id), -- NULL means global default

    fee_type VARCHAR(50) NOT NULL,          -- course, party, pg
    old_rate DECIMAL(5,2),
    new_rate DECIMAL(5,2) NOT NULL,

    changed_by UUID REFERENCES profiles(id),
    reason TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_fee_history_type CHECK (fee_type IN ('course', 'party', 'pg')),
    CONSTRAINT chk_fee_history_rates CHECK (
        (old_rate IS NULL OR (old_rate >= 0 AND old_rate <= 100)) AND
        (new_rate >= 0 AND new_rate <= 100)
    )
);

COMMENT ON TABLE public.fee_history IS 'History of fee rate changes';

-- Indexes for fee_history
CREATE INDEX idx_fee_history_influencer ON fee_history(influencer_id);
CREATE INDEX idx_fee_history_type ON fee_history(fee_type);
CREATE INDEX idx_fee_history_created ON fee_history(created_at DESC);

-- ----------------------------------------------------------------------------
-- 2.11 Report/Management Tables
-- ----------------------------------------------------------------------------

-- reports (Reports)
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES profiles(id),

    -- Report target
    target_type VARCHAR(50) NOT NULL,       -- user, review, message
    target_id UUID NOT NULL,

    -- Report content
    reason VARCHAR(100) NOT NULL,           -- spam, harassment, inappropriate, etc
    description TEXT,

    -- Processing
    status VARCHAR(20) DEFAULT 'pending',   -- pending, reviewed, resolved, dismissed
    handled_by UUID REFERENCES profiles(id),
    handled_at TIMESTAMP WITH TIME ZONE,
    resolution TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_reports_target_type CHECK (target_type IN ('user', 'review', 'message', 'course', 'party')),
    CONSTRAINT chk_reports_status CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed'))
);

COMMENT ON TABLE public.reports IS 'User reports for moderation';

-- Indexes for reports
CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE INDEX idx_reports_created ON reports(created_at DESC);

-- ----------------------------------------------------------------------------
-- 2.12 Additional Tables (Not in original schema)
-- ----------------------------------------------------------------------------

-- inquiries (1:1 Support inquiries)
CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),

    -- Inquiry information
    category VARCHAR(50) NOT NULL,          -- payment, refund, course, party, account, other
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    images JSONB DEFAULT '[]',

    -- Related reference (optional)
    reference_type VARCHAR(50),             -- course, party, payment
    reference_id UUID,

    -- Status
    status VARCHAR(20) DEFAULT 'pending',   -- pending, in_progress, answered, closed
    priority VARCHAR(20) DEFAULT 'normal',  -- low, normal, high, urgent

    -- Assignment
    assigned_to UUID REFERENCES profiles(id),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT chk_inquiries_category CHECK (category IN ('payment', 'refund', 'course', 'party', 'account', 'technical', 'other')),
    CONSTRAINT chk_inquiries_status CHECK (status IN ('pending', 'in_progress', 'answered', 'closed')),
    CONSTRAINT chk_inquiries_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

COMMENT ON TABLE public.inquiries IS '1:1 customer support inquiries';

-- Indexes for inquiries
CREATE INDEX idx_inquiries_user ON inquiries(user_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_category ON inquiries(category);
CREATE INDEX idx_inquiries_assigned ON inquiries(assigned_to);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);

-- inquiry_responses (Inquiry responses)
CREATE TABLE public.inquiry_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    responder_id UUID NOT NULL REFERENCES profiles(id),

    content TEXT NOT NULL,
    images JSONB DEFAULT '[]',

    -- Whether this is an admin response or user follow-up
    is_admin_response BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.inquiry_responses IS 'Responses to customer inquiries';

-- Indexes for inquiry_responses
CREATE INDEX idx_inquiry_responses_inquiry ON inquiry_responses(inquiry_id);
CREATE INDEX idx_inquiry_responses_responder ON inquiry_responses(responder_id);
CREATE INDEX idx_inquiry_responses_created ON inquiry_responses(created_at);

-- banners (Main banners)
CREATE TABLE public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Banner information
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(300),
    image_url TEXT NOT NULL,
    link_url TEXT,
    link_type VARCHAR(50),                  -- internal, external, course, party
    link_target_id UUID,                    -- For course/party links

    -- Display settings
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,

    -- Target audience
    target_audience VARCHAR(50) DEFAULT 'all', -- all, user, influencer

    -- Stats
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,

    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_banners_link_type CHECK (link_type IS NULL OR link_type IN ('internal', 'external', 'course', 'party')),
    CONSTRAINT chk_banners_target CHECK (target_audience IN ('all', 'user', 'influencer'))
);

COMMENT ON TABLE public.banners IS 'Main page promotional banners';

-- Indexes for banners
CREATE INDEX idx_banners_active ON banners(is_active, display_order);
CREATE INDEX idx_banners_dates ON banners(start_date, end_date);
CREATE INDEX idx_banners_target ON banners(target_audience);

-- notices (Service notices)
CREATE TABLE public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Notice information
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general', -- general, update, maintenance, event

    -- Display settings
    is_pinned BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,

    -- Target audience
    target_audience VARCHAR(50) DEFAULT 'all', -- all, user, influencer

    -- Stats
    view_count INTEGER DEFAULT 0,

    author_id UUID REFERENCES profiles(id),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_notices_category CHECK (category IN ('general', 'update', 'maintenance', 'event', 'policy')),
    CONSTRAINT chk_notices_target CHECK (target_audience IN ('all', 'user', 'influencer'))
);

COMMENT ON TABLE public.notices IS 'Platform service notices and announcements';

-- Indexes for notices
CREATE INDEX idx_notices_published ON notices(is_published, published_at DESC);
CREATE INDEX idx_notices_category ON notices(category);
CREATE INDEX idx_notices_pinned ON notices(is_pinned DESC, published_at DESC);
CREATE INDEX idx_notices_target ON notices(target_audience);

-- faqs (Frequently Asked Questions)
CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- FAQ information
    category VARCHAR(50) NOT NULL,          -- general, payment, refund, course, party, account
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,

    -- Display settings
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,

    -- Target audience
    target_audience VARCHAR(50) DEFAULT 'all', -- all, user, influencer

    -- Stats
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,

    author_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT chk_faqs_category CHECK (category IN ('general', 'payment', 'refund', 'course', 'party', 'account', 'influencer')),
    CONSTRAINT chk_faqs_target CHECK (target_audience IN ('all', 'user', 'influencer'))
);

COMMENT ON TABLE public.faqs IS 'Frequently asked questions';

-- Indexes for faqs
CREATE INDEX idx_faqs_category ON faqs(category, display_order);
CREATE INDEX idx_faqs_published ON faqs(is_published);
CREATE INDEX idx_faqs_target ON faqs(target_audience);

-- user_favorites (User favorites/likes)
CREATE TABLE public.user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Favorite target
    target_type VARCHAR(50) NOT NULL,       -- course, party, influencer
    target_id UUID NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_user_favorite UNIQUE (user_id, target_type, target_id),
    CONSTRAINT chk_favorites_target_type CHECK (target_type IN ('course', 'party', 'influencer'))
);

COMMENT ON TABLE public.user_favorites IS 'User favorites and bookmarks';

-- Indexes for user_favorites
CREATE INDEX idx_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_favorites_target ON user_favorites(target_type, target_id);
CREATE INDEX idx_favorites_user_type ON user_favorites(user_id, target_type);

-- ============================================================================
-- 3. ADDITIONAL INDEXES (Optimization)
-- ============================================================================

-- Composite indexes for search optimization
CREATE INDEX idx_courses_search ON courses(status, country, city, start_date);
CREATE INDEX idx_apps_user_status ON course_applications(user_id, status);

-- Partial indexes for active records
CREATE INDEX idx_active_courses ON courses(start_date, end_date)
WHERE status IN ('recruiting', 'ongoing');

CREATE INDEX idx_pending_settlements ON settlements(created_at)
WHERE status = 'pending';

-- Full text search indexes (optional, can be enabled if needed)
-- CREATE INDEX idx_courses_title_fts ON courses USING gin(to_tsvector('korean', title));
-- CREATE INDEX idx_parties_title_fts ON parties USING gin(to_tsvector('korean', title));

-- ============================================================================
-- 4. VIEWS
-- ============================================================================

-- v_course_details (Course details with influencer info and stats)
CREATE VIEW v_course_details AS
SELECT
    c.*,
    ip.display_name as influencer_name,
    ip.description as influencer_description,
    ip.follower_count as influencer_followers,
    ip.average_rating as influencer_rating,
    ip.verification_status as influencer_verification,
    p.avatar_url as influencer_avatar,
    p.instagram_url as influencer_instagram,
    COUNT(DISTINCT ca.id) FILTER (WHERE ca.status = 'pending') as pending_count,
    COUNT(DISTINCT ca.id) FILTER (WHERE ca.status = 'confirmed') as confirmed_count,
    AVG(r.rating)::DECIMAL(3,2) as average_rating,
    COUNT(DISTINCT r.id) as review_count
FROM courses c
JOIN influencer_profiles ip ON c.influencer_id = ip.id
JOIN profiles p ON ip.user_id = p.id
LEFT JOIN course_applications ca ON c.id = ca.course_id
LEFT JOIN reviews r ON r.reference_id = c.id AND r.review_type = 'course' AND r.status = 'active'
GROUP BY c.id, ip.id, p.id;

COMMENT ON VIEW v_course_details IS 'Course details with influencer information and statistics';

-- v_settlement_summary (Settlement summary per influencer)
CREATE VIEW v_settlement_summary AS
SELECT
    ip.id as influencer_id,
    ip.display_name,
    ip.user_id,
    p.email as user_email,
    p.name as user_name,
    ip.bank_name,
    ip.bank_account,
    ip.account_holder,
    COALESCE(SUM(s.gross_amount) FILTER (WHERE s.status = 'completed'), 0) as total_gross,
    COALESCE(SUM(s.fee_amount) FILTER (WHERE s.status = 'completed'), 0) as total_fees,
    COALESCE(SUM(s.net_amount) FILTER (WHERE s.status = 'completed'), 0) as total_net,
    COALESCE(SUM(s.net_amount) FILTER (WHERE s.status = 'pending'), 0) as pending_amount,
    COUNT(s.id) FILTER (WHERE s.status = 'completed') as completed_count,
    COUNT(s.id) FILTER (WHERE s.status = 'pending') as pending_count
FROM influencer_profiles ip
JOIN profiles p ON ip.user_id = p.id
LEFT JOIN settlements s ON ip.id = s.influencer_id
GROUP BY ip.id, p.id;

COMMENT ON VIEW v_settlement_summary IS 'Settlement summary statistics per influencer';

-- v_party_details (Party details with influencer info and stats)
CREATE VIEW v_party_details AS
SELECT
    pt.*,
    ip.display_name as influencer_name,
    ip.description as influencer_description,
    ip.follower_count as influencer_followers,
    ip.average_rating as influencer_rating,
    p.avatar_url as influencer_avatar,
    p.instagram_url as influencer_instagram,
    COUNT(DISTINCT pa.id) FILTER (WHERE pa.status = 'pending') as pending_count,
    COUNT(DISTINCT pa.id) FILTER (WHERE pa.status = 'confirmed') as confirmed_count,
    AVG(r.rating)::DECIMAL(3,2) as average_rating,
    COUNT(DISTINCT r.id) as review_count
FROM parties pt
JOIN influencer_profiles ip ON pt.influencer_id = ip.id
JOIN profiles p ON ip.user_id = p.id
LEFT JOIN party_applications pa ON pt.id = pa.party_id
LEFT JOIN reviews r ON r.reference_id = pt.id AND r.review_type = 'party' AND r.status = 'active'
GROUP BY pt.id, ip.id, p.id;

COMMENT ON VIEW v_party_details IS 'Party details with influencer information and statistics';

-- ============================================================================
-- 5. FUNCTIONS AND TRIGGERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 5.1 Update timestamp trigger function
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at() IS 'Automatically updates updated_at timestamp';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER tr_profiles_updated
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_influencer_profiles_updated
    BEFORE UPDATE ON influencer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_courses_updated
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_course_days_updated
    BEFORE UPDATE ON course_days
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_course_day_items_updated
    BEFORE UPDATE ON course_day_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_course_applications_updated
    BEFORE UPDATE ON course_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_course_participants_expenses_updated
    BEFORE UPDATE ON course_participants_expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_course_nbang_items_updated
    BEFORE UPDATE ON course_nbang_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_parties_updated
    BEFORE UPDATE ON parties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_party_applications_updated
    BEFORE UPDATE ON party_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_payments_updated
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_settlements_updated
    BEFORE UPDATE ON settlements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_course_announcements_updated
    BEFORE UPDATE ON course_announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_announcement_comments_updated
    BEFORE UPDATE ON announcement_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_reviews_updated
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_travel_records_updated
    BEFORE UPDATE ON travel_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_admin_settings_updated
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_inquiries_updated
    BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_inquiry_responses_updated
    BEFORE UPDATE ON inquiry_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_banners_updated
    BEFORE UPDATE ON banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_notices_updated
    BEFORE UPDATE ON notices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_faqs_updated
    BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ----------------------------------------------------------------------------
-- 5.2 Participant count update trigger
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'course_applications' THEN
        UPDATE courses
        SET current_participants = (
            SELECT COUNT(*) FROM course_applications
            WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
            AND status = 'confirmed'
        )
        WHERE id = COALESCE(NEW.course_id, OLD.course_id);
    ELSIF TG_TABLE_NAME = 'party_applications' THEN
        UPDATE parties
        SET current_participants = (
            SELECT COUNT(*) FROM party_applications
            WHERE party_id = COALESCE(NEW.party_id, OLD.party_id)
            AND status = 'confirmed'
        )
        WHERE id = COALESCE(NEW.party_id, OLD.party_id);
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_participant_count() IS 'Updates current_participants count when applications change';

CREATE TRIGGER tr_course_participant_count
    AFTER INSERT OR UPDATE OR DELETE ON course_applications
    FOR EACH ROW EXECUTE FUNCTION update_participant_count();

CREATE TRIGGER tr_party_participant_count
    AFTER INSERT OR UPDATE OR DELETE ON party_applications
    FOR EACH ROW EXECUTE FUNCTION update_participant_count();

-- ----------------------------------------------------------------------------
-- 5.3 Influencer stats update function
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_influencer_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_influencer_id UUID;
BEGIN
    -- Determine the influencer_id based on the trigger source
    IF TG_TABLE_NAME = 'courses' THEN
        v_influencer_id := COALESCE(NEW.influencer_id, OLD.influencer_id);
    ELSIF TG_TABLE_NAME = 'parties' THEN
        v_influencer_id := COALESCE(NEW.influencer_id, OLD.influencer_id);
    ELSIF TG_TABLE_NAME = 'reviews' THEN
        -- For reviews, we need to find the influencer
        IF NEW.review_type = 'influencer' THEN
            SELECT ip.id INTO v_influencer_id
            FROM influencer_profiles ip
            WHERE ip.user_id = NEW.reference_id;
        ELSE
            RETURN COALESCE(NEW, OLD);
        END IF;
    ELSE
        RETURN COALESCE(NEW, OLD);
    END IF;

    -- Update influencer stats
    IF v_influencer_id IS NOT NULL THEN
        UPDATE influencer_profiles ip
        SET
            total_courses = (
                SELECT COUNT(*) FROM courses
                WHERE influencer_id = ip.id AND status NOT IN ('draft', 'cancelled')
            ),
            total_parties = (
                SELECT COUNT(*) FROM parties
                WHERE influencer_id = ip.id AND status NOT IN ('draft', 'cancelled')
            ),
            total_participants = (
                SELECT COALESCE(SUM(current_participants), 0)
                FROM (
                    SELECT current_participants FROM courses
                    WHERE influencer_id = ip.id AND status = 'completed'
                    UNION ALL
                    SELECT current_participants FROM parties
                    WHERE influencer_id = ip.id AND status = 'completed'
                ) sub
            ),
            average_rating = (
                SELECT COALESCE(AVG(rating), 0)
                FROM reviews r
                WHERE r.review_type = 'influencer'
                AND r.reference_id = ip.user_id
                AND r.status = 'active'
            ),
            updated_at = NOW()
        WHERE ip.id = v_influencer_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_influencer_stats() IS 'Updates influencer statistics when related data changes';

CREATE TRIGGER tr_courses_stats
    AFTER INSERT OR UPDATE OR DELETE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_influencer_stats();

CREATE TRIGGER tr_parties_stats
    AFTER INSERT OR UPDATE OR DELETE ON parties
    FOR EACH ROW EXECUTE FUNCTION update_influencer_stats();

CREATE TRIGGER tr_reviews_stats
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_influencer_stats();

-- ----------------------------------------------------------------------------
-- 5.4 Create profile on user signup trigger
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION handle_new_user() IS 'Creates a profile entry when a new user signs up';

-- Note: This trigger should be created on auth.users
-- It may need to be run with elevated privileges
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ----------------------------------------------------------------------------
-- 5.5 Expense balance calculation function
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION calculate_expense_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the balance after transaction
    UPDATE course_participants_expenses
    SET
        balance = CASE
            WHEN NEW.type = 'charge' THEN balance + NEW.amount
            WHEN NEW.type = 'deduct' THEN balance - NEW.amount
            WHEN NEW.type = 'refund' THEN balance + NEW.amount
        END,
        total_charged = CASE
            WHEN NEW.type = 'charge' THEN total_charged + NEW.amount
            ELSE total_charged
        END,
        total_used = CASE
            WHEN NEW.type = 'deduct' THEN total_used + NEW.amount
            ELSE total_used
        END,
        updated_at = NOW()
    WHERE id = NEW.expense_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_expense_balance() IS 'Updates expense balance when transactions occur';

CREATE TRIGGER tr_expense_transaction_balance
    AFTER INSERT ON expense_transactions
    FOR EACH ROW EXECUTE FUNCTION calculate_expense_balance();

-- ============================================================================
-- 6. INITIAL DATA
-- ============================================================================

-- Default admin settings
INSERT INTO admin_settings (key, value, description) VALUES
    ('default_course_fee_rate', '10', 'Default course fee rate (%)'),
    ('default_party_fee_rate', '10', 'Default party fee rate (%)'),
    ('pg_fee_rate', '3.3', 'PG fee rate (%)'),
    ('min_expense_charge', '50000', 'Minimum expense charge amount'),
    ('platform_terms_version', '"1.0"', 'Terms of service version'),
    ('refund_policy_version', '"1.0"', 'Refund policy version'),
    ('platform_name', '"Influencer Travel"', 'Platform name'),
    ('contact_email', '"support@platform.com"', 'Support email'),
    ('contact_phone', '"02-1234-5678"', 'Support phone number'),
    ('maintenance_mode', 'false', 'Platform maintenance mode'),
    ('max_images_per_course', '10', 'Maximum images per course'),
    ('max_images_per_party', '10', 'Maximum images per party'),
    ('max_file_size_mb', '10', 'Maximum file upload size in MB'),
    ('settlement_day', '15', 'Monthly settlement processing day'),
    ('min_withdrawal_amount', '10000', 'Minimum withdrawal amount')
ON CONFLICT (key) DO NOTHING;

-- Default FAQ entries
INSERT INTO faqs (category, question, answer, display_order, is_published, target_audience) VALUES
    ('general', '서비스는 어떻게 이용하나요?', '인플루언서가 기획한 여행/파티에 참가 신청을 하고, 승인 후 결제를 진행하시면 됩니다.', 1, TRUE, 'all'),
    ('payment', '결제는 어떤 방법으로 할 수 있나요?', '네이버페이, 신용카드 등 다양한 결제 수단을 지원합니다.', 2, TRUE, 'all'),
    ('refund', '환불은 어떻게 받을 수 있나요?', '각 코스/파티의 환불 정책에 따라 환불이 진행됩니다. 상세 내용은 해당 상품의 환불 정책을 확인해주세요.', 3, TRUE, 'all'),
    ('course', '코스 참가 조건은 어떻게 되나요?', '각 코스별로 인플루언서가 설정한 참가 조건(성별, 나이 등)이 다릅니다. 상품 상세 페이지에서 확인해주세요.', 4, TRUE, 'user'),
    ('influencer', '인플루언서로 등록하려면 어떻게 해야 하나요?', '인플루언서 등록 신청 후 관리자 검토를 거쳐 승인됩니다. 자세한 내용은 인플루언서 가이드를 참고해주세요.', 5, TRUE, 'influencer'),
    ('account', '비밀번호를 잊어버렸어요.', '로그인 화면에서 "비밀번호 찾기"를 통해 이메일로 재설정 링크를 받으실 수 있습니다.', 6, TRUE, 'all')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) - Basic Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_day_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_participants_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_nbang_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_nbang_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Influencer profiles: Public read, owner update
CREATE POLICY "Influencer profiles are viewable by everyone" ON influencer_profiles
    FOR SELECT USING (true);

CREATE POLICY "Influencers can update own profile" ON influencer_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Courses: Public read for published, owner full access
CREATE POLICY "Public courses are viewable" ON courses
    FOR SELECT USING (visibility = 'public' OR
        influencer_id IN (SELECT id FROM influencer_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Influencers can manage own courses" ON courses
    FOR ALL USING (
        influencer_id IN (SELECT id FROM influencer_profiles WHERE user_id = auth.uid())
    );

-- Parties: Similar to courses
CREATE POLICY "Public parties are viewable" ON parties
    FOR SELECT USING (status != 'draft' OR
        influencer_id IN (SELECT id FROM influencer_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Influencers can manage own parties" ON parties
    FOR ALL USING (
        influencer_id IN (SELECT id FROM influencer_profiles WHERE user_id = auth.uid())
    );

-- Applications: Users see own, influencers see their courses
CREATE POLICY "Users can view own applications" ON course_applications
    FOR SELECT USING (
        user_id = auth.uid() OR
        course_id IN (SELECT id FROM courses WHERE influencer_id IN
            (SELECT id FROM influencer_profiles WHERE user_id = auth.uid()))
    );

CREATE POLICY "Users can create applications" ON course_applications
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Payments: Users see own payments
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (user_id = auth.uid());

-- Notifications: Users see own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Direct messages: Participants only
CREATE POLICY "Users can view own messages" ON direct_messages
    FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages" ON direct_messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Reviews: Public read, owner write
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can manage own reviews" ON reviews
    FOR ALL USING (user_id = auth.uid());

-- User favorites: Own only
CREATE POLICY "Users can manage own favorites" ON user_favorites
    FOR ALL USING (user_id = auth.uid());

-- Banners: Public read
CREATE POLICY "Active banners are viewable" ON banners
    FOR SELECT USING (is_active = true);

-- Notices: Public read for published
CREATE POLICY "Published notices are viewable" ON notices
    FOR SELECT USING (is_published = true);

-- FAQs: Public read for published
CREATE POLICY "Published FAQs are viewable" ON faqs
    FOR SELECT USING (is_published = true);

-- Admin settings: Read only for authenticated
CREATE POLICY "Settings readable by authenticated" ON admin_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Inquiries: Own only
CREATE POLICY "Users can manage own inquiries" ON inquiries
    FOR ALL USING (user_id = auth.uid());

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
