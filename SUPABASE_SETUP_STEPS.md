# Panduan Setup Supabase untuk Konten.in MPT

## Langkah 1: Buka Supabase SQL Editor

1. Buka browser dan pergi ke: https://supabase.com/dashboard/project/rlmlsnpqlttrathqngzj
2. Di sidebar kiri, klik **SQL Editor**
3. Klik tombol **New Query** untuk membuat query baru

## Langkah 2: Jalankan SQL Schema

1. Buka file `supabase-test-data.sql` di root project
2. **Copy seluruh isi file** (Ctrl+A, Ctrl+C)
3. **Paste** ke SQL Editor di Supabase
4. Klik tombol **Run** atau tekan **Ctrl+Enter**

✅ Ini akan membuat:

- 3 tabel (companies, ads, prompts)
- Indexes untuk performa
- RLS policies untuk keamanan
- Triggers untuk auto-update timestamps
- Sample data dari 5 brands (Nike, Adidas, Coca-Cola, Apple, Samsung)
- 10 ads sample
- 17 prompts/remixes sample
- 2 views untuk analytics

⏱️ Proses ini biasanya selesai dalam 2-5 detik.

## Langkah 3: Verifikasi Tables

1. Di sidebar kiri, klik **Table Editor**
2. Anda seharusnya melihat 3 tabel:

   - ✅ **companies** - 5 rows
   - ✅ **ads** - 10 rows
   - ✅ **prompts** - 17 rows

3. Klik masing-masing tabel untuk melihat data sample

## Langkah 4: Setup Storage Bucket

1. Di sidebar kiri, klik **Storage**
2. Klik tombol **New bucket**
3. Isi form:
   - **Name**: `ads`
   - **Public bucket**: ✅ **Centang/Enable** (sangat penting!)
   - **File size limit**: 50 MB (default sudah OK)
   - **Allowed MIME types**: Biarkan kosong (allow all)
4. Klik **Create bucket**

### Buat Folder Structure (Opsional tapi direkomendasikan)

Setelah bucket `ads` dibuat, buat struktur folder:

1. Masuk ke bucket `ads`
2. Klik **Upload** > **Create folder**
3. Buat folder-folder ini:
   - `images/` - untuk upload gambar asli
   - `videos/` - untuk upload video asli
   - `edited/` - untuk hasil edit gambar (Gemini)
   - `edited-videos/` - untuk hasil video generation (Veo)

## Langkah 5: Verifikasi Storage Policy

1. Di halaman Storage, pilih bucket `ads`
2. Klik tab **Policies**
3. Pastikan ada policy untuk public access, jika belum ada, klik **New Policy**
4. Pilih template **Allow public read access**
5. Atau buat manual dengan SQL ini:

```sql
-- Allow public read access to ads bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'ads');

-- Allow authenticated insert
CREATE POLICY "Authenticated Insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'ads');

-- Allow authenticated update
CREATE POLICY "Authenticated Update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'ads');

-- Allow authenticated delete
CREATE POLICY "Authenticated Delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'ads');
```

## Langkah 6: Test Connection

Kembali ke aplikasi Next.js Anda yang sudah running di http://localhost:3000

1. **Refresh browser** (Ctrl+F5)
2. Anda seharusnya melihat data sample muncul
3. Test fitur:
   - ✅ Scroll feed untuk melihat ads
   - ✅ Klik "Remix" untuk test modal
   - ✅ Klik upload untuk test upload functionality

## Troubleshooting

### ❌ Error: "relation does not exist"

**Solusi**: SQL belum dijalankan atau gagal. Ulangi Langkah 2.

### ❌ Error: "bucket not found"

**Solusi**: Bucket `ads` belum dibuat. Ulangi Langkah 4.

### ❌ Error: "permission denied"

**Solusi**: RLS policies belum aktif atau bucket tidak public. Check Langkah 5.

### ❌ Error: "invalid API key"

**Solusi**: Check file `.env.local`, pastikan:

- `NEXT_PUBLIC_SUPABASE_URL` sudah benar
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah benar
- Restart dev server setelah update env

## Struktur Database Final

```
companies (5 rows)
├─ id (uuid, primary key)
├─ name (text)
├─ description (text)
├─ website (text)
├─ logo_url (text)
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

ads (10 rows)
├─ id (uuid, primary key)
├─ company_id (uuid, foreign key → companies.id)
├─ title (text)
├─ description (text)
├─ image_url (text)
├─ video_url (text)
├─ location (text)
├─ likes (integer, default 0)
├─ views (integer, default 0)
├─ status (text, default 'active')
├─ created_at (timestamptz)
└─ updated_at (timestamptz)

prompts (17 rows)
├─ id (uuid, primary key)
├─ ad_id (uuid, foreign key → ads.id)
├─ user_id (text)
├─ content (text)
├─ parent_id (uuid, nullable, foreign key → prompts.id)
├─ edited_image_url (text)
├─ edited_video_url (text)
├─ likes (integer, default 0)
├─ status (text, default 'active')
├─ created_at (timestamptz)
└─ updated_at (timestamptz)
```

## Storage Bucket Structure

```
ads/ (public bucket)
├─ images/          # User uploaded images
├─ videos/          # User uploaded videos
├─ edited/          # AI-edited images (Gemini)
└─ edited-videos/   # AI-generated videos (Veo)
```

## ✅ Checklist Setup

- [ ] SQL dijalankan di SQL Editor
- [ ] 3 tabel berhasil dibuat (companies, ads, prompts)
- [ ] Data sample terlihat di Table Editor
- [ ] Bucket `ads` sudah dibuat
- [ ] Bucket `ads` sudah **public**
- [ ] Folder structure sudah dibuat (opsional)
- [ ] Storage policies sudah aktif
- [ ] `.env.local` sudah benar
- [ ] Dev server sudah running
- [ ] Browser bisa load data dari Supabase

## Next Steps

Setelah setup selesai, Anda bisa:

1. **Upload Ad Baru**: Klik tombol Upload di homepage
2. **Test Remix**: Klik Remix pada ad yang ada
3. **Isi API Keys Lain**: Gemini, Claude, GCP, Letta di `.env.local`
4. **Deploy**: Setelah semua berfungsi lokal, ready untuk deploy!

---

🎉 **Setup Complete!**

Jika ada masalah, cek console browser (F12) dan terminal untuk error messages.
