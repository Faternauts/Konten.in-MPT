# Daftar Prompts untuk Generate Gambar Remix

Berikut adalah daftar lengkap semua prompts/comments yang perlu dibuatkan gambarnya.
Setiap prompt ini adalah instruksi untuk AI image generator (DALL-E, Midjourney, Stable Diffusion, dll).

## Format untuk AI Image Generator:

Untuk setiap prompt, gunakan format:
`[Base Image Description] + [Prompt Modification]`

Contoh: "Nike athletic shoe advertisement" + "Make the shoes glow with neon colors"

---

## NIKE - Just Do It Campaign

**Base Image**: Nike athletic shoe advertisement, Just Do It campaign

### Prompt 1: Make the shoes glow with neon colors

**AI Prompt**: "Professional Nike athletic shoe advertisement, shoes glowing with vibrant neon colors (pink, cyan, electric blue), dramatic lighting, commercial photography style, high quality, 8k"

### Prompt 2: Add lightning bolts around the shoes

**AI Prompt**: "Nike athletic shoe advertisement with electric lightning bolts surrounding the shoes, energy effects, dramatic storm atmosphere, commercial photography, cinematic lighting, high quality, 8k"

### Prompt 3: Change the shoes to gold metallic

**AI Prompt**: "Nike athletic shoe advertisement with shoes in metallic gold finish, luxurious feel, premium product photography, reflective surfaces, commercial style, high quality, 8k"

### Prompt 4: Make the background a futuristic city

**AI Prompt**: "Nike athletic shoes with glowing neon colors against a futuristic city skyline, sci-fi cyberpunk atmosphere, neon lights, flying vehicles in background, cinematic composition, 8k"

### Prompt 5: Add flying cars in the background

**AI Prompt**: "Nike athletic shoes with neon glow in futuristic city with flying cars in the background, sci-fi setting, advanced technology, cinematic lighting, commercial photography, 8k"

### Prompt 6: Turn this into a vintage 80s aesthetic

**AI Prompt**: "Nike athletic shoes with lightning bolts, 80s retro aesthetic, VHS filter, neon pink and cyan colors, vintage photography style, synthwave vibe, retro-futuristic, 8k"

---

## NIKE - Air Max Collection

**Base Image**: Nike Air Max sneaker collection advertisement

### Prompt 7: Add holographic effects to the shoes

**AI Prompt**: "Nike Air Max sneakers with holographic iridescent effects, rainbow color shifts, futuristic tech aesthetic, premium product photography, clean background, commercial style, 8k"

### Prompt 8: Transform into cyberpunk style

**AI Prompt**: "Nike Air Max sneakers in cyberpunk style, neon lights, dark urban environment, rain-soaked streets, purple and cyan color scheme, futuristic aesthetic, cinematic lighting, 8k"

### Prompt 9: Add neon grid pattern

**AI Prompt**: "Nike Air Max sneakers with cyberpunk aesthetic and glowing neon grid pattern overlay, Tron-style, electric blue and pink neon lines, futuristic tech vibe, 8k"

---

## ADIDAS - Impossible is Nothing

**Base Image**: Adidas sportswear advertisement with athlete

### Prompt 10: Make the athlete float in mid-air

**AI Prompt**: "Adidas sportswear advertisement with athlete floating/levitating in mid-air, anti-gravity effect, dramatic pose, commercial photography, inspiring atmosphere, high quality, 8k"

### Prompt 11: Add wings to the shoes

**AI Prompt**: "Adidas sportswear advertisement with athletic shoes that have wings attached, flying/soaring concept, dynamic movement, inspirational commercial photography, dramatic lighting, 8k"

---

## APPLE - iPhone 16 Pro

**Base Image**: Apple iPhone 16 Pro product advertisement

### Prompt 12: Make the phone glow with aurora effects

**AI Prompt**: "Apple iPhone 16 Pro product shot with aurora borealis light effects glowing around it, magical atmosphere, northern lights colors (green, purple, blue), premium product photography, clean background, 8k"

### Prompt 13: Add holographic display projecting from phone

**AI Prompt**: "Apple iPhone 16 Pro with holographic 3D display projecting upward from screen, futuristic interface, glowing UI elements, sci-fi technology, premium product photography, clean aesthetic, 8k"

---

## TESLA - Model S Revolution

**Base Image**: Tesla Model S electric car advertisement

### Prompt 14: Add electric lightning effects

