# ⚡ KAIZORA SCHOLAR

[![Framework](https://img.shields.io/badge/Frontend-Vue%203%20%2B%20Vite-64B5F6?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-4CAF50?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-Supabase%20%2B%20PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![ORM](https://img.shields.io/badge/ORM-Drizzle%20ORM-C5F74C?style=flat-square&logo=drizzle)](https://orm.drizzle.team/)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini-34A853?style=flat-square&logo=google-gemini)](https://ai.google.dev/)

> **The Advanced Academic Bypass & Auto-Sync Engine for Universitas Terbuka Students.**

Kaizora Scholar is a high-agency, full-stack automation platform designed to simplify, synchronize, and draft academic tasks for Universitas Terbuka (UT) students. Utilizing a resilient Moodle crawler and powered by Google Gemini AI, Kaizora handles course synchronization, auto-attendance confirmation, and analytical answer drafting directly from official task PDFs.

---

## ✨ Key Features

- **🚀 One-Click Moodle Sync & Bypass**
  Log in securely to extract all your active courses, learning sessions (Session 1-8), learning resources, and assignments instantly.
  
- **🎯 Auto-Absensi (Attendance Confirmation)**
  Automatically bypasses and registers your attendance by identifying and interacting with active Moodle attendance links during synchronization.

- **🔮 AI Task Draft Generator (The Alchemist)**
  Generates highly structured, formal, and academically solid answers for discussions and assignments. It automatically injects your profile details (NIM, Name, Prodi) and **reads PDF task files** dynamically on-the-fly to ensure 100% contextual accuracy.

- **💎 Premium Glassmorphic UI/UX**
  A beautiful cosmic dark-mode interface built with Vue 3 and modern CSS styling to ensure a visually breathtaking dashboard experience.

- **🔒 Advanced Cryptographic Protection (OWASP)**
  Student credentials (NIM & Moodle Passwords) are encrypted locally in the database using **AES-256-GCM** keys to protect user data from breach.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Bundler**: Vite
- **Styling**: Tailwind CSS & Premium Glassmorphic Vanilla CSS
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Drizzle ORM
- **Crawler & Scraper**: Cheerio & Axios Client
- **AI Integration**: Google Generative AI SDK (Gemini Flash & Pro models)

---

## ⚙️ Installation & Local Setup

Follow these steps to set up Kaizora Scholar locally:

### Prerequisites
- Node.js (v18 or higher recommended)
- A Supabase account / PostgreSQL Database
- A Google Gemini API Key

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/kaizora-scholar.git
cd kaizora-scholar
```

---

### Step 2: Configure Backend Environment Variables
1. Go to the `backend` directory:
   ```bash
   cd backend
   ```
2. Duplicate `.env.example` and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in your configurations inside `.env`:
   - `PORT`: Set your preferred port (default is `3001`).
   - `APP_KEY`: Must be exactly 32 characters (e.g. `k41z0r4_sch0l4r_s3cur3_k3y_2024!`).
   - `DATABASE_URL`: Your Supabase transaction pooler URL (port 6543).
   - `GEMINI_API_KEY`: Your official Google Gemini API key.

---

### Step 3: Configure Frontend Environment Variables
1. Go to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Duplicate `.env.example` and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Ensure it points to your backend URL:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

---

### Step 4: Install Dependencies & Run the App

#### Run the Backend Server:
1. Open a new terminal in the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Push database schema to Supabase:
   ```bash
   npm run db:push
   ```
4. Start backend dev server:
   ```bash
   npm run dev
   ```

#### Run the Frontend Server:
1. Open a new terminal in the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start frontend dev server:
   ```bash
   npm run dev
   ```

---

## 🔒 Security Disclosure

Kaizora Scholar is a productivity-enhancing utility.
- All student credentials (NIM/Passwords) are **stored locally** inside your own database and encrypted with AES-256-GCM.
- No credential information is ever sent to any third-party server except the official Universitas Terbuka portal (`https://elearning.ut.ac.id`) for authentication and synchronization purposes.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE). Feel free to customize and develop it further!

---

*Made with ⚡ by Kaizora Team.*
