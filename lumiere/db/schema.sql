-- Lumière — PostgreSQL schema
-- Run with:  npm run db:init   (requires DATABASE_URL)

CREATE TABLE IF NOT EXISTS products (
  id            INTEGER PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  brand         TEXT NOT NULL,
  category      TEXT NOT NULL,
  subcategory   TEXT NOT NULL,
  price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at    NUMERIC(10,2),
  rating        NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count  INTEGER NOT NULL DEFAULT 0,
  stock         INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  tagline       TEXT NOT NULL,
  description   TEXT NOT NULL,
  benefits      JSONB NOT NULL DEFAULT '[]',
  how_to_use    TEXT NOT NULL DEFAULT '',
  ingredients   TEXT NOT NULL DEFAULT '',
  skin_types    JSONB NOT NULL DEFAULT '[]',
  shades        JSONB NOT NULL DEFAULT '[]',
  visual        TEXT NOT NULL,
  tone          JSONB NOT NULL,
  badge         TEXT,
  popularity    INTEGER NOT NULL DEFAULT 0,
  created_at    DATE NOT NULL DEFAULT CURRENT_DATE
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_search ON products
  USING GIN (to_tsvector('english', name || ' ' || brand || ' ' || tagline));

CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  author      TEXT NOT NULL,
  skin        TEXT NOT NULL,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  verified    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  DATE NOT NULL DEFAULT CURRENT_DATE
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews (product_id);

CREATE TABLE IF NOT EXISTS orders (
  id            SERIAL PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,
  email         TEXT NOT NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  phone         TEXT NOT NULL,
  address       TEXT NOT NULL,
  city          TEXT NOT NULL,
  postal        TEXT NOT NULL,
  shipping      TEXT NOT NULL,
  payment       TEXT NOT NULL,
  promo         TEXT,
  subtotal      NUMERIC(10,2) NOT NULL,
  discount      NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  total         NUMERIC(10,2) NOT NULL,
  status        TEXT NOT NULL DEFAULT 'processing',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders (lower(email));

CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id),
  name        TEXT NOT NULL,
  shade       TEXT,
  unit_price  NUMERIC(10,2) NOT NULL,
  qty         INTEGER NOT NULL CHECK (qty > 0)
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          SERIAL PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  source      TEXT NOT NULL DEFAULT 'footer',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  contact     TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
