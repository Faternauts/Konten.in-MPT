# Supabase Storage Setup

To ensure images render correctly, you need to make your Supabase storage bucket public:

## Steps:

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Find the `ads` bucket
4. Click on the bucket settings (three dots or gear icon)
5. Make sure the bucket is set to **Public**
6. Set the following policies:

### Storage Policies:

Go to **Storage** > **Policies** > **ads bucket** and ensure these policies exist:

#### Policy 1: Public Access (SELECT)
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'ads' );
```

#### Policy 2: Allow Uploads (INSERT)
```sql
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'ads' );
```

#### Policy 3: Allow Deletes (DELETE)
```sql
CREATE POLICY "Allow deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'ads' );
```

## Verify Setup:

After setting up the policies, try:
1. Upload a new file through your app
2. Copy the returned URL from the console
3. Paste it in a new browser tab - it should load the image
4. If it doesn't load, the bucket might not be public or policies are incorrect

## Alternative: Check via Supabase CLI

You can also check if the bucket exists:
```bash
# List all buckets
npx supabase storage ls

# Check if 'ads' bucket exists and is public
```

If the bucket doesn't exist, create it:
```sql
-- Run this in your Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('ads', 'ads', true);
```
