-- Phase 3 Database Schema for Wax Kandle Alpha Platform

-- Cleanup for clean reset (Uncomment if needed)
DROP TABLE IF EXISTS fans;
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS videos;

-- Videos Table
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    category TEXT NOT NULL, -- Added missing category field
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Songs Table
CREATE TABLE songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    youtube_url TEXT,
    audio_url TEXT,
    thumbnail_url TEXT NOT NULL,
    category TEXT NOT NULL, -- 'single' or 'freestyle'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fans Table (Contact Messages)
CREATE TABLE fans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimized Indexes for Speed
CREATE INDEX idx_videos_created_at_desc ON videos (created_at DESC);
CREATE INDEX idx_videos_title ON videos (title);

CREATE INDEX idx_songs_created_at_desc ON songs (created_at DESC);
CREATE INDEX idx_songs_category ON songs (category);
CREATE INDEX idx_songs_title ON songs (title);

CREATE INDEX idx_fans_email ON fans (email);
CREATE INDEX idx_fans_created_at_desc ON fans (created_at DESC);

-- Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    venue TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL, -- 'upcoming' or 'past'
    ticket_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Merch Table
CREATE TABLE merch (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    price TEXT NOT NULL,
    image_url TEXT NOT NULL,
    status TEXT NOT NULL, -- 'pre-order' or 'coming-soon'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Additional Indexes
CREATE INDEX idx_events_date_desc ON events (date DESC);
CREATE INDEX idx_merch_created_at_desc ON merch (created_at DESC);
