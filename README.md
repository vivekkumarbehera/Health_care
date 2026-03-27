# 🏥 Elder Health Monitoring System

A modern, visually stunning health monitoring dashboard designed for care managers and family members to track the vitals of elderly patients in real-time.

---

> [!IMPORTANT]
> **Why SQLite?**
> Originally, this project used MongoDB, but it led to frequent `ENOSPC` (disk space) errors during setup. To ensure a **Zero-Setup** and **Stable** experience, we have transitioned to **SQLite**. No external database installation is required for local development.

---

## 🌟 Key Features

### 🧠 Intelligent Alert Engine
Our rule-based engine automatically evaluates health readings and triggers instant notifications:
- ❤️ **Heart Rate**: Alerts if BPM is `< 50` or `> 110`.
- 💨 **Oxygen Level**: Marked as **Critical** if `< 92%`.
- 🩺 **Blood Pressure**: Triggers a **Warning** if `> 140/90 mmHg`.

### 🎮 'Smart' Simulation System
- **Auto-Sync**: First-time users get a unique, randomized health snapshot immediately upon login.
- **On-Demand Simulation**: Use the **"Simulate New Vital"** button on the dashboard to trigger new health events and watch the alert system react instantly.

### 💎 Premium Aesthetics
- **Glassmorphism Design**: A sleek, translucent UI with vibrant gradients and smooth animations.
- **Dynamic Color Coding**: Vitals change color based on their medical severity (Red for Critcal/Alert, Amber for Warning, Green for Normal).

---

## 🛠️ Technology Stack
- **Frontend**: React + Vite + Lucide Icons
- **Backend**: Node.js + Express
- **Database**: Sequelize ORM
  - **Local**: SQLite (zero-setup file-based database)
  - **Cloud**: PostgreSQL (production-ready for Vercel/Supabase)

---

## 🚀 Getting Started

### 1. Local Development
1. Clone the repository.
2. Run `npm install` in the root and `backend` folders.
3. Run `npm run dev` to start both the frontend and backend.
4. The database is stored in `backend/database.sqlite` (no setup required!).

### 2. Vercel Deployment (Cloud)
1. Import the project to Vercel.
2. Add these **Environment Variables**:
   - `JWT_SECRET`: Any random string (e.g., `my_secret_key_123`)
   - `DATABASE_URL`: Your Supabase or Postgres connection string.
     - *Note: Replace `@` in your password with `%40`.*
3. Click **Deploy**!

---

## 👥 Contributors
- **Vivek Kumar Behera** (@vivekkumarbehera)

---

> Built with ❤️ for Advanced Elder care.
