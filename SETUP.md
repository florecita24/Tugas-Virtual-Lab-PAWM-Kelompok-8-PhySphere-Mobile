# 📱 PhySphere Mobile - Expo Go Version

Ini adalah versi mobile dari PhySphere yang dibangun dengan **Expo Go** dan **React Native**. Aplikasi ini memungkinkan pengguna untuk belajar tentang Gerak Harmonik Sederhana (GHS) melalui simulasi interaktif dan kuis.

## 🚀 Quick Start

### Prasyarat
- Node.js v14 atau lebih baru
- npm atau yarn
- Expo Go app (tersedia di Play Store / App Store)
- Android/iOS device atau emulator

### Instalasi

1. **Navigasi ke folder project:**
   ```bash
   cd "Tugas-Virtual-Lab-PAWM-Kelompok-8-PhySphere-Mobile"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update Supabase credentials** di [services/supabaseClient.js](services/supabaseClient.js):
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

4. **Start Expo development server:**
   ```bash
   npm start
   ```

5. **Akses dengan Expo Go:**
   - Android: Scan QR code dengan Expo Go app
   - iOS: Scan QR code dengan Camera app, kemudian buka di Expo Go

## 📁 Struktur Project

```
.
├── App.js                    # Entry point & navigation setup
├── index.js                  # Root component
├── app.json                  # Expo configuration
├── package.json              # Dependencies
├── screens/                  # Screen components
│   ├── LoginScreen.js        # Login form
│   ├── RegisterScreen.js     # Register form
│   ├── HomeScreen.js         # Dashboard
│   ├── MateriScreen.js       # Learning materials
│   ├── LabScreen.js          # Physics simulations
│   ├── KuisScreen.js         # Quiz system
│   └── ProfileScreen.js      # User profile
├── services/                 # Business logic
│   └── supabaseClient.js     # Supabase configuration
└── assets/                   # Images & icons
```

## 📚 Fitur Utama

### 1. 🔐 Authentication
- Login dengan email/password
- Register akun baru
- Integrasi Supabase

### 2. 🏠 Dashboard
- Ringkasan fitur aplikasi
- Quick navigation ke setiap halaman

### 3. 📖 Materi Pembelajaran
- 4 modul: Getaran, GHS, Bandul, Pegas
- Progress tracking per modul
- Materi terstruktur dan mudah dipahami

### 4. 🔬 PhySphere Lab (Simulasi)
- **Mode Pegas:** Simulasi sistem pegas-massa dengan parameter yang dapat diatur
- **Mode Bandul:** Simulasi bandul sederhana
- Real-time visualization
- Kalkulasi physics parameters (Periode, Frekuensi, ω, Energi)

#### Parameter yang Dapat Diubah:
**Pegas:**
- Massa (m): 0.5 - 3.0 kg
- Konstanta Pegas (k): 50 - 200 N/m
- Amplitudo (A): 0.05 - 0.3 m

**Bandul:**
- Panjang Tali (L): 0.5 - 2.0 m
- Gravitasi (g): 5 - 12 m/s²
- Sudut Awal (θ): 0.1 - 0.5 rad

### 5. 📝 Kuis Interaktif
- 4 topik sesuai materi pembelajaran
- Soal pilihan ganda
- Feedback instan untuk setiap jawaban
- Tracking skor

### 6. 👤 Profil Pengguna
- Informasi user
- Statistik pembelajaran
- Pengaturan preferensi
- Logout functionality

## 🎨 Design System

- **Primary Color:** Purple (#a855f7)
- **Secondary Colors:** Blue, Green, Amber
- **Font:** System fonts (Tidak memerlukan custom fonts)
- **Responsive:** Semua screen mendukung berbagai ukuran device

## 🔌 API Integration

### Supabase
Aplikasi menggunakan Supabase untuk:
- User authentication
- Data persistence
- Progress tracking

## 📝 Catatan Penting

1. **Ganti Supabase Credentials:** Jangan lupa update SUPABASE_URL dan SUPABASE_ANON_KEY di `services/supabaseClient.js`

2. **Physics Simulation:** Simulasi menggunakan persamaan GHS standar:
   - x = A sin(ωt + φ)
   - ω = √(k/m) untuk pegas
   - ω = √(g/L) untuk bandul

3. **State Management:** Menggunakan React Hooks (useState, useEffect)

4. **Navigation:** Menggunakan React Navigation dengan Stack dan Bottom Tab Navigator

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator
npm run ios

# Run on web
npm run web
```

## 📦 Dependencies

- `expo` - Framework untuk React Native
- `react-native` - Mobile development framework
- `@react-navigation` - Navigation library
- `@supabase/supabase-js` - Supabase client
- `expo-vector-icons` - Icon library (Ionicons)

## 👥 Tim Pengembang (Kelompok 8)

* **Florecita Natawirya** (18223040)
* **Fhatika Adhalisman Ryanjani** (18223062)

## 📄 License

This project is part of PAWM Course - TPB ITB

---

**Selamat belajar dan nikmati PhySphere! 🚀⚛️**
