-- =====================================================
-- Konten.in - Complete Database Schema and Seed Data
-- =====================================================
-- Run this entire file in your Supabase SQL Editor
-- This will create tables, indexes, RLS policies, and insert sample data

-- =====================================================
-- 1. DROP EXISTING TABLES (if you want a clean start)
-- =====================================================
-- Uncomment the lines below if you want to start fresh
-- DROP TABLE IF EXISTS prompts CASCADE;
-- DROP TABLE IF EXISTS ads CASCADE;
-- DROP TABLE IF EXISTS companies CASCADE;

-- =====================================================
-- 2. CREATE TABLES
-- =====================================================

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ads table
CREATE TABLE IF NOT EXISTS ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    location TEXT,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompts table (remixes/edits)
CREATE TABLE IF NOT EXISTS prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Can be UUID or browser-generated ID
    content TEXT NOT NULL,
    parent_id UUID REFERENCES prompts(id) ON DELETE CASCADE, -- For threaded replies
    edited_image_url TEXT,
    edited_video_url TEXT,
    likes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'flagged', 'removed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Companies indexes
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at DESC);

-- Ads indexes
CREATE INDEX IF NOT EXISTS idx_ads_company_id ON ads(company_id);
CREATE INDEX IF NOT EXISTS idx_ads_created_at ON ads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ads_status ON ads(status);
CREATE INDEX IF NOT EXISTS idx_ads_likes ON ads(likes DESC);

