# 📱 PhySphere Mobile

<div align="center">
  <h3>Virtual Lab Gerak Harmonik Sederhana - Versi Mobile</h3>
  <p>Built with Expo Go & React Native</p>
</div>

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Update Supabase Credentials
Edit file `services/supabaseClient.js`:
```javascript
const SUPABASE_URL = 'https://xxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJ....';
```

### 3️⃣ Jalankan Development Server
```bash
npm start
```

### 4️⃣ Scan QR Code
- **Android:** Buka Expo Go app → Scan QR
- **iOS:** Buka Camera app → Scan QR → Open in Expo Go

---

## 📱 Fitur Aplikasi

### 🔐 Authentication
- Login dengan email & password
- Register akun baru
- Auto-login dengan session management

### 🏠 Dashboard
- Overview fitur aplikasi
- Quick navigation

### 📚 Materi Pembelajaran
- 4 Modul Pembelajaran:
  - Getaran & Gelombang
  - Gerak Harmonik Sederhana
  - Bandul Sederhana
  - Sistem Pegas-Massa
- Progress tracking
- Mark as completed

### 🔬 PhySphere Lab
**Mode Pegas:**
- Adjust: Massa, Konstanta Pegas, Amplitudo
- Kalkulasi: Periode, Frekuensi, Energi

**Mode Bandul:**
- Adjust: Panjang Tali, Gravitasi, Sudut Awal
- Kalkulasi: Periode, Frekuensi, ω

**Controls:**
- ▶️ Play/Pause simulation
- 🔄 Reset simulation
- ➕➖ Adjust parameters

### 📝 Kuis Interaktif
- 4 Topik Quiz
- Multiple Choice Questions
- Instant feedback
- Score tracking

### 👤 Profil
- User information
- Statistics
- Settings
- Logout

---

## 📂 Struktur Project

```
├── App.js                      # Navigation & Auth
├── screens/                    # All screens
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── HomeScreen.js
│   ├── MateriScreen.js
│   ├── LabScreen.js
│   ├── KuisScreen.js
│   └── ProfileScreen.js
├── services/
│   └── supabaseClient.js       # Supabase config
└── assets/                     # Images & icons
```

---

## 🛠️ Tech Stack

- **Expo** - React Native framework
- **React Navigation** - Navigation library
- **Supabase** - Backend & Authentication
- **Ionicons** - Icon library

---

## 📝 Commands

```bash
npm start          # Start development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
```

---

## 👥 Tim Pengembang

**Kelompok 8 - PAWM ITB**
- Florecita Natawirya (18223040)
- Fhatika Adhalisman Ryanjani (18223062)

---

## 📄 Documentation

- 📖 [SETUP.md](SETUP.md) - Setup guide lengkap
- ✅ [CHECKLIST.md](CHECKLIST.md) - Implementation checklist
- 📋 [IMPLEMENTASI.md](IMPLEMENTASI.md) - Detail implementasi

---

**Happy Learning! 🚀⚛️**
