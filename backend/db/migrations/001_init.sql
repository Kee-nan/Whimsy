CREATE EXTENSION IF NOT EXISTS citext;

-- ============================================================
-- USERS
-- Mongo: firstName, lastName, username (unique), email (unique),
--        password, bio, view_setting, friends[], friendRequests[]
-- ============================================================
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    username        CITEXT UNIQUE NOT NULL,
    email           CITEXT UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    bio             TEXT DEFAULT '',
    view_setting    TEXT NOT NULL DEFAULT 'card' CHECK (view_setting IN ('table', 'card')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- MEDIA_ITEMS
-- Mongo didn't have this table — each list/review/favorite entry
-- duplicated { id, media, title, image } inline. This table is the
-- dedup point: id here maps to the old "mediaType/externalId" string.
-- ============================================================
CREATE TABLE media_items (
    id              SERIAL PRIMARY KEY,
    media_type      TEXT NOT NULL CHECK (media_type IN
                        ('movie','show','book','anime','manga','game','album')),
    external_id     TEXT NOT NULL,        -- the partner API's own ID
    title           TEXT NOT NULL,
    image_url       TEXT,
    metadata        JSONB NOT NULL DEFAULT '{}',
    cached_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (media_type, external_id)
);

-- ============================================================
-- LIST_ENTRIES
-- Mongo: user.lists[] = { id, media, title, image, listType }
-- ============================================================
CREATE TABLE list_entries (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    media_item_id   INTEGER NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
    status          TEXT NOT NULL CHECK (status IN ('current', 'completed', 'futures')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, media_item_id)
);

CREATE INDEX idx_list_entries_user_status ON list_entries (user_id, status);

-- ============================================================
-- FAVORITES
-- Mongo: user.favorites[] = { id, media, title, image, listType }
-- Frontend already treats this as a fixed 8-slot array (see
-- FavoritesGrid.js padding to 8 with nulls) — slot_index makes that
-- explicit and DB-enforced instead of implicit in the frontend.
-- ============================================================
CREATE TABLE favorites (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    media_item_id   INTEGER NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
    slot_index      SMALLINT NOT NULL CHECK (slot_index BETWEEN 0 AND 7),
    UNIQUE (user_id, slot_index),
    UNIQUE (user_id, media_item_id)
);

-- ============================================================
-- REVIEWS
-- Mongo: user.reviews[] = { id, image, rating, review, title }
-- ============================================================
CREATE TABLE reviews (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    media_item_id   INTEGER NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
    rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 30),
    review_text     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, media_item_id)
);

-- ============================================================
-- FRIENDSHIPS
-- Mongo: user.friends[] (ObjectId refs) + user.friendRequests[] (ObjectId refs),
-- mutated on both documents at once. Replaced with one row per relationship.
-- status='pending' = old friendRequests entry; status='accepted' = old friends entry.
-- ============================================================
CREATE TABLE friendships (
    id              SERIAL PRIMARY KEY,
    requester_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (requester_id, addressee_id),
    CHECK (requester_id <> addressee_id)
);

CREATE INDEX idx_friendships_addressee ON friendships (addressee_id, status);
CREATE INDEX idx_friendships_requester ON friendships (requester_id, status);
