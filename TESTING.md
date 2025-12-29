# 📸 Testing Guide - PhySphere Mobile

## ✅ Testing Checklist

Gunakan checklist ini untuk verify semua fitur bekerja dengan baik:

### 1. 🔐 Authentication Flow

**Login Screen:**
- [ ] Buka app → Should show LoginScreen
- [ ] Input email & password yang salah → Should show error
- [ ] Input email & password yang benar → Should navigate ke Home
- [ ] Click "Daftar di sini" → Should navigate ke RegisterScreen

**Register Screen:**
- [ ] Input email, password, confirm password
- [ ] Password tidak sama → Should show error
- [ ] Password < 6 karakter → Should show error
- [ ] Register berhasil → Should show success alert → Navigate ke Login
- [ ] Click "Login di sini" → Should navigate ke LoginScreen

### 2. 🏠 Home Screen (Dashboard)

After login successful:
- [ ] Should see welcome message
- [ ] Should see 3 feature cards (Simulasi, Kuis, Materi)
- [ ] Click card → Should navigate ke screen yang sesuai
- [ ] Click "Mulai Materi" button → Should navigate ke Materi
- [ ] Click "Coba Kuis" button → Should navigate ke Kuis
- [ ] Bottom tab navigation visible dengan 5 tabs

### 3. 📚 Materi Screen

- [ ] Should see 4 modules (Getaran, GHS, Bandul, Pegas)
- [ ] Progress bar showing 0% initially
- [ ] Click module → Should expand dengan konten
- [ ] Click "Tandai Sudah Dibaca" → Should:
  - Change button ke "Sudah Ditandai Selesai" (green)
  - Update progress bar
  - Show success alert
  - Show checkmark icon di module title
- [ ] Click button lagi → Should toggle back
- [ ] All modules can be expanded independently
- [ ] Scroll works smoothly

### 4. 🔬 Lab Screen (Simulator)

**Mode Toggle:**
- [ ] Default mode: Pegas
- [ ] Click "Bandul" button → Should switch ke Bandul mode & reset simulation

**Pegas Mode:**
- [ ] Should see visualization area dengan fixed point & mass
- [ ] Adjust Massa dengan +/- buttons → Value should update
- [ ] Adjust Konstanta Pegas → Value should update
- [ ] Adjust Amplitudo → Value should update
- [ ] Parameters disabled saat running
- [ ] Click "Mulai" → Should:
  - Start simulation animation
  - Update position in real-time
  - Button change ke "Jeda"
  - Update physics results (T, f, ω, Ek, Ep, E Total)
- [ ] Click "Jeda" → Should pause animation
- [ ] Click "Reset" → Should:
  - Stop animation
  - Reset position to 0
  - Enable parameter adjustments
  - Reset time to 0

**Bandul Mode:**
- [ ] Should see pivot point & pendulum bob
- [ ] Adjust Panjang Tali → Value should update
- [ ] Adjust Gravitasi → Value should update
- [ ] Adjust Sudut Awal → Value should update
- [ ] Click "Mulai" → Should:
  - Start pendulum swing animation
  - Show angle changes
  - Update physics results (T, f, ω)
- [ ] Same controls work (Jeda, Reset)

### 5. 📝 Kuis Screen

**Topic Selection:**
- [ ] Should see 4 topic cards (Getaran, GHS, Bandul, Pegas)
- [ ] Each card shows number of questions (3 soal)
- [ ] Click topic → Should navigate ke quiz

**Quiz Flow:**
- [ ] Should see progress bar (Soal 1 dari 3)
- [ ] Should see question text clearly
- [ ] Should see 4 answer options (A, B, C, D)
- [ ] Click answer → Should:
  - Highlight selected answer
  - Show alert (Benar/Salah)
  - If salah, show correct answer
  - Update score
  - Disable other options
  - Show "Soal Berikutnya" button
- [ ] Click "Soal Berikutnya" → Move to next question
- [ ] Last question → Button shows "Selesai"
- [ ] Click "Selesai" → Show final score alert
- [ ] Back button → Return to topic selection
- [ ] Try different topics → Each has unique questions

### 6. 👤 Profile Screen

- [ ] Should see user email
- [ ] Should see user avatar icon
- [ ] Should see 3 stats cards (Modul, Kuis, Simulasi)
- [ ] Scroll to see settings sections
- [ ] Settings items visible:
  - [ ] Bahasa (Indonesia)
  - [ ] Mode Gelap (toggle inactive)
  - [ ] Notifikasi (toggle active)
- [ ] Account settings visible:
  - [ ] Ubah Password
  - [ ] Privasi & Keamanan
  - [ ] Bantuan
- [ ] Click "Logout" → Should:
  - Show confirmation alert
  - Click "Batal" → Stay on profile
  - Click "Ya, Logout" → Navigate back to Login screen

### 7. 🔄 Bottom Tab Navigation

Test navigation antar tabs:
- [ ] Home tab → Should show HomeScreen
- [ ] Materi tab → Should show MateriScreen (preserve state)
- [ ] Lab tab → Should show LabScreen (preserve state)
- [ ] Kuis tab → Should show KuisScreen
- [ ] Profile tab → Should show ProfileScreen
- [ ] Icon colors:
  - Active tab: Purple (#a855f7)
  - Inactive tabs: Gray
- [ ] Icons change berdasarkan active state

### 8. 📱 Device Testing

**Orientation:**
- [ ] Portrait mode works
- [ ] Landscape mode works (jika perlu)

**Different Screen Sizes:**
- [ ] Small phone (5")
- [ ] Medium phone (6")
- [ ] Large phone (6.5"+)
- [ ] Tablet (optional)

**Performance:**
- [ ] Smooth animations
- [ ] No lag when switching screens
- [ ] Simulator runs at ~60 FPS
- [ ] No memory leaks (check long-running simulation)

### 9. 🐛 Error Handling

- [ ] Network offline → Should show appropriate error
- [ ] Wrong Supabase credentials → Should show error
- [ ] Empty form submission → Should show validation error
- [ ] Long text handling → Should not overflow

### 10. 🎨 UI/UX Checks

- [ ] All text readable
- [ ] Colors consistent (Purple theme)
- [ ] Spacing & padding appropriate
- [ ] Buttons have clear hover/press states
- [ ] Loading indicators show when needed
- [ ] Alert dialogs work correctly
- [ ] ScrollView works where needed
- [ ] No UI elements overlapping

---

## 📝 Test Data

Use these credentials for testing:

**Test User 1:**
- Email: `test1@physphere.com`
- Password: `123456`

**Test User 2:**
- Email: `test2@physphere.com`
- Password: `123456`

*(Create these users via Register screen dulu)*

---

## 🐞 Bug Report Template

Jika menemukan bug, catat dengan format:

```
**Bug Title:** [Short description]

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. See error

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshot:**
[If applicable]

**Device:**
- OS: Android/iOS
- Version: 
- Device Model:
- Expo Go Version:
```

---

## ✅ Final Checklist

Sebelum production:
- [ ] All features tested & working
- [ ] Supabase credentials updated
- [ ] No console errors
- [ ] Performance optimized
- [ ] UI polished
- [ ] Documentation updated
- [ ] Screenshots taken
- [ ] Demo video recorded (optional)

---

**Good luck dengan testing! 🚀**