-- Prompts indexes
CREATE INDEX IF NOT EXISTS idx_prompts_ad_id ON prompts(ad_id);
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_parent_id ON prompts(parent_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CREATE RLS POLICIES (Allow public read access)
-- =====================================================

-- Companies policies
DROP POLICY IF EXISTS "Allow public read access to companies" ON companies;
CREATE POLICY "Allow public read access to companies" ON companies
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to companies" ON companies;
CREATE POLICY "Allow public insert to companies" ON companies
    FOR INSERT WITH CHECK (true);

-- Ads policies
DROP POLICY IF EXISTS "Allow public read access to ads" ON ads;
CREATE POLICY "Allow public read access to ads" ON ads
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to ads" ON ads;
CREATE POLICY "Allow public insert to ads" ON ads
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to ads" ON ads;
CREATE POLICY "Allow public update to ads" ON ads
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete to ads" ON ads;
CREATE POLICY "Allow public delete to ads" ON ads
    FOR DELETE USING (true);

-- Prompts policies
DROP POLICY IF EXISTS "Allow public read access to prompts" ON prompts;
CREATE POLICY "Allow public read access to prompts" ON prompts
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to prompts" ON prompts;
CREATE POLICY "Allow public insert to prompts" ON prompts
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to prompts" ON prompts;
CREATE POLICY "Allow public update to prompts" ON prompts
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete to prompts" ON prompts;
CREATE POLICY "Allow public delete to prompts" ON prompts
    FOR DELETE USING (true);

-- =====================================================
-- 6. CREATE UPDATED_AT TRIGGER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ads_updated_at ON ads;
CREATE TRIGGER update_ads_updated_at
    BEFORE UPDATE ON ads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_prompts_updated_at ON prompts;
CREATE TRIGGER update_prompts_updated_at
    BEFORE UPDATE ON prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. SEED DATA - COMPANIES
-- =====================================================

INSERT INTO companies (id, name, description, website, created_at)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Nike', 'Global leader in athletic footwear and apparel', 'https://www.nike.com', NOW() - INTERVAL '30 days'),
    ('550e8400-e29b-41d4-a716-446655440001', 'Adidas', 'International sportswear and equipment brand', 'https://www.adidas.com', NOW() - INTERVAL '25 days'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Coca-Cola', 'Leading beverage company', 'https://www.coca-cola.com', NOW() - INTERVAL '20 days'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Apple', 'Technology innovation leader', 'https://www.apple.com', NOW() - INTERVAL '15 days'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Tesla', 'Electric vehicles and clean energy', 'https://www.tesla.com', NOW() - INTERVAL '22 days'),
    ('550e8400-e29b-41d4-a716-446655440006', 'McDonalds', 'Global fast food restaurant chain', 'https://www.mcdonalds.com', NOW() - INTERVAL '18 days'),
    ('550e8400-e29b-41d4-a716-446655440007', 'Pepsi', 'Beverage and food company', 'https://www.pepsi.com', NOW() - INTERVAL '16 days'),
    ('550e8400-e29b-41d4-a716-446655440008', 'Spotify', 'Music streaming platform', 'https://www.spotify.com', NOW() - INTERVAL '12 days'),
    ('550e8400-e29b-41d4-a716-446655440009', 'Amazon', 'E-commerce and cloud computing', 'https://www.amazon.com', NOW() - INTERVAL '8 days')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 8. SEED DATA - ADS
-- =====================================================

-- Nike Ads (using existing images)
INSERT INTO ads (id, company_id, title, description, image_url, location, likes, views, created_at)
VALUES 
    ('110e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Just Do It Campaign', 'Iconic Nike campaign featuring athletes pushing their limits', '/nike-athletic-shoe-advertisement.jpg', 'New York', 1234, 45678, NOW() - INTERVAL '5 days'),
    ('110e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Air Max Collection', 'Latest Air Max sneaker collection with revolutionary cushioning', '/nike-athletic-shoe-ad.jpg', 'Los Angeles', 987, 23456, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- Adidas Ads (using existing images)
INSERT INTO ads (id, company_id, title, description, image_url, location, likes, views, created_at)
VALUES 
    ('110e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Impossible is Nothing', 'Empowering athletes worldwide', '/adidas-sportswear-advertisement.jpg', 'Berlin', 890, 15678, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

-- Coca-Cola Ads (using existing Super Bowl ad)
INSERT INTO ads (id, company_id, title, description, image_url, location, likes, views, created_at)
VALUES 
    ('110e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Share a Coke', 'Personalized bottles bringing people together', '/coca-cola-super-bowl-ad.jpg', 'Atlanta', 2345, 67890, NOW() - INTERVAL '6 days'),
    ('110e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Taste the Feeling', 'Experience refreshment like never before', '/coca-cola-super-bowl-commercial.jpg', 'Miami', 1876, 34567, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

-- Apple Ads (using existing images)
INSERT INTO ads (id, company_id, title, description, image_url, location, likes, views, created_at)
VALUES 
    ('110e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Think Different', 'Innovation that changes everything', '/apple-iphone-product-ad.jpg', 'San Francisco', 3456, 89012, NOW() - INTERVAL '8 days'),
    ('110e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'iPhone 16 Pro', 'The most powerful iPhone ever', '/apple-iphone-product-advertisement.jpg', 'Cupertino', 4567, 123456, NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- Tesla Ads (using existing images)
INSERT INTO ads (id, company_id, title, description, image_url, location, likes, views, created_at)
VALUES 
    ('110e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440005', 'Model S Revolution', 'The future of electric vehicles is here', '/tesla-electric-car-advertisement.jpg', 'Austin', 3210, 78900, NOW() - INTERVAL '4 days'),
    ('110e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440005', 'Cybertruck Launch', 'Built for the toughest challenges', '/tesla-electric-car-ad.jpg', 'Los Angeles', 2890, 65432, NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- McDonalds Ads
INSERT INTO ads (id, company_id, title, description, image_url, location, likes, views, created_at)
VALUES 
    ('110e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440006', 'Im Lovin It', 'Fresh ingredients, bold flavors', '/mcdonalds-burger-advertisement.jpg', 'Chicago', 2567, 54321, NOW() - INTERVAL '6 days'),
    ('110e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440006', 'Big Mac Classic', 'The iconic burger everyone loves', '/mcdonalds-burger-ad.jpg', 'New York', 1987, 43210, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- Pepsi Ads
INSERT INTO ads (id, company_id, title, description, image_url, location, likes, views, created_at)
VALUES 
    ('110e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440007', 'Super Bowl Halftime', 'The biggest show on earth', '/pepsi-super-bowl-halftime-show-ad.jpg', 'Phoenix', 4321, 98765, NOW() - INTERVAL '8 days')
ON CONFLICT (id) DO NOTHING;

-- Spotify Ads
INSERT INTO ads (id, company_id, title, description, image_url, location, likes, views, created_at)
VALUES 
    ('110e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440008', 'Music for Everyone', 'Stream millions of songs and podcasts', '/spotify-music-streaming-advertisement.jpg', 'Stockholm', 1765, 34567, NOW() - INTERVAL '5 days'),
    ('110e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440008', 'Premium Experience', 'Ad-free music, offline listening', '/spotify-music-streaming-ad.jpg', 'San Francisco', 1543, 29876, NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Amazon Ads
INSERT INTO ads (id, company_id, title, description, image_url, location, likes, views, created_at)
VALUES 
    ('110e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440009', 'Prime Delivery', 'Fast, free delivery on millions of items', '/amazon-prime-delivery-advertisement.jpg', 'Seattle', 2109, 47890, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 9. SEED DATA - PROMPTS (Remixes)
-- =====================================================

-- Prompts for Nike Ad 1 (Just Do It)
INSERT INTO prompts (id, ad_id, user_id, content, edited_image_url, likes, created_at, parent_id)
VALUES 
    ('220e8400-e29b-41d4-a716-446655440001', '110e8400-e29b-41d4-a716-446655440001', '330e8400-e29b-41d4-a716-446655440001', 'Make the shoes glow with neon colors', '/remixed-advertisement.jpg', 45, NOW() - INTERVAL '4 days', NULL),
    ('220e8400-e29b-41d4-a716-446655440002', '110e8400-e29b-41d4-a716-446655440001', '330e8400-e29b-41d4-a716-446655440002', 'Add lightning bolts around the shoes', '/remixed-advertisement.jpg', 67, NOW() - INTERVAL '3 days', NULL),
    ('220e8400-e29b-41d4-a716-446655440003', '110e8400-e29b-41d4-a716-446655440001', '330e8400-e29b-41d4-a716-446655440003', 'Change the shoes to gold metallic', '/remixed-advertisement.jpg', 34, NOW() - INTERVAL '2 days', NULL),
    -- Threaded replies to first prompt
    ('220e8400-e29b-41d4-a716-446655440004', '110e8400-e29b-41d4-a716-446655440001', '330e8400-e29b-41d4-a716-446655440004', 'Make the background a futuristic city', '/remixed-advertisement.jpg', 23, NOW() - INTERVAL '3 days', '220e8400-e29b-41d4-a716-446655440001'),
    ('220e8400-e29b-41d4-a716-446655440005', '110e8400-e29b-41d4-a716-446655440001', '330e8400-e29b-41d4-a716-446655440005', 'Add flying cars in the background', '/remixed-advertisement.jpg', 19, NOW() - INTERVAL '2 days', '220e8400-e29b-41d4-a716-446655440001'),
    -- Reply to second prompt
    ('220e8400-e29b-41d4-a716-446655440006', '110e8400-e29b-41d4-a716-446655440001', '330e8400-e29b-41d4-a716-446655440006', 'Turn this into a vintage 80s aesthetic', '/remixed-advertisement.jpg', 56, NOW() - INTERVAL '1 day', '220e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Prompts for Nike Ad 2 (Air Max)
INSERT INTO prompts (id, ad_id, user_id, content, edited_image_url, likes, created_at, parent_id)
VALUES 
    ('220e8400-e29b-41d4-a716-446655440007', '110e8400-e29b-41d4-a716-446655440002', '330e8400-e29b-41d4-a716-446655440007', 'Add holographic effects to the shoes', '/remixed-advertisement.jpg', 78, NOW() - INTERVAL '2 days', NULL),
    ('220e8400-e29b-41d4-a716-446655440008', '110e8400-e29b-41d4-a716-446655440002', '330e8400-e29b-41d4-a716-446655440008', 'Transform into cyberpunk style', '/remixed-advertisement.jpg', 89, NOW() - INTERVAL '1 day', NULL),
    ('220e8400-e29b-41d4-a716-446655440009', '110e8400-e29b-41d4-a716-446655440002', '330e8400-e29b-41d4-a716-446655440009', 'Add neon grid pattern', '/remixed-advertisement.jpg', 43, NOW() - INTERVAL '12 hours', '220e8400-e29b-41d4-a716-446655440007')
ON CONFLICT (id) DO NOTHING;

-- Prompts for Adidas Ad
INSERT INTO prompts (id, ad_id, user_id, content, edited_image_url, likes, created_at, parent_id)
VALUES 
    ('220e8400-e29b-41d4-a716-446655440010', '110e8400-e29b-41d4-a716-446655440004', '330e8400-e29b-41d4-a716-446655440010', 'Make the athlete float in mid-air', '/remixed-advertisement.jpg', 92, NOW() - INTERVAL '3 days', NULL),
    ('220e8400-e29b-41d4-a716-446655440011', '110e8400-e29b-41d4-a716-446655440004', '330e8400-e29b-41d4-a716-446655440011', 'Add wings to the shoes', '/remixed-advertisement.jpg', 67, NOW() - INTERVAL '2 days', NULL)
ON CONFLICT (id) DO NOTHING;

-- Prompts for Apple Ads
INSERT INTO prompts (id, ad_id, user_id, content, edited_image_url, likes, created_at, parent_id)
VALUES 
    ('220e8400-e29b-41d4-a716-446655440012', '110e8400-e29b-41d4-a716-446655440009', '330e8400-e29b-41d4-a716-446655440012', 'Make the phone glow with aurora effects', '/remixed-advertisement.jpg', 156, NOW() - INTERVAL '1 day', NULL),
    ('220e8400-e29b-41d4-a716-446655440013', '110e8400-e29b-41d4-a716-446655440009', '330e8400-e29b-41d4-a716-446655440013', 'Add holographic display projecting from phone', '/remixed-advertisement.jpg', 134, NOW() - INTERVAL '18 hours', NULL)
ON CONFLICT (id) DO NOTHING;

-- Prompts for Tesla Ads
INSERT INTO prompts (id, ad_id, user_id, content, edited_image_url, likes, created_at, parent_id)
VALUES 
    ('220e8400-e29b-41d4-a716-446655440014', '110e8400-e29b-41d4-a716-446655440010', '330e8400-e29b-41d4-a716-446655440014', 'Add electric lightning effects', '/remixed-advertisement.jpg', 87, NOW() - INTERVAL '3 days', NULL),
    ('220e8400-e29b-41d4-a716-446655440015', '110e8400-e29b-41d4-a716-446655440010', '330e8400-e29b-41d4-a716-446655440015', 'Transform to futuristic cyberpunk scene', '/remixed-advertisement.jpg', 103, NOW() - INTERVAL '2 days', NULL)
ON CONFLICT (id) DO NOTHING;

-- Prompts for McDonalds Ads
INSERT INTO prompts (id, ad_id, user_id, content, edited_image_url, likes, created_at, parent_id)
VALUES 
    ('220e8400-e29b-41d4-a716-446655440016', '110e8400-e29b-41d4-a716-446655440012', '330e8400-e29b-41d4-a716-446655440016', 'Make the burger ingredients float', '/remixed-advertisement.jpg', 65, NOW() - INTERVAL '5 days', NULL),
    ('220e8400-e29b-41d4-a716-446655440017', '110e8400-e29b-41d4-a716-446655440012', '330e8400-e29b-41d4-a716-446655440017', 'Add golden sparkles around the food', '/remixed-advertisement.jpg', 72, NOW() - INTERVAL '4 days', NULL)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 10. USEFUL VIEWS (OPTIONAL)
-- =====================================================

-- View to see ads with their company info and remix count
CREATE OR REPLACE VIEW ads_with_stats AS
SELECT 
    a.id,
    a.title,
    a.description,
    a.image_url,
    a.video_url,
    a.location,
    a.likes,
    a.views,
    a.status,
    a.created_at,
    c.name as company_name,
    c.website as company_website,
    COUNT(DISTINCT p.id) as remix_count,
    COUNT(DISTINCT CASE WHEN p.parent_id IS NULL THEN p.id END) as root_remix_count
FROM ads a
JOIN companies c ON a.company_id = c.id
LEFT JOIN prompts p ON a.id = p.ad_id
GROUP BY a.id, c.name, c.website
ORDER BY a.created_at DESC;

-- View to see prompts with threading information
CREATE OR REPLACE VIEW prompts_with_threads AS
SELECT 
    p.id,
    p.ad_id,
    p.user_id,
    p.content,
    p.edited_image_url,
    p.edited_video_url,
    p.likes,
    p.created_at,
    p.parent_id,
    a.title as ad_title,
    c.name as company_name,
    COUNT(replies.id) as reply_count
FROM prompts p
JOIN ads a ON p.ad_id = a.id
JOIN companies c ON a.company_id = c.id
LEFT JOIN prompts replies ON replies.parent_id = p.id
GROUP BY p.id, a.title, c.name
ORDER BY p.created_at DESC;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your database is now ready with:
-- ✓ Complete schema with all tables
-- ✓ Indexes for performance
-- ✓ RLS policies for security
-- ✓ Automatic updated_at triggers
-- ✓ Sample data from multiple brands
-- ✓ Threaded prompts/remixes
-- ✓ Useful views for analytics
-- 
-- Next steps:
-- 1. Create a storage bucket named 'ads' in Supabase Storage
-- 2. Set the bucket to public
-- 3. Configure your .env.local with Supabase credentials
-- 4. Run your Next.js application with: pnpm dev
-- =====================================================
