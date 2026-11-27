# PROMOVA AI — V2.4.1

## V2.4.1 — Movie Poster Promo Video Director 2.1
- Fixed copy-button event collision by using dedicated Movie Promo copy controls.
- Changed the video workflow to generate presenter/background footage only; official logos, movie posters, dates, showtimes and CTA are intended as exact overlays in the video editor.
- Added fixed camera, fixed cinema-lobby set, stable presenter placement, repeated wardrobe and lighting continuity, and a clearer dance/presentation choreography.
- Removed temporary clothing notes from the permanent identity instructions where detected.
- External AI tools may still vary duration and visual consistency; trim and align generated clips in the editor.

# PROMOVA AI — V2.4.0

## V2.4.0 — Movie Poster Promo Video Director 2.0
- Generates a separate, detailed video-generation prompt for the opening, every individual movie poster showcase, and closing.
- Adds timed action beats, presenter identity and wardrobe lock, poster reference lock, camera/composition direction, lighting/color continuity, transitions, audio guidance, and negative constraints.
- Requires a poster image for every movie entry and a company logo before generating the production pack.
- Allocates clip durations so opening + all poster showcases + closing equal the selected total duration; warns when the selected duration cannot fit all posters.
- Keeps exact film schedule and CTA as editor overlays to prevent video-model text errors.
- External AI video generation and final clip assembly remain manual.

# PROMOVA AI — V2.3.0

## V2.3.0 — Movie Poster Promo Studio
- New dedicated cinema advertising menu, separate from product affiliate workflows.
- Supports Character Library, uploaded presenter references, and company mascot references.
- Upload a company logo and multiple movie posters; add a film title, date, showtimes, and notes for each poster.
- Creates separate opening, poster-showcase, and closing video prompts for external AI services.
- Produces an exact schedule overlay plan for manual editing, avoiding reliance on AI video text rendering.
- Images are compressed in-browser and stored locally with the saved project; browser storage limits still apply.
- Video generation and final text/logo compositing remain manual in external AI/video editing tools.

# PROMOVA AI — V2.2.0

## V2.2.0 — Flexible Duration & Scene Count
- Custom total video duration: integer seconds from 8 to 300.
- Manually enter scene count from 1 to 100; single-scene videos are supported.
- Draft scenes divide the total duration across the selected scene count; durations remain editable in the scene editor.
- Adding or deleting scenes updates the scene-count field.

## V2.1.0 — Sequential First Frame Continuity
- First Frame Only: one opening reference image per scene; no required Last Frame.
- Flow-driven ending: the generator determines each scene ending from its prompt.
- Screenshot Handoff: capture a clear frame near the end of a generated scene and upload it as the next scene First Frame.
- First Frame images are stored locally with the project; upload limit is 8 MB per image.
- Video generation and screenshot capture remain manual in external tools; PROMOVA does not extract frames automatically.

## V2.0.0 — Hybrid AI Director 2.0
- Scene-by-scene video prompt mode: each storyboard scene receives its own standalone production prompt.
- Strict Continuity Lock for product identity, character DNA, wardrobe baseline, location, lighting direction, color grade, screen direction and physical action.
- Manual per-scene prompt approval is required before sending a scene to AI External Studio.
- Scene prompts and approval status are stored with the local project.
- Editing storyboard fields invalidates previous prompt approvals; edited prompts must be reviewed again.
- External image/video generation remains manual. Product and character reference images must be attached by the user.

## V1.12.0

## V1.12.0
- Hybrid AI Director: project-based advertising direction, editable scene storyboard, multi-character DNA continuity, external AI prompt workflow, JSON storyboard import, and scene-based video prompt preparation.
- Preserves the local-first workflow and manual approval for production assets. No AI API or backend is claimed; AI storyboard generation runs through the selected external service.


## V1.11.0
- Character Identity Lock with two visual references: Primary Master Character Sheet and Secondary Original Photo.
- Character Library stores both references separately and keeps the Master Sheet as the canonical identity source.
- First/Last Frame and Video prompts specify manual attachment and reference priority for both images.
- Existing characters remain compatible: their saved photo remains the Secondary Original Photo; Master Sheet can be added later.

AI Content Production Studio — external AI workflow, local-first PWA.

## V1.8.0
- First & Last Frame Planner: separate opening and closing still-image prompts for each saved production project.
- External image workflow: copy prompts, open an external image provider, and manually upload the generated first/last frames.
- Manual approval for both frame images is required before the video prompt can be prepared in the Production Pipeline.
- Approved frame images and approval states are stored with the local project and included in JSON backups.

## V1.7.1
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

Versi: 1.12.0
