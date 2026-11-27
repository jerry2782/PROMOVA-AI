# PROMOVA AI — V1.7.0

AI Content Production Studio — external AI workflow, local-first PWA.

## V1.7.0
- Production Pipeline with four tracked stages: brief, image, video, and publishing.
- External AI Studio launchpad for text, image, and video providers.
- Per-project stage completion saved locally in the browser.

## V1.6
- AI External Studio: load saved prompts, copy, and open external AI providers.

## V1.1
- Content production pack: brief, master prompt, image prompt, video prompt.
- Upload and preview product reference images from mobile gallery.
- Image compression in browser before preview.

## Fitur
- Content brief & AI prompt builder
- Product analysis framework
- Short video script prompt builder
- Image/video visual prompt builder
- Publishing kit
- Local project storage
- JSON backup and restore
- PWA service worker

## Menjalankan lokal
Buka `index.html` di browser untuk uji dasar. Untuk menguji instalasi PWA dan service worker, jalankan melalui localhost atau hosting HTTPS.

Contoh server lokal Python:
```bash
python -m http.server 8000
```
Lalu buka `http://localhost:8000`.

## Deploy ke GitHub Pages
1. Buat repository baru, misalnya `promova-ai`.
2. Upload seluruh isi folder ini ke root repository.
3. Buka Settings → Pages.
4. Pilih Deploy from a branch, branch `main`, folder `/root`.
5. Simpan dan tunggu proses publikasi.

## Penyimpanan dan privasi
Data proyek disimpan di localStorage browser pada perangkat ini. Export backup JSON secara berkala. Jangan memasukkan data sensitif.
Tidak ada backend, akun cloud, atau AI API key di MVP ini.

## AI
Aplikasi menyusun brief dan prompt untuk digunakan di layanan AI eksternal. Ia tidak menjalankan model AI secara langsung. Jangan menaruh API key rahasia di frontend publik.

## Batasan
- URL produk belum di-scrape otomatis.
- Tidak ada auto-posting.
- Tidak ada sinkronisasi cloud.
- Analisis hanya berdasarkan informasi yang dimasukkan pengguna.
- Verifikasi harga, klaim, hak cipta, tautan affiliate, dan disclosure tetap tanggung jawab pengguna.

Versi: 1.7.0
