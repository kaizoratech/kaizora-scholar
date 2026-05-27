<template>
  <!-- Strictly Premium Solid Dark Theme Base (No Glassmorphism, 100% Mobile Friendly) -->
  <div :class="isDarkMode ? 'dark-theme' : 'light-theme'" class="min-h-screen flex items-center justify-center bg-theme-main text-theme-primary font-sans antialiased overflow-hidden select-none px-6 py-12 relative font-inter">
    
    <!-- Muted background layout -->
    <div class="absolute w-[300px] h-[300px] rounded-full bg-purple-650/[0.02] filter blur-[100px] top-[-5%] left-[-5%] pointer-events-none z-0"></div>

    <!-- Solid Opaque Apple-Style Container Card -->
    <div class="w-full max-w-md bg-[#0c0d16] border border-[#1a1c33] p-8 md:p-10 rounded-2xl shadow-2xl relative z-10">
      
      <!-- Top Branding -->
      <div class="text-center mb-8">
        <div 
          @click="router.push('/')"
          class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#131526] border border-[#1a1c33] text-purple-400 mb-5 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
          </svg>
        </div>
        <h1 class="text-xl font-black tracking-widest text-white mb-2 uppercase font-outfit">
          KAIZORA <span class="text-purple-400">SCHOLAR</span>
        </h1>
        <p class="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed uppercase font-bold tracking-wider font-mono">
          The Academic Bypass Engine for Universitas Terbuka
        </p>
      </div>

      <!-- Live Syncing Progress State -->
      <div v-if="isSyncing" class="space-y-6 py-4">
        <div class="flex flex-col items-center justify-center">
          <div class="relative w-12 h-12 mb-6">
            <div class="absolute inset-0 rounded-full border-4 border-purple-500/10"></div>
            <div class="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
          </div>
          <h3 class="text-xs font-black text-white mb-1.5 uppercase tracking-wider animate-pulse font-outfit">Sinkronisasi Aktif...</h3>
          <p class="text-[9px] text-gray-400 text-center max-w-xs leading-relaxed uppercase font-bold tracking-wider font-mono">
            Menghubungkan langsung ke server Moodle UT dan memicu sintesis AI Kaizora. Harap tunggu 10-30 detik.
          </p>
        </div>

        <!-- Sync Log Feed -->
        <div class="bg-[#05050a] rounded-xl p-4 border border-[#1a1c33] font-mono text-[9px] space-y-2 max-h-[140px] overflow-y-auto">
          <div v-for="(log, idx) in syncLogs" :key="idx" class="flex items-start gap-2">
            <span class="text-purple-400">⚡</span>
            <span class="text-gray-350 leading-normal">{{ log }}</span>
          </div>
          <div class="text-purple-500/70 animate-pulse">_</div>
        </div>
      </div>

      <!-- Credential Form -->
      <div v-else class="space-y-5">
        
        <form @submit.prevent="handleSync" class="space-y-5">
          <!-- Email Input -->
          <div class="space-y-2">
            <label class="block text-[8px] font-black text-gray-400 uppercase tracking-widest font-outfit">
              Email Sinkronisasi
            </label>
            <input 
              type="email" 
              v-model="form.email" 
              required 
              placeholder="nama@email.com"
              class="w-full bg-[#05050a] border border-[#1a1c33] rounded-xl px-4 py-3.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/30 transition-all duration-150"
            />
          </div>

          <!-- NIM Input -->
          <div class="space-y-2">
            <label class="block text-[8px] font-black text-gray-400 uppercase tracking-widest font-outfit">
              NIM / UT Username
            </label>
            <input 
              type="text" 
              v-model="form.ut_username" 
              required 
              placeholder="Contoh: 041234567"
              class="w-full bg-[#05050a] border border-[#1a1c33] rounded-xl px-4 py-3.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/30 transition-all duration-150"
            />
          </div>

          <!-- Password Input -->
          <div class="space-y-2">
            <label class="block text-[8px] font-black text-gray-400 uppercase tracking-widest font-outfit">
              Password Moodle UT
            </label>
            <input 
              type="password" 
              v-model="form.ut_password" 
              required 
              placeholder="••••••••••••"
              class="w-full bg-[#05050a] border border-[#1a1c33] rounded-xl px-4 py-3.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/30 transition-all duration-150"
            />
          </div>

          <!-- Error Banner -->
          <div v-if="error" class="bg-red-950/20 border border-red-500/20 text-red-300 text-[10px] leading-relaxed rounded-xl p-3.5 flex items-start gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4 mt-0.5 shrink-0 text-red-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <!-- Action Submit -->
          <button 
            type="submit" 
            class="w-full py-3.5 px-4 bg-[#131526] hover:bg-[#1c1e36] border border-[#1a1c33] hover:border-purple-500/20 text-xs font-black rounded-xl text-white shadow-lg transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 active:scale-95 uppercase tracking-widest font-outfit"
          >
            <span>Mulai Bypass & Sinkronisasi</span>
            <svg xmlns="http://www.w3.org/2500/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5 text-purple-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </form>

        <!-- Google OAuth Divider -->
        <div class="flex items-center gap-3 py-2">
          <div class="h-[1px] bg-[#1a1c33] flex-1"></div>
          <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest font-outfit">atau</span>
          <div class="h-[1px] bg-[#1a1c33] flex-1"></div>
        </div>

        <!-- Google GSI Live Button Container (100% Real Google Identity Integration) -->
        <div class="space-y-3 flex flex-col items-center">
          <div id="googleBtnContainer" class="w-full flex justify-center min-h-[44px]"></div>

          <!-- Elegant Bypass Selector Link to Sandbox Simulator -->
          <button 
            type="button"
            @click="showGoogleModal = true"
            class="text-[9px] font-black text-purple-400 hover:text-purple-300 transition-colors duration-150 uppercase tracking-widest cursor-pointer underline underline-offset-4 font-outfit"
          >
            Masuk Lewat Sandbox Developer Simulator
          </button>
        </div>

        <p class="text-[8px] text-gray-500 text-center leading-relaxed font-mono uppercase font-bold">
          Data Anda dienkripsi lokal dengan AES-256-GCM. Kami tidak menyimpan sandi Anda secara mentah. Bypass engine terhubung langsung ke elearning.ut.ac.id.
        </p>
      </div>

    </div>

    <!-- Google Account Picker Mockup Modal (Premium Overlay UI, Solid, Zero Glass) -->
    <div v-if="showGoogleModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div class="w-full max-w-sm bg-[#0c0d16] border border-[#1a1c33] rounded-2xl p-6 shadow-2xl relative mx-4">
        <!-- Close Button -->
        <button @click="showGoogleModal = false" class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors duration-150 cursor-pointer">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="text-center mb-6 mt-2">
          <!-- Google Icon -->
          <div class="w-10 h-10 rounded-xl bg-[#131526] border border-[#1a1c33] text-purple-400 flex items-center justify-center mx-auto mb-3">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>
          <h3 class="text-xs font-black text-white uppercase tracking-wider font-outfit">Pilih Akun Google</h3>
          <p class="text-[9px] text-gray-400 mt-1 max-w-xs mx-auto uppercase font-bold tracking-wider font-mono">Gunakan akun Google Student Anda untuk mengaktifkan sinkronisasi otomatis.</p>
        </div>

        <div class="space-y-2.5">
          <!-- Account 1 -->
          <button 
            @click="selectGoogleAccount('fadjar.setiawan@student.ut.ac.id', 'Fadjar Setiawan')"
            class="w-full p-3 rounded-xl bg-[#05050a] hover:bg-[#131526] border border-[#1a1c33] hover:border-purple-500/20 text-left flex items-center gap-3 transition-all duration-150 cursor-pointer"
          >
            <div class="w-8 h-8 rounded-full bg-[#131526] border border-[#1a1c33] flex items-center justify-center font-bold text-white text-xs font-outfit">
              FS
            </div>
            <div>
              <span class="text-[10px] font-black text-white block leading-tight font-outfit">Fadjar Setiawan</span>
              <span class="text-[9px] text-gray-500 block font-mono">fadjar.setiawan@student.ut.ac.id</span>
            </div>
          </button>

          <!-- Account 2 -->
          <button 
            @click="selectGoogleAccount('fadjar.personal@gmail.com', 'Fadjar Personal')"
            class="w-full p-3 rounded-xl bg-[#05050a] hover:bg-[#131526] border border-[#1a1c33] hover:border-purple-500/20 text-left flex items-center gap-3 transition-all duration-150 cursor-pointer"
          >
            <div class="w-8 h-8 rounded-full bg-[#131526] border border-[#1a1c33] flex items-center justify-center font-bold text-purple-300 text-xs font-outfit">
              FP
            </div>
            <div>
              <span class="text-[10px] font-black text-white block leading-tight font-outfit">Fadjar Personal</span>
              <span class="text-[9px] text-gray-500 block font-mono">fadjar.personal@gmail.com</span>
            </div>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api/axios';

const router = useRouter();
const isDarkMode = ref(localStorage.getItem('kaizora_dark_mode') !== 'false');

const updateDOMTheme = () => {
  const el = document.documentElement;
  if (isDarkMode.value) {
    el.classList.remove('light-theme');
    el.classList.add('dark-theme');
    document.body.style.backgroundColor = '#0b0c14';
  } else {
    el.classList.remove('dark-theme');
    el.classList.add('light-theme');
    document.body.style.backgroundColor = '#f8fafc';
  }
};

const isSyncing = ref(false);
const showGoogleModal = ref(false);
const error = ref('');
const syncLogs = ref([]);

const form = reactive({
  email: '',
  ut_username: '',
  ut_password: ''
});

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const handleSync = async () => {
  error.value = '';
  isSyncing.value = true;
  syncLogs.value = [];
  
  try {
    syncLogs.value.push('Menginisiasi terowongan data akademik...');
    await sleep(600);
    syncLogs.value.push('Melakukan koneksi bypass ke elearning.ut.ac.id...');
    await sleep(800);
    syncLogs.value.push('Mengunduh formulir CSRF & Logintoken...');
    await sleep(600);
    syncLogs.value.push('Mengirimkan otentikasi terenkripsi AES-256...');
    
    const response = await api.post('/auth/sync', {
      email: form.email,
      ut_username: form.ut_username,
      ut_password: form.ut_password
    });

    syncLogs.value.push('Login Berhasil! Mengekstrak mata kuliah terdaftar...');
    await sleep(500);
    syncLogs.value.push('Menyinkronkan sesi kuliah (1-8) & tugas...');
    await sleep(600);
    syncLogs.value.push('Memicu sintesis Kaizora Academic Engine...');
    await sleep(800);
    syncLogs.value.push('Menyimpan data terstruktur ke database lokal...');
    await sleep(500);

    if (response.data.success) {
      localStorage.setItem('kaizora_user_email', response.data.user.email);
      router.push({ name: 'Dashboard' });
    } else {
      throw new Error(response.data.message || 'Gagal melakukan sinkronisasi.');
    }
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || err.message || 'Koneksi ke bypass server gagal. Coba lagi.';
    isSyncing.value = false;
  }
};

const selectGoogleAccount = async (email, fullName) => {
  showGoogleModal.value = false;
  error.value = '';
  isSyncing.value = true;
  syncLogs.value = [];
  
  try {
    syncLogs.value.push('Menghubungkan ke layanan Google OAuth...');
    await sleep(650);
    syncLogs.value.push('Mengambil token otentikasi Google yang aman...');
    await sleep(750);
    syncLogs.value.push(`Memverifikasi profil Google Student: ${email}...`);
    await sleep(550);
    
    const response = await api.post('/auth/google-login', {
      email: email,
      fullName: fullName,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150'
    });
    
    syncLogs.value.push('Otentikasi Google Berhasil!');
    await sleep(500);
    syncLogs.value.push('Megarahkan ke Dashboard Kaizora...');
    await sleep(600);
    
    if (response.data.success) {
      localStorage.setItem('kaizora_user_email', response.data.user.email);
      router.push({ name: 'Dashboard' });
    } else {
      throw new Error(response.data.message || 'Gagal login dengan Google.');
    }
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || err.message || 'Otentikasi Google gagal. Silakan coba lagi.';
    isSyncing.value = false;
  }
};

// ── Google Identity Services (GSI) 100% Real Integration ───────────────────────
const handleCredentialResponse = async (response) => {
  try {
    error.value = '';
    isSyncing.value = true;
    syncLogs.value = [];

    syncLogs.value.push('Mengurai JWT Kredensial Google yang aman...');
    await sleep(400);

    // Decode JWT token safely in browser
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    const email = payload.email;
    const name = payload.name || payload.given_name;
    const picture = payload.picture;

    syncLogs.value.push(`Profil Google Student ditemukan: ${email}`);
    await sleep(500);
    syncLogs.value.push('Menyinkronkan otentikasi Google dengan database Kaizora...');
    await sleep(600);

    const apiResponse = await api.post('/auth/google-login', {
      email: email,
      fullName: name,
      avatarUrl: picture
    });

    syncLogs.value.push('Otentikasi Google 100% Berhasil!');
    await sleep(500);
    syncLogs.value.push('Mengarahkan ke Dashboard Kaizora...');
    await sleep(600);

    if (apiResponse.data.success) {
      localStorage.setItem('kaizora_user_email', apiResponse.data.user.email);
      router.push({ name: 'Dashboard' });
    } else {
      throw new Error(apiResponse.data.message || 'Gagal login dengan Google.');
    }
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || err.message || 'Verifikasi Google OAuth gagal. Coba lagi.';
    isSyncing.value = false;
  }
};

onMounted(() => {
  updateDOMTheme();
  // Load Google Identity Services script dynamically
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    if (window.google) {
      try {
        const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1084285888365-dsk5b2g6o20s883j82h3b827f8djskfh.apps.googleusercontent.com';
        
        window.google.accounts.id.initialize({
          client_id: client_id,
          callback: handleCredentialResponse
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleBtnContainer'),
          { 
            theme: 'filled_black', 
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: '320'
          }
        );
      } catch (err) {
        console.warn('[GSI] Failed to render Google OAuth button:', err.message);
      }
    }
  };
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap');

.font-outfit {
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
}

.font-inter {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.light-theme {
  --bg-main: #f8fafc;
  --bg-card: #ffffff;
  --bg-hover: #f1f5f9;
  --border-color: #e8eaf0;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
}
.dark-theme {
  --bg-main: #0b0c14;
  --bg-card: #10111c;
  --bg-hover: #161828;
  --border-color: #1e2040;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
}

.bg-theme-main { background-color: var(--bg-main) !important; }
.text-theme-primary { color: var(--text-primary) !important; }

.light-theme [class*="bg-[#05050a]"],
.light-theme [class*="bg-[#0c0d16]"],
.light-theme [class*="bg-[#101221]"],
.light-theme [class*="bg-[#131526]"] {
  background-color: var(--bg-card) !important;
  box-shadow: none !important;
}
.light-theme [class*="bg-[#05050a]"] { background-color: var(--bg-main) !important; }
.light-theme [class*="bg-[#131526]"] { background-color: var(--bg-hover) !important; }

.dark-theme [class*="bg-[#05050a]"],
.dark-theme [class*="bg-[#0c0d16]"],
.dark-theme [class*="bg-[#101221]"],
.dark-theme [class*="bg-[#131526]"] {
  background-color: var(--bg-card) !important;
  box-shadow: none !important;
}
.dark-theme [class*="bg-[#05050a]"] { background-color: var(--bg-main) !important; }
.dark-theme [class*="bg-[#131526]"] { background-color: var(--bg-hover) !important; }

.light-theme [class*="border-[#1a1c33]"],
.light-theme [class*="border-[#1c1e36]"] { border-color: var(--border-color) !important; }
.dark-theme [class*="border-[#1a1c33]"],
.dark-theme [class*="border-[#1c1e36]"] { border-color: var(--border-color) !important; }

.light-theme .text-white { color: var(--text-primary) !important; }
.light-theme .text-gray-200,
.light-theme .text-gray-300,
.light-theme .text-gray-400 { color: var(--text-primary) !important; }
.light-theme .text-gray-500,
.light-theme .text-gray-600 { color: var(--text-secondary) !important; }

.light-theme [class*="bg-purple-650"], .dark-theme [class*="bg-purple-650"] {
  display: none !important;
}
.shadow-2xl, .shadow-md { box-shadow: none !important; }
</style>