**AI Prompt**: "Tesla Model S electric car with electric lightning bolts and energy effects surrounding it, power and electricity theme, dramatic atmosphere, commercial automotive photography, cinematic lighting, 8k"

### Prompt 15: Transform to futuristic cyberpunk scene

**AI Prompt**: "Tesla Model S in futuristic cyberpunk city scene, neon lights reflecting on car surface, rain-soaked streets, purple and cyan color palette, blade runner aesthetic, cinematic automotive photography, 8k"

---

## MCDONALDS - I'm Lovin' It

**Base Image**: McDonald's burger advertisement

### Prompt 16: Make the burger ingredients float

**AI Prompt**: "McDonald's burger with all ingredients (bun, patty, lettuce, cheese, tomato) floating/exploding apart in mid-air, deconstructed food photography, professional commercial style, white background, high quality, 8k"

### Prompt 17: Add golden sparkles around the food

**AI Prompt**: "McDonald's burger with magical golden sparkles and glitter particles surrounding it, premium feel, luxury food photography, warm lighting, commercial advertising style, appetizing presentation, 8k"

---

## RINGKASAN FILE OUTPUT

Untuk setiap prompt di atas, generate gambar dan simpan dengan nama:

- `/remixed-nike-neon-shoes.jpg` (Prompt 1)
- `/remixed-nike-lightning.jpg` (Prompt 2)
- `/remixed-nike-gold.jpg` (Prompt 3)
- `/remixed-nike-future-city.jpg` (Prompt 4)
- `/remixed-nike-flying-cars.jpg` (Prompt 5)
- `/remixed-nike-80s.jpg` (Prompt 6)
- `/remixed-nike-holographic.jpg` (Prompt 7)
- `/remixed-nike-cyberpunk.jpg` (Prompt 8)
- `/remixed-nike-neon-grid.jpg` (Prompt 9)
- `/remixed-adidas-float.jpg` (Prompt 10)
- `/remixed-adidas-wings.jpg` (Prompt 11)
- `/remixed-iphone-aurora.jpg` (Prompt 12)
- `/remixed-iphone-hologram.jpg` (Prompt 13)
- `/remixed-tesla-lightning.jpg` (Prompt 14)
- `/remixed-tesla-cyberpunk.jpg` (Prompt 15)
- `/remixed-mcdonalds-float.jpg` (Prompt 16)
- `/remixed-mcdonalds-sparkles.jpg` (Prompt 17)

---

## CARA GENERATE GAMBAR

### Option 1: Menggunakan DALL-E 3 (ChatGPT Plus)

1. Buka ChatGPT dengan GPT-4 + DALL-E 3
2. Copy paste prompt di atas satu per satu
3. Download gambar hasil generate
4. Rename sesuai dengan nama file di atas
5. Simpan ke `frontend/public/` folder

### Option 2: Menggunakan Midjourney

1. Join Midjourney Discord
2. Gunakan command `/imagine` dengan prompt di atas
3. Tambahkan parameter: `--ar 1:1 --v 6 --style raw` untuk hasil optimal
4. Download dan simpan ke `frontend/public/`

### Option 3: Menggunakan Stable Diffusion (Gratis)

1. Install Stable Diffusion WebUI atau gunakan online (Hugging Face Spaces)
2. Gunakan model: SDXL atau Realistic Vision
3. Paste prompt di atas
4. Settings: Steps: 30, CFG Scale: 7, Size: 1024x1024
5. Generate dan download

### Option 4: Leonardo.ai (Recommended - Free Tier Available)

1. Daftar di https://leonardo.ai
2. Gunakan preset "Leonardo Diffusion XL"
3. Paste prompt
4. Generate dan download
5. Free tier: 150 credits/day (~30 images)

### Option 5: Playground AI (Free Alternative)

https://playgroundai.com - Free dengan unlimited generations

---

## SETELAH GENERATE GAMBAR

Setelah semua gambar di-generate dan disimpan di `frontend/public/`, update SQL:

```sql
-- Update prompts dengan gambar baru
UPDATE prompts SET edited_image_url = '/remixed-nike-neon-shoes.jpg'
WHERE id = '220e8400-e29b-41d4-a716-446655440001';

UPDATE prompts SET edited_image_url = '/remixed-nike-lightning.jpg'
WHERE id = '220e8400-e29b-41d4-a716-446655440002';

-- ... dst untuk semua prompts
```

Atau jalankan SQL baru dengan path gambar yang sudah benar.
