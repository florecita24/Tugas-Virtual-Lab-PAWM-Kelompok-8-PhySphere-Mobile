# Google OAuth Setup untuk Expo Go

## Persiapan

Aplikasi sekarang sudah dilengkapi dengan:
1. **Splash Screen Animasi** - Landing page dengan animasi logo PhySphere yang muncul selama 3 detik
2. **Google OAuth Integration** - Login dengan Google yang akan redirect kembali ke Expo Go

## Konfigurasi Supabase

Untuk menggunakan Google OAuth dengan Expo Go, Anda perlu mengkonfigurasi redirect URL di Supabase:

### Langkah-langkah:

1. **Buka Dashboard Supabase**
   - Masuk ke project Anda di https://supabase.com

2. **Konfigurasi Google OAuth Provider**
   - Pergi ke `Authentication` > `Providers`
   - Aktifkan `Google` provider
   - Isi Client ID dan Client Secret dari Google Cloud Console

3. **Tambahkan Redirect URLs**
   Tambahkan URL berikut ke daftar redirect URLs di Supabase:
   ```
   exp://127.0.0.1:8081
   physphere://auth-callback
   ```
   
   Untuk production (setelah build):
   ```
   physphere://auth-callback
   ```

4. **Konfigurasi Google Cloud Console**
   - Buka Google Cloud Console (https://console.cloud.google.com)
   - Pergi ke `APIs & Services` > `Credentials`
   - Tambahkan Authorized redirect URIs yang sama:
     - `exp://127.0.0.1:8081`
     - `physphere://auth-callback`
     - URL callback Supabase Anda (format: `https://<project-ref>.supabase.co/auth/v1/callback`)

## Cara Menggunakan

### 1. Jalankan Aplikasi
```bash
npm start
```

### 2. Scan QR Code dengan Expo Go
Aplikasi akan menampilkan:
- Splash screen animasi dengan logo PhySphere (3 detik)
- Welcome screen dengan tombol "Login dengan Google"

### 3. Login dengan Google
- Klik tombol "Login dengan Google"
- Browser akan terbuka untuk memilih akun Google
- Setelah memilih akun, Anda akan di-redirect kembali ke aplikasi di Expo Go
- Anda akan otomatis masuk ke aplikasi

## Fitur yang Ditambahkan

### 1. SplashScreen Component (`screens/SplashScreen.js`)
- Animasi fade in dan scale untuk logo
- Animasi rotasi orbit elektron
- Progress bar loading
- Auto-redirect setelah 3 detik

### 2. Deep Linking Configuration
- Scheme: `physphere://`
- Development URL: `exp://127.0.0.1:8081`
- Menangani OAuth callback dari Supabase

### 3. Enhanced Google OAuth
- Redirect URL disesuaikan untuk Expo Go
- Error handling yang lebih baik
- Parsing token dari URL callback
- Auto-login setelah berhasil authenticate

## Troubleshooting

### Google OAuth tidak berfungsi
1. Pastikan redirect URLs sudah dikonfigurasi dengan benar di Supabase
2. Pastikan Client ID dan Secret sudah benar di Supabase
3. Cek console log untuk error message

### Tidak redirect ke aplikasi setelah login
1. Pastikan scheme `physphere` sudah dikonfigurasi di `app.json`
2. Restart Expo Go setelah mengubah konfigurasi
3. Cek URL redirect di browser setelah login

### Splash screen tidak muncul
1. Pastikan `expo-linear-gradient` sudah terinstall
2. Jalankan `npm install` untuk memastikan semua dependencies terinstall
3. Restart aplikasi dengan `npm start`

## Catatan Penting

- Untuk production build, ganti URL redirect dari `exp://127.0.0.1:8081` ke custom scheme `physphere://auth-callback`
- Splash screen duration bisa diubah di `screens/SplashScreen.js` (default: 3 detik)
- Animasi bisa di-customize sesuai kebutuhan
