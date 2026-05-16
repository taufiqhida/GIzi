# Sobat Giziku — Product Requirements Document

## Original Problem Statement
Aplikasi full-stack "Sobat Giziku" untuk konsultasi gizi & kesehatan balita.
Role-based access (Admin / Dokter / Pasien), real-time chat konsultasi,
CRUD artikel kesehatan & resep MPASI, tracking data balita dengan KMS,
kurva pertumbuhan terhadap standar WHO, dan statistik per kelurahan.

User communicates in **Bahasa Indonesia**.

## Tech Stack
- Frontend: React, TailwindCSS, Shadcn UI, Recharts, react-router
- Backend: FastAPI, Motor (MongoDB async), WebSocket native, JWT auth
- DB: MongoDB

## Roles & Personas
- **Admin**: CRUD users, artikel, resep MPASI, lihat statistik
- **Dokter**: terima/tolak konsultasi, chat dengan pasien, lihat statistik
- **Pasien (orang tua)**: input data balita, lihat kurva pertumbuhan,
  request konsultasi, chat dengan dokter, lihat statistik kelurahan

## Implemented Features (Changelog)

### 2026-02 — Growth Curve & Statistik Kelurahan (CURRENT)
- Backend: `DataBalita.riwayat` array (Pengukuran objects), endpoints:
  - `POST /api/pasien/balita/{id}/riwayat` add pengukuran
  - `GET  /api/pasien/balita/{id}/riwayat` riwayat
  - `DELETE /api/pasien/balita/{id}/riwayat/{index}` (recomputes current fields)
  - `PUT  /api/pasien/balita/{id}` update data balita (recalculate usia & status_kms)
  - `DELETE /api/pasien/balita/{id}` hapus balita
  - `GET  /api/statistik/kelurahan` public aggregation
- Frontend: `GrowthCurveModal` (LineChart BB & TB vs WHO -2SD/median/+2SD,
  form input pengukuran manual, tabel riwayat, edit data anak),
  `StatistikKelurahan` (BarChart stacked, PieChart komposisi, tabel rincian),
  halaman public `/statistik`, tab statistik di Pasien/Admin Dashboard,
  bagian compact statistik di Dokter Dashboard.
- WHO Growth Standards (0-60 bulan) embedded di `/app/frontend/src/data/whoStandards.js`
- Code quality fixes: XSS innerHTML → state-based fallback (Artikel.jsx),
  useCallback hook deps di AuthContext/ChatWindow/3 dashboards/MPASI/Artikel/ArtikelDetail,
  unique keys di list rendering komponen baru.

### Earlier Sessions
- JWT Auth (login/register, 3 roles), Admin CRUD artikel & resep, mobile-responsive UI.
- Real-time WebSocket Chat dokter-pasien (with REST + polling fallback).
- Public pages: Artikel, ArtikelDetail, MPASI, Konsultasi, StatusGizi, Agenda, Informasi, EData.
- Doctor accept/reject konsultasi, Pasien request konsultasi flow.
- KMS classification (Gizi Baik / Gizi Kurang / BGM) for balita.

## Key API Endpoints
- Auth: `POST /api/auth/login|register`, `GET /api/auth/me`
- Public: `GET /api/artikel/public`, `GET /api/resep/public`, `GET /api/dokter/public`,
  `GET /api/statistik/kelurahan`
- Admin: `/api/admin/users`, `/api/admin/artikel`, `/api/admin/resep` (CRUD)
- Pasien: `/api/pasien/balita` (CRUD), `/api/pasien/balita/{id}/riwayat` (CRUD),
  `/api/pasien/konsultasi`
- Dokter: `/api/dokter/konsultasi` (list, accept, reject)
- Chat: `POST/GET /api/chat/{konsultasi_id}`, WS `/ws/chat/{konsultasi_id}?token=...`

## Data Models (MongoDB collections)
- `users` — User (id, email, nama, role, password hash, spesialisasi, dll)
- `data_balita` — DataBalita (with `riwayat: [Pengukuran]`)
- `konsultasi` — Konsultasi (pasien_id, dokter_id, balita_id, status, keluhan)
- `chat_messages` — ChatMessage (konsultasi_id, sender, message, ts)
- `artikel` — Artikel (slug, title, content, image, category, author)
- `resep` — ResepMPASI (kategori, nama, gambar, bahan, cara, tips)

## Test Credentials
File: `/app/memory/test_credentials.md`
- Admin: superadmin@sobatgizi.com / admin123
- Dokter: dokter@sobatgizi.com / dokter123
- Pasien: pasien@sobatgizi.com / pasien123

## Roadmap / Backlog

### P1
- Export riwayat konsultasi & growth curve ke PDF (per anak)
- Notifikasi (push/email) saat dokter menerima konsultasi
- Backend WHO LMS-based status_kms (align with frontend WHO standards)

### P2
- Refactor `server.py` (sekarang 656 lines) → modular routers (auth/admin/pasien/dokter/public)
- Refactor AdminDashboard.jsx (528 lines, complexity 46) → sub-komponen per tab
- Refactor GrowthCurveModal.jsx → split chart/form/edit menjadi 3 komponen
- Httponly-cookie based auth (gantikan localStorage JWT)
- WebSocket: role/ownership check di subscribe

### Future
- Dokter dapat tambah catatan medis ke profil balita
- Reminder jadwal posyandu (kalender)
- Bahasa daerah / multi-language

## Known Issues
- `_calc_status_kms` di backend pakai approximation linear, bukan WHO LMS sesungguhnya
- WS subscribe tidak verify ownership per konsultasi_id (any valid token can join)
- Beberapa halaman lama masih pakai array index key (Home, Konsultasi, StatusGizi, dll)

## Testing Status
- Latest: `/app/test_reports/iteration_1.json` — 100% backend, 100% frontend
- Pytest suite: `/app/backend/tests/test_growth_statistik.py`
