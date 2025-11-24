-- Updated Schema with parent_id and video support
-- Run this FIRST in your Supabase SQL Editor

-- Update prompts table to add parent_id column and edited image URL
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES prompts(id);
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS edited_image_url text;

-- Update ads table to support video URL
ALTER TABLE ads ADD COLUMN IF NOT EXISTS video_url text;

-- Mock Data for Nike Company Testing
-- Run this AFTER the schema updates above

-- Insert Nike company
INSERT INTO companies (id, name, created_at)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Nike', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Nike ads
INSERT INTO ads (id, company_id, title, image_url, created_at)
VALUES 
  ('110e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Just Do It Campaign', '/nike-athletic-shoe-advertisement.jpg', NOW() - INTERVAL '5 days'),
  ('110e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Air Max Collection', '/nike-athletic-shoe-ad.jpg', NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- Insert prompts for first Nike ad
INSERT INTO prompts (id, ad_id, user_id, content, created_at, parent_id, edited_image_url)
VALUES 
  ('220e8400-e29b-41d4-a716-446655440001', '110e8400-e29b-41d4-a716-446655440001', '330e8400-e29b-41d4-a716-446655440001', 'Make the shoes glow with neon colors', NOW() - INTERVAL '4 days', NULL, '/remixed-advertisement.jpg'),
  ('220e8400-e29b-41d4-a716-446655440002', '110e8400-e29b-41d4-a716-446655440001', '330e8400-e29b-41d4-a716-446655440002', 'Add lightning bolts around the shoes', NOW() - INTERVAL '3 days', NULL, '/remixed-advertisement.jpg'),
  ('220e8400-e29b-41d4-a716-446655440003', '110e8400-e29b-41d4-a716-446655440001', '330e8400-e29b-41d4-a716-446655440003', 'Change the shoes to gold metallic', NOW() - INTERVAL '2 days', NULL, '/remixed-advertisement.jpg'),
  ('220e8400-e29b-41d4-a716-446655440004', '110e8400-e29b-41d4-a716-446655440001', '330e8400-e29b-41d4-a716-446655440004', 'Make the background a futuristic city', NOW() - INTERVAL '3 days', '220e8400-e29b-41d4-a716-446655440001', '/remixed-advertisement.jpg'),
  ('220e8400-e29b-41d4-a716-446655440005', '110e8400-e29b-41d4-a716-446655440001', '330e8400-e29b-41d4-a716-446655440005', 'Add flying cars in the background', NOW() - INTERVAL '2 days', '220e8400-e29b-41d4-a716-446655440001', '/remixed-advertisement.jpg'),
  ('220e8400-e29b-41d4-a716-446655440006', '110e8400-e29b-41d4-a716-446655440001', '330e8400-e29b-41d4-a716-446655440006', 'Turn this into a vintage 80s aesthetic', NOW() - INTERVAL '1 day', '220e8400-e29b-41d4-a716-446655440002', '/remixed-advertisement.jpg')
ON CONFLICT (id) DO NOTHING;

-- Insert prompts for second Nike ad
INSERT INTO prompts (id, ad_id, user_id, content, created_at, parent_id, edited_image_url)
VALUES 
  ('220e8400-e29b-41d4-a716-446655440007', '110e8400-e29b-41d4-a716-446655440002', '330e8400-e29b-41d4-a716-446655440007', 'Add holographic effects to the shoes', NOW() - INTERVAL '2 days', NULL, '/remixed-advertisement.jpg'),
  ('220e8400-e29b-41d4-a716-446655440008', '110e8400-e29b-41d4-a716-446655440002', '330e8400-e29b-41d4-a716-446655440008', 'Transform into cyberpunk style', NOW() - INTERVAL '1 day', NULL, '/remixed-advertisement.jpg'),
  ('220e8400-e29b-41d4-a716-446655440009', '110e8400-e29b-41d4-a716-446655440002', '330e8400-e29b-41d4-a716-446655440009', 'Add neon grid pattern', NOW() - INTERVAL '12 hours', '220e8400-e29b-41d4-a716-446655440007', '/remixed-advertisement.jpg')
ON CONFLICT (id) DO NOTHING;
