# Delcom Courses - Praktikum 6 PABWE 2026 (SvelteKit)

Aplikasi **Delcom Courses** dibangun menggunakan **SvelteKit (Svelte 5)**, **TypeScript**, dan **Tailwind CSS** untuk Praktikum 6 Pemrograman Aplikasi Berbasis Web (PABWE) 2026.

**Pembuat**: Kifran Hutasoit (ifs24028)

## 🌐 Live URL & Deployment
- **Production URL**: [https://ifs24028-pabwe2026-sk-p6-sveltekit.vercel.app](https://ifs24028-pabwe2026-sk-p6-sveltekit.vercel.app)
- **Deployed on**: [Vercel](https://vercel.com/) (deploy otomatis setiap `git push` ke branch `main`)

## 🚀 Fitur Utama
1. **Autentikasi Pengguna & Sesi**:
   - Register akun baru
   - Login dengan token autentikasi Open API Delcom
   - Proteksi rute berbasis sesi dan `AuthSessionRedirect`
2. **Manajemen Kursus (Courses)**:
   - Tambah kursus baru (title & description)
   - Unggah dan ubah foto sampul kursus
   - Ubah informasi kursus dan hapus kursus
   - Pencarian kursus dan filter kepemilikan kursus ("Kursus Saya")
3. **Interaksi Peserta & Rating**:
   - Bergabung sebagai peserta kursus (daftar kursus)
   - Keluar dari kepesertaan kursus
   - Memberikan rating kursus pada skala 1 sampai 5
4. **Materi Kursus (Contents)**:
   - Tambah, edit, dan hapus materi pembelajaran kursus
   - Pemutar materi video YouTube berbasis tautan video
   - Pelacakan status belajar (sudah selesai / belum selesai)
5. **Kualitas & Pengujian Kode**:
   - **100% Test Coverage** (Statements, Branches, Functions, Lines) menggunakan Vitest dan `@testing-library/svelte`.

## 🛠️ Menjalankan Secara Lokal

### Prasyarat
- [Bun](https://bun.sh/) (disarankan) atau [Node.js](https://nodejs.org/) (v18+)

### Instalasi & Menjalankan
```bash
# 1. Install dependensi
bun install

# 2. Setup environment
cp .env.example .env

# 3. Jalankan mode pengembangan (port 3005)
bun run dev

# 4. Menjalankan pengujian coverage (100% coverage)
bun run test:coverage

# 5. Build dan pratinjau mode produksi
bun run build
bun run preview
```

## ☁️ Deployment ke Vercel

1. Push repositori `ifs24028-pabwe2026-sk-p6-sveltekit` ke GitHub.
2. Di dashboard Vercel, pilih **Add New → Project**, lalu impor repositori tersebut.
3. Framework Preset: **SvelteKit** (terdeteksi otomatis).
4. Di **Settings → Environment Variables**, isi variabel yang sama dengan `.env.example` (untuk environment **Production**).
5. Klik **Deploy**. Setiap `git push` ke branch `main` akan memicu deploy ulang secara otomatis.

> Catatan: Vercel memerlukan adapter `@sveltejs/adapter-vercel` (atau `@sveltejs/adapter-auto`) pada `svelte.config.js`.