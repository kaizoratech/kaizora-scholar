<template>
  <!-- Immersive Academic Cockpit: Premium Solid Ultra-Dark UI (No Glassmorphism, 100% Mobile Friendly) -->
  <div class="min-h-screen bg-[#05050a] text-[#e4e4e7] font-sans antialiased flex flex-col md:h-screen md:overflow-hidden relative select-none font-inter">
    
    <!-- 1. Top Navigation Bar (Ultra-Clean, Solid Dark-Slate, Zero Clutter) -->
    <header class="h-16 border-b border-[#1a1c33] bg-[#0c0d16] flex items-center justify-between px-4 md:px-6 shrink-0 relative z-30">
      
      <!-- Left: Mobile Menu Toggle & Brand Logo -->
      <div class="flex items-center gap-3">
        <!-- Mobile Sidebar Hamburger Button -->
        <button 
          @click="isMobileSidebarOpen = !isMobileSidebarOpen"
          class="md:hidden p-2 bg-[#131526] hover:bg-[#1c1e36] text-gray-300 rounded-lg border border-[#1a1c33] cursor-pointer transition-all"
          title="Tampilkan Menu Matkul"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <!-- Brand Logo (Outfit Font, Minimalist) -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-[#131526] flex items-center justify-center text-white font-black text-xs border border-[#1a1c33] shadow-md font-outfit">
            KS
          </div>
          <h1 class="text-sm font-black text-white tracking-widest uppercase font-outfit">
            KAIZORA
          </h1>
        </div>
      </div>

      <!-- Middle: Navigation Tabs (Clean Muted Gray Selector) -->
      <div class="flex items-center bg-[#05050a] p-1 rounded-lg border border-[#1a1c33]">
        <button 
          @click="activeTab = 'dashboard'"
          :class="[
            'px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-2 font-outfit',
            activeTab === 'dashboard' ? 'bg-[#131526] text-white border border-[#1a1c33]' : 'text-gray-400 hover:text-white border border-transparent'
          ]"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.263 15.918a9 9 0 1 0 15.474 0M12 3v13.5M3 9l9-6 9 6-9 6-9-6Z" />
          </svg>
          <span class="hidden sm:inline">Dashboard</span>
        </button>
        <button 
          @click="activeTab = 'analytics'"
          :class="[
            'px-3.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-2 font-outfit',
            activeTab === 'analytics' ? 'bg-[#131526] text-white border border-[#1a1c33]' : 'text-gray-400 hover:text-white border border-transparent'
          ]"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span class="hidden sm:inline">Audit Token</span>
        </button>
      </div>

      <!-- Right: Consolidated User Dropdown -->
      <div class="relative">
        <button 
          @click="isUserMenuOpen = !isUserMenuOpen"
          class="flex items-center gap-2 px-3 py-1.5 bg-[#131526] hover:bg-[#1c1e36] text-white text-[11px] font-bold rounded-lg border border-[#1a1c33] transition-all cursor-pointer font-outfit active:scale-95"
        >
          <span class="max-w-[100px] truncate hidden sm:inline">{{ studentName }}</span>
          <svg class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        <!-- Dropdown Menu (Solid Opaque, No Glass Blur) -->
        <div 
          v-if="isUserMenuOpen" 
          class="absolute right-0 mt-2 w-64 bg-[#0c0d16] border border-[#1a1c33] rounded-xl shadow-2xl z-40 py-2 divide-y divide-[#1a1c33] animate-in fade-in duration-100"
        >
          <!-- User Info header inside menu -->
          <div class="px-4 py-3 space-y-1">
            <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-outfit">Akun Mahasiswa</span>
            <div class="text-xs font-bold text-white font-outfit truncate">{{ studentName }}</div>
            <div class="text-[10px] text-gray-400 font-mono font-bold">NIM: {{ studentNIM }}</div>
            <div class="text-[9px] text-gray-500 font-medium truncate">{{ studentProdi }}</div>
          </div>

          <!-- Connection Status -->
          <div class="px-4 py-2.5 flex items-center justify-between">
            <span class="text-[9px] font-bold text-gray-450 uppercase tracking-wider font-outfit">Status Koneksi</span>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span class="text-[8px] text-emerald-400 font-bold uppercase tracking-wider font-mono">SSL Secure</span>
            </div>
          </div>

          <!-- Secondary Actions -->
          <div class="py-1">
            <button 
              @click="isProfileModalOpen = true; isUserMenuOpen = false"
              class="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:bg-[#131526] transition-colors flex items-center gap-2 cursor-pointer font-outfit"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span>Ubah Data Profil</span>
            </button>
            <button 
              @click="triggerResync(); isUserMenuOpen = false"
              :disabled="isResyncing"
              class="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:bg-[#131526] transition-colors flex items-center gap-2 cursor-pointer font-outfit disabled:opacity-50"
            >
              <svg :class="['w-3.5 h-3.5', isResyncing ? 'animate-spin' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>Sync Data Moodle</span>
            </button>
          </div>

          <!-- Logout -->
          <div class="py-1">
            <button 
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors flex items-center gap-2 cursor-pointer font-outfit"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              <span>Keluar Sistem</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 2. Responsive Workspace (Dynamic Sidebar + Flexible Content Area) -->
    <div class="flex flex-row flex-1 md:overflow-hidden relative z-10">
      
      <!-- DESKTOP SIDEBAR: Dynamic Collapsible / Toggleable (Solid Opaque) -->
      <aside 
        :class="[
          'hidden md:flex flex-col bg-[#0c0d16] border-r border-[#1a1c33] shrink-0 transition-all duration-300 relative z-20',
          isSidebarCollapsed ? 'w-0 overflow-hidden border-r-0' : 'w-72'
        ]"
      >
        <!-- AI Token Quota Widget (Solid Opaque Card) -->
        <div class="p-5 border-b border-[#1a1c33] bg-[#101221] space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest font-outfit">Kuota AI (SaaS)</span>
            <div class="flex items-center gap-1.5 font-mono">
              <button @click="isPackageModalOpen = true" class="text-[9px] text-gray-400 hover:text-white transition-colors uppercase tracking-widest cursor-pointer font-outfit">Plan</button>
              <span class="text-[9px] text-gray-650">|</span>
              <button @click="isTopUpModalOpen = true" class="text-[9px] text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-widest cursor-pointer font-outfit">Top Up</button>
            </div>
          </div>
          
          <div class="text-[10px] text-gray-200 flex items-center justify-between font-mono">
            <span class="capitalize font-bold text-gray-300 flex items-center gap-1.5 font-outfit">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {{ packageType === 'free' ? 'Explorer' : packageType === 'premium' ? 'Scholar' : 'Elite VIP' }}
            </span>
            <span class="font-bold text-white text-[9px] bg-zinc-900 border border-[#1a1c33] px-2 py-0.5 rounded">
              {{ (Math.max(0, tokensMax - tokensUsed) + aiTokensPurchased).toLocaleString('id-ID') }} Tkn
            </span>
          </div>

          <!-- Sleek Clean Progress Bars -->
          <div class="space-y-3">
            <div class="space-y-1">
              <div class="flex justify-between text-[8px] text-gray-500 scale-95 origin-left font-bold uppercase tracking-wider font-outfit">
                <span>Kuota Bulanan</span>
                <span>{{ Math.max(0, tokensMax - tokensUsed).toLocaleString('id-ID') }} / {{ tokensMax.toLocaleString('id-ID') }}</span>
              </div>
              <div class="w-full h-1 bg-[#05050a] rounded-full overflow-hidden border border-[#1a1c33]">
                <div 
                  class="h-full bg-gray-500 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.max(0, Math.min(100, ((tokensMax - tokensUsed) / tokensMax) * 100))}%` }"
                ></div>
              </div>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between text-[8px] text-gray-500 scale-95 origin-left font-bold uppercase tracking-wider font-outfit">
                <span>Top Up Balance</span>
                <span class="text-amber-500">+{{ aiTokensPurchased.toLocaleString('id-ID') }} Token</span>
              </div>
              <div class="w-full h-1 bg-[#05050a] rounded-full overflow-hidden border border-[#1a1c33]">
                <div 
                  class="h-full bg-amber-600 rounded-full transition-all duration-300"
                  :style="{ width: `${Math.max(0, Math.min(100, aiTokensPurchased > 0 ? 100 : 0))}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar List Header -->
        <div class="p-4 border-b border-[#1a1c33] flex items-center justify-between">
          <h3 class="text-[9px] font-black text-gray-550 uppercase tracking-widest font-outfit">Mata Kuliah Terdaftar</h3>
          <span class="text-[9px] text-gray-400 font-bold bg-[#131526] px-2 py-0.5 rounded border border-[#1a1c33] font-mono">
            {{ courses.length }}
          </span>
        </div>
        
        <!-- Dense Courses List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-2">
          <div v-if="loadingCourses" class="space-y-2 py-2">
            <div v-for="n in 3" :key="n" class="h-11 bg-[#05050a] border border-[#1a1c33] rounded-xl animate-pulse"></div>
          </div>

          <div v-else-if="courses.length === 0" class="text-center py-8 text-[9px] text-gray-500 uppercase tracking-wider font-outfit">
            Tidak ada matkul terdaftar.<br/>Jalankan Sync Moodle.
          </div>

          <button 
            v-else
            v-for="course in courses" 
            :key="course.id"
            @click="selectCourse(course)"
            :class="[
              'w-full text-left p-3 rounded-xl border transition-all duration-100 cursor-pointer flex flex-col gap-1 relative group active:scale-[0.98]',
              selectedCourse?.id === course.id 
                ? 'bg-[#131526] border-purple-500/20 text-white' 
                : 'bg-[#05050a] border-[#1a1c33] hover:bg-[#101221] hover:border-[#2b2c4d] text-gray-400'
            ]"
          >
            <div v-if="selectedCourse?.id === course.id" class="absolute left-0 top-2.5 bottom-2.5 w-1 bg-purple-500 rounded-r-full"></div>
            
            <div class="flex items-start gap-2">
              <svg class="w-3.5 h-3.5 text-purple-400/80 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
              <span class="text-[10px] font-bold uppercase tracking-wide leading-snug line-clamp-2 font-outfit">
                {{ course.name }}
              </span>
            </div>
            
            <div class="flex items-center justify-between text-[8px] text-gray-600 font-mono font-bold mt-1 uppercase">
              <span>ID: {{ course.utCourseId }}</span>
              <span>Sync: {{ formatDate(course.lastSynced) }}</span>
            </div>
          </button>
        </div>
      </aside>

      <!-- Desktop Sidebar Toggle Tab Button (Floating chevron, very interactive) -->
      <button 
        @click="isSidebarCollapsed = !isSidebarCollapsed"
        class="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 transition-all duration-300 z-30 w-5 h-12 bg-[#0c0d16] hover:bg-[#131526] border border-l-0 border-[#1a1c33] rounded-r-lg items-center justify-center cursor-pointer shadow-md text-gray-400 hover:text-white"
        :style="{ left: isSidebarCollapsed ? '0px' : '288px' }"
      >
        <svg v-if="isSidebarCollapsed" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <svg v-else class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <!-- MOBILE SIDEBAR DRAWERS: (Slide-over, 100% Solid Opaque, Extremely Mobile-Friendly) -->
      <div 
        v-if="isMobileSidebarOpen"
        class="md:hidden fixed inset-0 z-40 bg-black/90 flex"
      >
        <div class="w-80 max-w-[85vw] bg-[#0c0d16] border-r border-[#1a1c33] h-full flex flex-col relative z-50 animate-in slide-in-from-left duration-150">
          <!-- Sidebar Header -->
          <div class="p-4 border-b border-[#1a1c33] flex items-center justify-between bg-[#101221]">
            <h3 class="text-xs font-black text-white uppercase tracking-wider font-outfit">Sesi & Mata Kuliah</h3>
            <button @click="isMobileSidebarOpen = false" class="text-gray-400 hover:text-white cursor-pointer">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Token Metrics inside drawer -->
          <div class="p-4 border-b border-[#1a1c33] bg-[#05050a] space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest font-outfit">Sisa Quota AI</span>
              <span class="text-[9px] text-white bg-zinc-900 border border-[#1a1c33] px-2 py-0.5 rounded font-mono">
                {{ (Math.max(0, tokensMax - tokensUsed) + aiTokensPurchased).toLocaleString('id-ID') }} Tkn
              </span>
            </div>
            
            <div class="flex items-center justify-between text-[8px] font-bold font-mono">
              <button @click="isPackageModalOpen = true; isMobileSidebarOpen = false" class="text-gray-400 uppercase tracking-widest font-outfit">Ubah Plan</button>
              <button @click="isTopUpModalOpen = true; isMobileSidebarOpen = false" class="text-amber-500 uppercase tracking-widest font-outfit">Top Up Token</button>
            </div>
          </div>

          <!-- Courses List inside drawer -->
          <div class="flex-1 overflow-y-auto p-4 space-y-2">
            <button 
              v-for="course in courses" 
              :key="course.id"
              @click="selectCourse(course); isMobileSidebarOpen = false"
              :class="[
                'w-full text-left p-3 rounded-xl border transition-all duration-100 cursor-pointer flex flex-col gap-1 relative active:scale-[0.98]',
                selectedCourse?.id === course.id 
                  ? 'bg-[#131526] border-purple-500/20 text-white' 
                  : 'bg-[#05050a] border-[#1a1c33] text-gray-400'
              ]"
            >
              <span class="text-[10px] font-bold uppercase tracking-wide leading-snug font-outfit">{{ course.name }}</span>
              <span class="text-[8px] text-gray-600 font-mono font-bold mt-1 uppercase">ID: {{ course.utCourseId }}</span>
            </button>
          </div>
        </div>

        <!-- Tap outside backdrop to close mobile drawer -->
        <div @click="isMobileSidebarOpen = false" class="flex-1"></div>
      </div>

      <!-- MAIN WORKSPACE CONSOLE -->
      <main class="flex-1 bg-[#05050a] flex flex-col md:overflow-hidden relative">
        
        <!-- TAB 1: AUDIT TOKEN (100% Solid, Monochrome, Financial-grade list, Muted) -->
        <div v-if="activeTab === 'analytics'" class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          <!-- Tab Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1c33] pb-5">
            <div>
              <h2 class="text-sm font-black text-white tracking-wider uppercase flex items-center gap-2 font-outfit">
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Audit & Log Konsumsi Token</span>
              </h2>
              <p class="text-[9px] text-gray-500 mt-1 uppercase font-bold tracking-wider font-mono">
                Log penyerapan token AI resmi untuk bypass akademik Moodle UT.
              </p>
            </div>
            
            <button 
              @click="isTopUpModalOpen = true"
              class="px-3.5 py-1.5 bg-[#131526] hover:bg-[#1c1e36] text-white border border-[#1a1c33] font-black text-[9px] uppercase tracking-widest rounded-lg flex items-center gap-1.5 transition-all duration-100 cursor-pointer active:scale-95 font-outfit"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
              <span>Top Up Token</span>
            </button>
          </div>

          <!-- Monochrome Stats Matrix -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-[#0c0d16] border border-[#1a1c33] rounded-xl p-4 space-y-1">
              <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest block font-outfit">Kuota Utama Bulanan</span>
              <h3 class="text-sm font-black text-white font-mono">
                {{ Math.max(0, tokensMax - tokensUsed).toLocaleString('id-ID') }}
                <span class="text-[8px] text-gray-500 font-normal font-sans uppercase"> / {{ tokensMax.toLocaleString('id-ID') }} Token</span>
              </h3>
            </div>

            <div class="bg-[#0c0d16] border border-[#1a1c33] rounded-xl p-4 space-y-1">
              <span class="text-[8px] font-black text-amber-600 uppercase tracking-widest block font-outfit">Saldo Top Up Roll-over</span>
              <h3 class="text-sm font-black text-amber-500 font-mono">
                +{{ aiTokensPurchased.toLocaleString('id-ID') }}
                <span class="text-[8px] text-amber-600 font-normal font-sans uppercase"> Token</span>
              </h3>
            </div>

            <div class="bg-[#0c0d16] border border-[#1a1c33] rounded-xl p-4 space-y-1">
              <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest block font-outfit">Total Kuota Siap Pakai</span>
              <h3 class="text-sm font-black text-white font-mono">
                {{ (Math.max(0, tokensMax - tokensUsed) + aiTokensPurchased).toLocaleString('id-ID') }}
                <span class="text-[8px] text-gray-500 font-normal font-sans uppercase"> Token</span>
              </h3>
            </div>
          </div>

          <!-- Clean Consolidated Transaction History List -->
          <div class="bg-[#0c0d16] border border-[#1a1c33] rounded-xl p-4 md:p-5 flex flex-col shadow-sm">
            <h3 class="text-[9px] font-black text-white uppercase tracking-widest mb-4 font-outfit">Daftar Transaksi Kuota Akademik</h3>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr class="border-b border-[#1a1c33] text-[8px] font-black text-gray-500 uppercase tracking-widest font-outfit">
                    <th class="py-2.5 px-3">Aktivitas</th>
                    <th class="py-2.5 px-3 text-right">Mutasi Token</th>
                    <th class="py-2.5 px-3 text-right font-mono">Waktu</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#1a1c33]/40 text-gray-300">
                  <tr v-if="tokenLogs.length === 0">
                    <td colspan="3" class="py-12 text-center text-gray-650 uppercase font-black tracking-widest font-outfit">Belum ada riwayat pemakaian token.</td>
                  </tr>
                  <tr v-else v-for="log in tokenLogs" :key="log.id" class="hover:bg-[#131526] transition-colors">
                    <td class="py-3 px-3 leading-normal">
                      <div class="font-bold text-white text-[10px] font-outfit">
                        {{ log.activityType === 'TOP_UP' ? 'Pengisian Kuota (QRIS Instant Topup)' : log.activityType === 'ALCHEMIST_SUMMARY' ? `Rangkuman AI Modul Sesi ${log.sessionNumber || 1}` : `Generasi Jawaban Tugas Sesi ${log.sessionNumber || 1}` }}
                      </div>
                      <div class="text-[8px] text-gray-500 font-medium uppercase font-mono mt-0.5 truncate max-w-xs md:max-w-md">
                        {{ log.courseName }}
                      </div>
                    </td>
                    <td class="py-3 px-3 text-right font-black font-mono text-[10px]" :class="log.tokensSwapped > 0 ? 'text-emerald-400' : 'text-red-400'">
                      {{ log.tokensSwapped > 0 ? '+' : '' }}{{ log.tokensSwapped.toLocaleString('id-ID') }}
                    </td>
                    <td class="py-3 px-3 text-right text-[8.5px] text-gray-500 font-mono">
                      {{ formatTimeAgo(log.createdAt) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TAB 2: MAIN DASHBOARD VIEW -->
        <template v-else>
          
          <!-- COCKPIT MISSION CONTROL (No Course Selected) -->
          <div v-if="!selectedCourse" class="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto max-w-4xl mx-auto w-full space-y-6">
            
            <!-- Welcome Card -->
            <div class="bg-[#0c0d16] border border-[#1a1c33] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="space-y-2 text-center md:text-left">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#131526] border border-[#1a1c33] text-gray-300 text-[8px] font-black uppercase tracking-widest rounded-full font-mono">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>SYSTEM ACTIVE</span>
                </div>
                <h2 class="text-sm font-black text-white tracking-wider uppercase font-outfit">
                  Pusat Kendali Akademik Kaizora
                </h2>
                <p class="text-xs text-gray-400 max-w-md leading-relaxed">
                  Silakan hubungkan akun e-learning Moodle Anda atau pilih salah satu mata kuliah di bilah navigasi kiri untuk memulai pengerjaan otomatis dan ringkasan.
                </p>
              </div>
              
              <button 
                @click="triggerResync"
                class="px-4 py-2.5 bg-[#131526] hover:bg-[#1c1e36] text-white border border-[#1a1c33] font-black text-[9px] uppercase tracking-widest rounded-xl shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-2 font-outfit"
              >
                <span>Sinkronisasi Data Moodle</span>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>

            <!-- Dashboard Center Matrix -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-[#0c0d16] border border-[#1a1c33] p-4 rounded-xl space-y-1">
                <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest font-outfit">Enkripsi Tunnel</span>
                <h4 class="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-outfit">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>SSL Bridge Secured</span>
                </h4>
              </div>

              <div class="bg-[#0c0d16] border border-[#1a1c33] p-4 rounded-xl space-y-1">
                <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest font-outfit">Mata Kuliah</span>
                <h4 class="text-[10px] font-bold text-white font-outfit">
                  {{ courses.length }} Kelas Terhubung
                </h4>
              </div>

              <div class="bg-[#0c0d16] border border-[#1a1c33] p-4 rounded-xl space-y-1">
                <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest font-outfit">AI Model Core</span>
                <h4 class="text-[10px] font-bold text-white uppercase tracking-wider font-outfit">
                  Kaizora Engine v2.5
                </h4>
              </div>
            </div>

            <!-- Operational System Logs Feed -->
            <div class="bg-[#0c0d16] border border-[#1a1c33] rounded-xl p-5 flex flex-col space-y-3">
              <div class="flex items-center justify-between border-b border-[#1a1c33] pb-2.5">
                <span class="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 font-outfit">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Console Log Terowongan Kaizora</span>
                </span>
                <span class="text-[8px] text-gray-550 font-mono uppercase font-bold">Secure Connection</span>
              </div>
              
              <div class="font-mono text-[9px] space-y-1.5 max-h-[120px] overflow-y-auto pr-1 text-gray-400">
                <div class="flex items-start gap-2 leading-relaxed">
                  <span class="text-zinc-500 shrink-0 select-none">[02:00:55]</span>
                  <span>Jembatan SSL ke elearning.ut.ac.id berhasil diverifikasi.</span>
                </div>
                <div class="flex items-start gap-2 leading-relaxed">
                  <span class="text-zinc-500 shrink-0 select-none">[02:00:56]</span>
                  <span>Mesin Pareto AI siap merangkum buku materi pokok (BMP).</span>
                </div>
              </div>
            </div>

          </div>

          <!-- SELECTED COURSE WORKSPACE (Premium Segmented Horizontal Sessions Dashboard) -->
          <div v-else class="flex-1 flex flex-col md:overflow-hidden w-full">
            
            <!-- Sleek Workspace Header Bar -->
            <div class="px-4 md:px-6 py-4 border-b border-[#1a1c33] bg-[#0c0d16] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
              <div>
                <h2 class="text-xs font-black text-white leading-tight uppercase tracking-wider flex items-center gap-2 font-outfit">
                  <svg class="w-4 h-4 text-purple-400/80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span>{{ selectedCourse.name }}</span>
                </h2>
                <span class="text-[8px] text-gray-500 font-extrabold tracking-widest uppercase block mt-1.5 font-outfit">
                  Penyaringan Sesi Mingguan (Minggu 1 - 8)
                </span>
              </div>
              
              <!-- Control Bypass Action Buttons -->
              <div class="flex items-center flex-wrap gap-2 shrink-0">

                
                <button 
                  @click="markAllActivitiesDone(selectedCourse)"
                  :disabled="isMarkingAllDone"
                  class="px-2.5 py-1.5 bg-blue-950/20 hover:bg-blue-900/20 border border-blue-500/20 text-blue-400 font-black text-[9px] uppercase tracking-widest rounded-xl cursor-pointer disabled:opacity-50 flex items-center gap-1 transition-all duration-100 active:scale-95 font-outfit"
                >
                  <span v-if="isMarkingAllDone" class="w-2.5 h-2.5 rounded-full border-blue-400/20 border-t-blue-400 animate-spin shrink-0"></span>
                  <span>Tandai Selesai</span>
                </button>

                <!-- Session Count Badge -->
                <div class="bg-[#131526] border border-[#1a1c33] px-2.5 py-1 rounded-xl text-center min-w-[40px] font-mono leading-none">
                  <span class="block text-xs font-black text-white">{{ sessions.length }}</span>
                  <span class="text-[5px] text-gray-500 uppercase font-black block mt-0.5 font-outfit">Sesi</span>
                </div>
              </div>
            </div>

            <!-- Segmented Horizontal Session Tab Selector (High Fidelity) -->
            <div class="px-4 md:px-6 py-2.5 bg-[#0c0d16] border-b border-[#1a1c33] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 z-10">
              <button 
                v-for="(session, idx) in sessions" 
                :key="session.id"
                @click="selectedSessionIndex = idx"
                :class="[
                  'px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-100 shrink-0 border cursor-pointer active:scale-95 font-outfit',
                  selectedSessionIndex === idx 
                    ? 'bg-[#131526] border-purple-500/30 text-purple-350 shadow-sm' 
                    : 'bg-[#05050a] border-[#1a1c33] text-gray-500 hover:text-gray-300'
                ]"
              >
                Sesi {{ session.sessionNumber }}
              </button>
            </div>

            <!-- Active Single Session Panel -->
            <div class="flex-1 overflow-y-auto p-4 md:p-5 relative">
              <div v-if="loadingSessions" class="space-y-4">
                <div class="h-32 bg-[#0c0d16] border border-[#1a1c33] rounded-xl animate-pulse"></div>
              </div>

              <div v-else-if="sessions.length === 0" class="text-center py-16 text-[10px] text-gray-500 uppercase tracking-widest font-outfit">
                Tidak ada data sesi untuk mata kuliah ini. Jalankan Sync Moodle.
              </div>

              <!-- Active Session Card -->
              <div 
                v-else-if="sessions[selectedSessionIndex]"
                class="bg-[#0c0d16] rounded-xl border border-[#1a1c33] overflow-hidden shadow-sm"
              >
                <!-- Session Card Header: Single Session Summary Button -->
                <div class="px-5 py-3.5 bg-[#101221] border-b border-[#1a1c33] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <span class="text-[8px] font-black bg-[#131526] border border-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-mono uppercase tracking-widest shrink-0">
                      MINGGU {{ sessions[selectedSessionIndex].sessionNumber }}
                    </span>
                    <h4 class="text-xs font-black text-white uppercase tracking-wider font-outfit">{{ sessions[selectedSessionIndex].title }}</h4>
                  </div>

                  <!-- SINGLE SESSION SUMMARY AI BUTTON -->
                  <button 
                    v-if="sessions[selectedSessionIndex].materials && sessions[selectedSessionIndex].materials.length > 0"
                    @click="openSessionSummary(sessions[selectedSessionIndex])"
                    class="px-3 py-1.5 bg-[#131526] hover:bg-[#1c1e36] border border-[#1a1c33] hover:border-purple-500/20 text-white font-black text-[9px] uppercase tracking-widest rounded-lg cursor-pointer transition-all duration-100 active:scale-95 flex items-center gap-1.5 shrink-0 font-outfit"
                  >
                    <svg class="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    <span>Rangkum Semua Materi (AI)</span>
                  </button>
                </div>

                <!-- Session Grid layout (Materials left, Tasks right) -->
                <div class="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  <!-- COLUMN LEFT: Materials list (Extremely Compact, Clean) -->
                  <div class="space-y-3">
                    <h5 class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-outfit">
                      <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                      <span>Materi Kuliah & Modul</span>
                    </h5>

                    <div v-if="!sessions[selectedSessionIndex].materials || sessions[selectedSessionIndex].materials.length === 0" class="text-[9px] text-gray-550 font-mono italic uppercase tracking-wider">
                      Tidak ada materi terlampir.
                    </div>

                    <div 
                      v-else
                      class="divide-y divide-[#1a1c33] border border-[#1a1c33] rounded-xl overflow-hidden bg-[#05050a]"
                    >
                      <div 
                        v-for="material in sessions[selectedSessionIndex].materials" 
                        :key="material.id"
                        class="p-3 flex items-center justify-between gap-3 hover:bg-[#131526]/30 transition-colors"
                      >
                        <div class="flex items-start gap-2">
                          <span class="text-[7.5px] font-black text-gray-500 uppercase tracking-widest font-mono shrink-0">[{{ material.type }}]</span>
                          <span class="text-[10px] font-medium text-gray-200 leading-snug">{{ material.title }}</span>
                        </div>
                        
                        <a 
                          :href="material.originalUrl" 
                          target="_blank"
                          class="text-[8px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest hover:underline shrink-0 cursor-pointer flex items-center gap-0.5 font-mono"
                        >
                          <span>Moodle</span>
                          <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  <!-- COLUMN RIGHT: Tasks & Forums (Outline Buttons, Neat) -->
                  <div class="space-y-4">
                    <h5 class="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-outfit">
                      <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-3.658C3.03 15.938 2.25 14.07 2.25 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                      </svg>
                      <span>Tugas & Diskusi Moodle</span>
                    </h5>

                    <div v-if="!sessions[selectedSessionIndex].tasks || sessions[selectedSessionIndex].tasks.length === 0" class="text-[9px] text-gray-550 font-mono italic uppercase tracking-wider">
                      Tidak ada tugas/diskusi di sesi ini.
                    </div>

                    <div 
                      v-else
                      v-for="task in sessions[selectedSessionIndex].tasks" 
                      :key="task.id"
                      class="bg-[#05050a] border border-[#1a1c33] rounded-xl p-4 space-y-3"
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div class="w-full">
                          <div class="flex items-center justify-between gap-2 mb-2">
                            <div class="flex items-center gap-1.5">
                              <span :class="[
                                'text-[7.5px] font-black px-2 py-0.5 rounded uppercase tracking-wider border font-outfit',
                                task.type === 'Diskusi' ? 'bg-[#131526] text-purple-300 border-purple-500/20' : 
                                task.type === 'Absensi' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20' :
                                'bg-orange-950/20 text-orange-400 border-orange-500/20'
                              ]">
                                {{ task.type }}
                              </span>
                              
                              <span :class="[
                                'text-[7.5px] font-black px-2 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1 font-outfit',
                                task.status === 'drafted' ? 'bg-[#131526] border-purple-500/20 text-purple-300' : 
                                task.status === 'submitted' ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400' : 
                                'bg-[#181a30] border-[#2b2c3d] text-gray-500'
                              ]">
                                <svg v-if="task.status === 'submitted'" class="w-2.5 h-2.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                <svg v-else class="w-2.5 h-2.5 text-current shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <span>
                                  {{ task.type === 'Absensi' && task.status === 'drafted' ? 'Selesai' : 
                                     task.status === 'submitted' ? 'Terkirim' : 
                                     task.status === 'drafted' ? 'Draf Siap' : 'Pending' }}
                                </span>
                              </span>
                            </div>
                            <span v-if="task.deadline" class="text-[7.5px] text-gray-550 font-mono font-bold uppercase">
                              Deadline: {{ formatDate(task.deadline) }}
                            </span>
                          </div>
                          <span class="text-[11px] font-bold text-white block leading-snug font-outfit">{{ task.title }}</span>
                          
                          <!-- Assignment Description -->
                          <div v-if="task.description" class="mt-2 text-[9.5px] text-gray-300 leading-relaxed bg-[#0c0d16] border-l-2 border-purple-500/30 pl-3.5 py-3 pr-2.5 max-h-[350px] overflow-y-auto font-sans description-html rounded-r-lg" v-html="formatDescription(task.description)"></div>
                        </div>
                      </div>

                      <!-- Actions (Clean Outline Design) -->
                      <div class="pt-2.5 border-t border-[#1a1c33] flex flex-col gap-2">
                        <a 
                          v-if="task.type === 'Absensi'"
                          :href="task.url"
                          target="_blank"
                          class="w-full text-center py-2.5 px-3 bg-emerald-950/20 hover:bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 font-black text-[9px] uppercase tracking-widest rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-[0.98] font-outfit no-underline"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                          <span>Isi Absensi di Elearning UT</span>
                        </a>

                        <button 
                          v-if="task.type !== 'Absensi'"
                          @click="generateDraft(task)"
                          :disabled="draftingTasks[task.id]"
                          class="w-full text-center py-2 px-3 bg-[#0c0d16] hover:bg-[#131526] border border-[#1a1c33] hover:border-purple-500/20 text-gray-300 hover:text-white font-black text-[9px] uppercase tracking-widest rounded-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98] font-outfit"
                        >
                          <span v-if="draftingTasks[task.id]" class="w-3 h-3 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                          <span>{{ draftingTasks[task.id] ? 'Generating Draft...' : (task.ai_draft_answer ? 'Lihat / Buat Ulang Draf AI' : 'Generate Draf Akademis AI') }}</span>
                        </button>

                        <button
                          v-if="task.type === 'Tugas'"
                          @click="openAssignmentModal(task, sessions[selectedSessionIndex])"
                          class="w-full text-center py-2 px-3 bg-emerald-950/20 hover:bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 font-black text-[9px] uppercase tracking-widest rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-1.5 font-outfit"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                          </svg>
                          <span>{{ task.status === 'submitted' ? 'Kirim Ulang File Tugas' : 'Unggah & Kirim Tugas' }}</span>
                        </button>

                        <!-- Solid AI Draft Box Console -->
                        <div v-if="task.ai_draft_answer" class="bg-[#0c0d16] rounded-xl p-3 border border-[#1a1c33] mt-1 space-y-2">
                          <div class="flex items-center justify-between mb-1 border-b border-[#1a1c33] pb-2">
                            <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest font-outfit">
                              {{ task.type === 'Absensi' ? 'Bypass Engine Log' : 'Draf Jawaban Asisten AI' }}
                            </span>
                            <div class="flex items-center gap-2.5 font-mono">
                              <button 
                                v-if="task.type === 'Tugas'"
                                @click="downloadDraftAsPDF(task)"
                                class="text-[8px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-widest cursor-pointer hover:underline flex items-center gap-0.5 font-outfit"
                              >
                                <span>Cetak PDF</span>
                              </button>
                              <button 
                                v-if="task.type !== 'Absensi'"
                                @click="copyText(task.ai_draft_answer)"
                                class="text-[8px] text-gray-400 hover:text-white font-bold uppercase tracking-widest cursor-pointer hover:underline font-outfit"
                              >
                                Salin
                              </button>
                            </div>
                          </div>
                          
                          <!-- Tab Toggler for Monospace Editor vs Visual Preview -->
                          <div v-if="task.type !== 'Absensi'" class="flex items-center gap-1 bg-[#05050a] p-1 border border-[#1a1c33] rounded-lg self-start mb-2 w-max">
                            <button 
                              @click="setActiveTab(task.id, 'edit')"
                              :class="[
                                'px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-md cursor-pointer transition-all duration-100 font-outfit border border-transparent',
                                getActiveTab(task.id) === 'edit' ? 'bg-[#131526] text-purple-300 border-[#1a1c33]' : 'text-gray-500 hover:text-gray-300'
                              ]"
                            >
                              Tulis (Editor)
                            </button>
                            <button 
                              @click="setActiveTab(task.id, 'preview')"
                              :class="[
                                'px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-md cursor-pointer transition-all duration-100 font-outfit border border-transparent',
                                getActiveTab(task.id) === 'preview' ? 'bg-[#131526] text-purple-300 border-[#1a1c33]' : 'text-gray-500 hover:text-gray-300'
                              ]"
                            >
                              Pratinjau (Visual)
                            </button>
                          </div>

                          <textarea
                            v-if="task.type !== 'Absensi' && getActiveTab(task.id) === 'edit'"
                            v-model="task.ai_draft_answer"
                            rows="18"
                            class="w-full bg-[#05050a] border border-[#1a1c33] focus:border-purple-500/20 rounded-xl p-4 text-[10px] text-gray-300 leading-relaxed focus:outline-none resize-y min-h-[420px] font-mono"
                            placeholder="Edit draf jawaban akademik Anda di sini..."
                          ></textarea>
                          <div 
                            v-else-if="task.type !== 'Absensi' && getActiveTab(task.id) === 'preview'"
                            v-html="renderDraftPreviewHtml(task.ai_draft_answer)"
                            class="w-full bg-[#05050a] border border-[#1a1c33] rounded-xl p-4 text-[10px] text-gray-200 leading-relaxed min-h-[420px] overflow-y-auto select-text preview-content"
                          ></div>
                          <p 
                            v-else
                            class="text-[9px] text-emerald-400 whitespace-pre-wrap leading-relaxed pr-1 font-mono uppercase font-bold p-3 bg-[#05050a] border border-[#1a1c33] rounded-xl"
                          >
                            {{ task.ai_draft_answer }}
                          </p>
                          
                          <!-- Kirim ke Moodle Button -->
                          <button
                            v-if="task.type === 'Diskusi'"
                            @click="openDiscussionModal(task, sessions[selectedSessionIndex])"
                            class="mt-2 w-full text-center py-2 px-3 bg-[#131526] hover:bg-[#1c1e36] border border-[#1a1c33] hover:border-purple-500/20 text-purple-300 font-black text-[9px] uppercase tracking-widest rounded-lg transition-all duration-100 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 font-outfit"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                            <span>{{ task.status === 'submitted' ? 'Kirim Ulang ke Moodle' : 'Kirim ke Moodle' }}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </template>
      </main>
    </div>

    <!-- 3. PREMIUM SESSION SUMMARY MODAL (100% Solid Opaque Backdrop & Container, Zero Glass) -->
    <div v-if="activeSessionSummary" class="fixed inset-0 bg-[#05050a]/95 z-50 flex items-center justify-center p-4">
      <div class="w-full max-w-3xl bg-[#0c0d16] border border-[#1a1c33] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-[#1a1c33] flex items-center justify-between shrink-0 bg-[#101221]">
          <div>
            <span class="text-[8px] font-black uppercase tracking-widest text-purple-400 bg-[#131526] border border-purple-500/20 px-2.5 py-1 rounded font-mono">
              SESI {{ activeSessionSummary.sessionNumber }} • AI PARETO 20% SYNTHESIS ENGINE
            </span>
            <h3 class="text-xs font-black text-white mt-2 leading-snug uppercase tracking-wider font-outfit">Ringkasan Materi Sesi</h3>
          </div>
          <button @click="activeSessionSummary = null" class="text-gray-500 hover:text-white cursor-pointer transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Materials horizontal tabs -->
        <div class="px-6 py-2.5 bg-[#0c0d16] border-b border-[#1a1c33] flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          <button 
            v-for="(material, mIdx) in activeSessionSummary.materials" 
            :key="material.id"
            @click="activeSummaryMaterialIdx = mIdx"
            :class="[
              'px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-100 shrink-0 border cursor-pointer active:scale-95 font-outfit',
              activeSummaryMaterialIdx === mIdx 
                ? 'bg-[#131526] border-purple-500/20 text-purple-300' 
                : 'bg-[#05050a] border-[#1a1c33] text-gray-500 hover:text-gray-300'
            ]"
          >
            {{ material.title }}
          </button>
        </div>

        <!-- Body Summary Content -->
        <div class="p-6 overflow-y-auto flex-1 text-xs leading-relaxed text-gray-300 bg-[#05050a]">
          <div v-if="activeSessionSummary.materials.length === 0" class="text-center py-12 text-gray-500 uppercase tracking-widest text-[9px] font-black font-outfit">
            Tidak ada materi untuk dirangkum di sesi ini.
          </div>
          <div v-else>
            <div v-if="!activeSessionSummary.materials[activeSummaryMaterialIdx].aiSummaryText" class="text-center py-12 space-y-3">
              <div class="w-8 h-8 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin mx-auto"></div>
              <p class="text-[9px] text-gray-500 uppercase tracking-widest font-black font-mono">Menyusun ringkasan Pareto... Mohon tunggu.</p>
            </div>
            <div v-else class="whitespace-pre-wrap leading-relaxed select-text text-gray-300">
              {{ activeSessionSummary.materials[activeSummaryMaterialIdx].aiSummaryText }}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-[#1a1c33] bg-[#0c0d16] flex justify-end shrink-0">
          <button 
            @click="activeSessionSummary = null"
            class="px-5 py-2 bg-[#131526] text-gray-400 hover:text-white font-black text-[10px] uppercase tracking-widest rounded-xl cursor-pointer transition-all duration-100 active:scale-95 border border-[#1a1c33] font-outfit"
          >
            Selesai Membaca
          </button>
        </div>
      </div>
    </div>

    <!-- 4. DISCUSSION REPLY MODAL (Solid Opaque, Zero Glass) -->
    <div v-if="activeDiscussionTask" class="fixed inset-0 bg-[#05050a]/95 z-55 flex items-center justify-center p-4">
      <div class="w-full max-w-3xl bg-[#0c0d16] border border-[#1a1c33] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-[#1a1c33] flex items-center justify-between shrink-0 bg-[#101221]">
          <div>
            <span class="text-[8px] font-black uppercase tracking-widest text-purple-400 bg-[#131526] border border-purple-500/20 px-2.5 py-1 rounded font-mono">
              FORM KIRIM DISKUSI MOODLE
            </span>
            <h3 class="text-xs font-black text-white mt-2 leading-snug uppercase tracking-wider font-outfit">{{ activeDiscussionTask.title }}</h3>
            <p class="text-[9px] text-gray-550 mt-1 uppercase font-bold tracking-wider font-mono">Sesi {{ activeDiscussionSession?.sessionNumber }} • {{ selectedCourse.name }}</p>
          </div>
          <button @click="closeDiscussionModal" class="text-gray-500 hover:text-white cursor-pointer transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-4">
          <!-- Soal Diskusi -->
          <div class="space-y-2">
            <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-outfit">
              <span>Topik Soal Diskusi:</span>
            </label>
            <div v-if="activeDiscussionTask.description" class="bg-[#05050a] border border-[#1a1c33] rounded-xl p-4 max-h-[140px] overflow-y-auto text-xs text-gray-300 leading-relaxed description-html" v-html="formatDescription(activeDiscussionTask.description)"></div>
            <div v-else class="bg-[#05050a] border border-[#1a1c33] rounded-xl p-4 max-h-[140px] overflow-y-auto text-xs text-gray-500 leading-relaxed uppercase tracking-widest font-black text-center py-6 font-outfit text-[9px]">Tidak ada deskripsi/soal tersemat.</div>
          </div>

          <!-- Text Editor -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-outfit">
                  <span>Jawaban Diskusi Anda:</span>
                </label>
                <!-- Tab Toggler in Modal -->
                <div class="flex items-center gap-0.5 bg-[#05050a] p-0.5 border border-[#1a1c33] rounded-lg">
                  <button 
                    @click="activeModalTab = 'edit'"
                    :class="[
                      'px-2 py-1 text-[7px] font-black uppercase tracking-widest rounded-md cursor-pointer transition-all duration-100 font-outfit border border-transparent',
                      activeModalTab === 'edit' ? 'bg-[#131526] text-purple-300 border-[#1a1c33]' : 'text-gray-500 hover:text-gray-300'
                    ]"
                  >
                    Tulis
                  </button>
                  <button 
                    @click="activeModalTab = 'preview'"
                    :class="[
                      'px-2 py-1 text-[7px] font-black uppercase tracking-widest rounded-md cursor-pointer transition-all duration-100 font-outfit border border-transparent',
                      activeModalTab === 'preview' ? 'bg-[#131526] text-purple-300 border-[#1a1c33]' : 'text-gray-500 hover:text-gray-300'
                    ]"
                  >
                    Pratinjau
                  </button>
                </div>
              </div>
              <button 
                @click="reGenerateModalDraft"
                :disabled="isRegeneratingDraft"
                class="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-[#131526] border border-[#1a1c33] text-purple-300 rounded-lg cursor-pointer flex items-center gap-1 transition-all duration-100 active:scale-95 font-outfit"
              >
                <span v-if="isRegeneratingDraft" class="w-2.5 h-2.5 rounded-full border-2 border-purple-350/20 border-t-purple-350 animate-spin"></span>
                <span>Generate Ulang AI</span>
              </button>
            </div>
            <textarea 
              v-if="activeModalTab === 'edit'"
              v-model="discussionReplyText"
              rows="14"
              class="w-full bg-[#05050a] border border-[#1a1c33] focus:border-purple-500/25 rounded-xl p-4 text-xs text-gray-300 leading-relaxed focus:outline-none font-mono resize-y min-h-[260px]"
              placeholder="Edit draf jawaban akademik Anda di sini..."
            ></textarea>
            <div 
              v-else
              v-html="renderDraftPreviewHtml(discussionReplyText)"
              class="w-full bg-[#05050a] border border-[#1a1c33] rounded-xl p-4 text-xs text-gray-200 leading-relaxed overflow-y-auto select-text preview-content min-h-[260px] max-h-[450px]"
            ></div>
            <div class="flex justify-between items-center text-[8px] text-gray-500 font-mono font-bold uppercase tracking-wider px-1">
              <span>Karakter: {{ discussionReplyText.length }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-[#1a1c33] bg-[#0c0d16] flex items-center justify-between shrink-0">
          <span class="text-[8px] text-amber-500 font-mono uppercase font-bold leading-normal">
            Suntingan diperbolehkan selama 30 menit pasca posting.
          </span>
          <div class="flex items-center gap-2">
            <button 
              @click="closeDiscussionModal"
              class="px-4 py-2 bg-[#131526] text-gray-400 hover:text-white font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition-all duration-100 active:scale-95 border border-[#1a1c33] font-outfit"
            >
              Batal
            </button>
            <button 
              @click="submitDiscussionToMoodle"
              :disabled="isSubmittingDiscussion || !discussionReplyText.trim()"
              class="px-5 py-2 bg-emerald-950/20 hover:bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-widest rounded-xl cursor-pointer flex items-center gap-2 transition-all duration-100 active:scale-95 shadow-sm font-outfit"
            >
              <span v-if="isSubmittingDiscussion" class="w-3 h-3 rounded-full border border-white/20 border-t-white animate-spin"></span>
              <span>Kirim ke Moodle</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. ASSIGNMENT SUBMISSION MODAL (Solid Opaque, Zero Glass) -->
    <div v-if="activeAssignmentTask" class="fixed inset-0 bg-[#05050a]/95 z-55 flex items-center justify-center p-4">
      <div class="w-full max-w-xl bg-[#0c0d16] border border-[#1a1c33] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-[#1a1c33] flex items-center justify-between shrink-0 bg-[#101221]">
          <div>
            <span class="text-[8px] font-black uppercase tracking-widest text-orange-400 bg-orange-950/20 border border-orange-500/20 px-2.5 py-1 rounded font-mono">
              UNGKAH TUGAS AKADEMIK MOODLE
            </span>
            <h3 class="text-xs font-black text-white mt-2 leading-snug uppercase tracking-wider font-outfit">{{ activeAssignmentTask.title }}</h3>
            <p class="text-[9px] text-gray-550 mt-1 uppercase font-bold tracking-wider font-mono">Sesi {{ activeAssignmentSession?.sessionNumber }} • {{ selectedCourse.name }}</p>
          </div>
          <button @click="closeAssignmentModal" class="text-gray-500 hover:text-white cursor-pointer transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-4">
          <!-- File selection zone -->
          <div class="space-y-2">
            <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-outfit">
              <span>Pilih Berkas Tugas (PDF, Word, zip):</span>
            </label>
            
            <div class="flex flex-col items-center justify-center border border-dashed border-[#1a1c33] hover:border-purple-500/25 rounded-xl p-6 bg-[#05050a] relative transition-all duration-100">
              <input 
                type="file" 
                ref="fileInputRef"
                @change="handleFileChange"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.png,.jpg,.jpeg"
              />
              <div class="text-center space-y-2 pointer-events-none">
                <svg class="w-6 h-6 mx-auto text-purple-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                <span class="text-xs text-white block font-bold uppercase tracking-wider font-outfit">
                  {{ selectedFile ? selectedFile.name : 'Pilih Berkas / Seret Kemari' }}
                </span>
                <span class="text-[8px] text-gray-500 block font-mono font-bold uppercase">
                  {{ selectedFile ? `Ukuran: ${(selectedFile.size / 1024).toFixed(1)} KB` : 'Maksimal 10MB • Semua Format Utama' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Formatted Filename Preview -->
          <div v-if="selectedFile" class="space-y-1.5">
            <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest font-outfit">Format Penyimpanan Moodle:</label>
            <div class="bg-[#131526] border border-[#1a1c33] text-purple-300 font-mono text-[9px] p-3 rounded-xl flex items-center justify-between">
              <span class="break-all font-bold">{{ getFormattedFileName() }}</span>
            </div>
          </div>

          <!-- Academic Checklist -->
          <div class="bg-[#05050a] border border-[#1a1c33] p-4 rounded-xl space-y-2">
            <div class="flex items-start gap-2.5">
              <input 
                type="checkbox" 
                id="statement_check" 
                v-model="hasCheckedStatement"
                class="w-4 h-4 mt-0.5 text-purple-600 border-[#1a1c33] rounded focus:ring-purple-500 bg-black cursor-pointer"
              />
              <label for="statement_check" class="text-[9px] text-gray-300 leading-normal cursor-pointer font-bold select-none uppercase tracking-wide font-outfit">
                "This submission is my own work, except where I have acknowledged the use of the works of other people."
              </label>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-[#1a1c33] bg-[#0c0d16] flex items-center justify-between shrink-0">
          <span class="text-[8px] text-amber-500 font-mono uppercase font-bold">
            Verifikasi format berkas sebelum diunggah.
          </span>
          <div class="flex items-center gap-2">
            <button 
              @click="closeAssignmentModal"
              class="px-4 py-2 bg-[#131526] text-gray-400 hover:text-white font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition-all duration-100 active:scale-95 border border-[#1a1c33] font-outfit"
            >
              Batal
            </button>
            <button 
              @click="submitAssignmentToMoodle"
              :disabled="isSubmittingAssignment || !selectedFile || !hasCheckedStatement"
              class="px-5 py-2 bg-emerald-950/20 hover:bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-widest rounded-xl cursor-pointer flex items-center gap-2 transition-all duration-100 active:scale-95 shadow-sm font-outfit"
            >
              <span v-if="isSubmittingAssignment" class="w-3 h-3 rounded-full border border-white/20 border-t-white animate-spin"></span>
              <span>Upload & Kirim</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. ACADEMIC PROFILE SETTINGS MODAL (Solid Opaque, Zero Glass) -->
    <div v-if="isProfileModalOpen" class="fixed inset-0 bg-[#05050a]/95 z-55 flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-[#0c0d16] border border-[#1a1c33] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-[#1a1c33] flex items-center justify-between bg-[#101221]">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <h3 class="text-xs font-black text-white uppercase tracking-wider font-outfit">Pengaturan Profil Akademik</h3>
          </div>
          <button @click="isProfileModalOpen = false" class="text-gray-500 hover:text-white cursor-pointer transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="saveProfile" class="p-6 space-y-4 bg-[#05050a]">
          <div class="space-y-1.5">
            <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest font-outfit">Nama Lengkap:</label>
            <input 
              type="text" 
              v-model="studentName" 
              placeholder="Masukkan nama lengkap Anda"
              class="w-full bg-[#0c0d16] border border-[#1a1c33] focus:border-purple-500/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none transition-all font-medium"
              required
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest font-outfit">NIM (Nomor Induk Mahasiswa):</label>
            <input 
              type="text" 
              v-model="studentNIM" 
              placeholder="Masukkan NIM Anda"
              class="w-full bg-[#0c0d16] border border-[#1a1c33] focus:border-purple-500/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none transition-all font-mono"
              required
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest font-outfit">Program Studi:</label>
            <input 
              type="text" 
              v-model="studentProdi" 
              placeholder="Masukkan program studi Anda"
              class="w-full bg-[#0c0d16] border border-[#1a1c33] focus:border-purple-500/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none transition-all font-medium"
              required
            />
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-[#1a1c33] flex items-center justify-end gap-2 bg-[#0c0d16] -mx-6 -mb-6 p-6">
            <button 
              type="button"
              @click="isProfileModalOpen = false"
              class="px-4 py-2 bg-[#131526] text-gray-400 hover:text-white font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition-all duration-100 active:scale-95 border border-[#1a1c33] font-outfit"
            >
              Batal
            </button>
            <button 
              type="submit"
              class="px-5 py-2 bg-emerald-950/20 hover:bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-widest rounded-xl cursor-pointer transition-all duration-100 active:scale-95 shadow-sm font-outfit"
            >
              Simpan Profil
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 7. FULL PAGE SYNCING OVERLAY (Solid Opaque, Zero Glass) -->
    <div v-if="isSyncingOverlay" class="fixed inset-0 bg-[#05050a]/98 z-55 flex flex-col items-center justify-center p-4">
      <div class="relative w-12 h-12 mb-6">
        <div class="absolute inset-0 rounded-full border-4 border-purple-500/10"></div>
        <div class="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin"></div>
      </div>
      <h3 class="text-xs font-black text-white uppercase tracking-wider mb-1 animate-pulse font-outfit">Menyinkronkan Moodle UT...</h3>
      <p class="text-[9px] text-gray-550 text-center max-w-xs leading-relaxed mb-4 uppercase font-bold tracking-wider font-mono">
        Bypass Moodle aktif. Mohon tunggu proses sinkronisasi hingga tuntas.
      </p>
    </div>

    <!-- 7B. CONVERSATIONAL KAIZORA AI WORKFLOW MODAL (3-Fase Workflow Blueprint, Premium Dark Theme) -->
    <div v-if="activeAiSessionTask" class="fixed inset-0 bg-[#05050a]/95 z-55 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl bg-[#0c0d16] border border-[#1a1c33] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-[#1a1c33] flex items-center justify-between shrink-0 bg-[#101221]">
          <div>
            <span class="text-[8px] font-black uppercase tracking-widest text-purple-400 bg-[#131526] border border-purple-500/20 px-2.5 py-1 rounded font-mono">
              HUMANIZED ACADEMIC ARCHITECT
            </span>
            <h3 class="text-xs font-black text-white mt-2 leading-snug uppercase tracking-wider font-outfit">
              {{ activeAiSessionTask.title }}
            </h3>
            <p class="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-wider font-mono">
              Fase aktif: 
              <span v-if="activeAiSessionState === 'idle' || activeAiSessionState === 'interrogation'" class="text-purple-400">1. Form Konteks (Interogasi)</span>
              <span v-else-if="activeAiSessionState === 'activation'" class="text-amber-400">2. Aktivasi Otak (Soal Uji Nalar)</span>
              <span v-else-if="activeAiSessionState === 'evaluated'" class="text-emerald-400">3. Hasil Draf Akademis Humanized</span>
            </p>
          </div>
          <button @click="closeAiSessionModal" class="text-gray-500 hover:text-white cursor-pointer transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-5 bg-[#05050a]">
          <!-- Top Instructions / Socratic Concept Banner -->
          <div class="p-3.5 bg-[#0c0d16] border border-[#1a1c33] rounded-xl flex items-start gap-3">
            <div class="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div class="text-[10px] leading-relaxed text-gray-400">
              <strong class="text-white block uppercase tracking-wide text-[9px] mb-0.5">Sistem Anti-Copas & Humanisasi Akademik</strong>
              Membantu merakit tulisan orisinal yang merefleksikan karakter dan pemikiran Anda. Masukan data lokal dan logika Anda akan diolah secara murni demi menghindari degradasi kognitif dan 100% lolos deteksi AI.
            </div>
          </div>

          <!-- ================= FASE 1: INTEROGASI (FORM) ================= -->
          <div v-if="activeAiSessionState === 'idle' || activeAiSessionState === 'interrogation'" class="space-y-4">
            <h4 class="text-[10px] font-black text-white uppercase tracking-widest border-b border-[#1a1c33] pb-1.5 font-outfit">Isi Form Konteks</h4>
            
            <!-- 1. Gaya Tulisan -->
            <div class="space-y-2">
              <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest font-outfit block">1. Gaya Tulisan yang Diinginkan</label>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  v-for="styleOpt in ['Analitis-Tajam', 'Santai-Mengalir tapi kritis', 'Formal-Akademik']" 
                  :key="styleOpt"
                  @click="aiContextForm.style = styleOpt"
                  type="button"
                  :class="[
                    'py-2 px-3 text-[9px] font-bold uppercase tracking-wider rounded-lg border text-center transition-all cursor-pointer font-outfit',
                    aiContextForm.style === styleOpt 
                      ? 'bg-[#131526] border-purple-500/30 text-purple-300 shadow-sm'
                      : 'bg-[#0c0d16] border-[#1a1c33] text-gray-500 hover:text-gray-300'
                  ]"
                >
                  {{ styleOpt }}
                </button>
              </div>
              <input 
                type="text" 
                v-model="aiContextForm.style"
                class="w-full bg-[#0c0d16] border border-[#1a1c33] focus:border-purple-500/25 rounded-lg px-3 py-2 text-[10px] text-gray-300 focus:outline-none placeholder-gray-650"
                placeholder="Atau tulis gaya tulisan kustom sendiri..."
              />
            </div>

            <!-- 2. Sudut Pandang -->
            <div class="space-y-2">
              <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest font-outfit block">2. Sudut Pandang Pribadi</label>
              <textarea 
                v-model="aiContextForm.perspective"
                rows="3"
                class="w-full bg-[#0c0d16] border border-[#1a1c33] focus:border-purple-500/25 rounded-xl p-3 text-[10px] text-gray-300 leading-relaxed focus:outline-none resize-none"
                placeholder="Apa pendapat, perspektif unik, atau keresahan pribadimu mengenai topik ini? (Contoh: 'Saya rasa kebijakan ini kurang berpihak pada rakyat kecil karena...')"
              ></textarea>
            </div>

            <!-- 3. Contoh Nyata / Lokal -->
            <div class="space-y-2">
              <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest font-outfit block">3. Contoh Nyata / Lokal di Sekitarmu</label>
              <textarea 
                v-model="aiContextForm.localExample"
                rows="2"
                class="w-full bg-[#0c0d16] border border-[#1a1c33] focus:border-purple-500/25 rounded-xl p-3 text-[10px] text-gray-300 leading-relaxed focus:outline-none resize-none"
                placeholder="Sebutkan 1 atau 2 contoh kasus nyata di lingkunganmu atau kejadian aktual untuk dimasukkan sebagai argumen lokal kuat."
              ></textarea>
            </div>

            <!-- Submit Form -->
            <button 
              @click="submitContextForm"
              :disabled="isProcessingWorkflow || !aiContextForm.style || !aiContextForm.perspective"
              class="w-full text-center py-2.5 px-4 bg-purple-950/20 hover:bg-purple-900/25 border border-purple-500/25 text-purple-300 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all duration-100 active:scale-98 cursor-pointer flex items-center justify-center gap-2 font-outfit disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isProcessingWorkflow" class="w-3.5 h-3.5 rounded-full border-2 border-purple-300/20 border-t-purple-300 animate-spin"></span>
              <span>{{ isProcessingWorkflow ? 'Menganalisis Konteks...' : 'Lanjut ke Aktivasi Otak (Uji Nalar)' }}</span>
            </button>
          </div>

          <!-- ================= FASE 2: AKTIVASI OTAK (SOAL UJI NALAR) ================= -->
          <div v-else-if="activeAiSessionState === 'activation'" class="space-y-4">
            <div class="flex items-center justify-between border-b border-[#1a1c33] pb-1.5">
              <h4 class="text-[10px] font-black text-white uppercase tracking-widest font-outfit">Socratic Brain Activation</h4>
              <button 
                @click="resetAiWorkflow"
                class="text-[7.5px] font-black text-rose-400 hover:text-rose-300 uppercase tracking-widest font-outfit bg-rose-950/10 px-2 py-1 border border-rose-500/10 rounded cursor-pointer"
              >
                Reset & Isi Ulang Form
              </button>
            </div>
            
            <p class="text-[10px] leading-relaxed text-purple-300 font-outfit">
              Hebat! Konteks personalmu berhasil diserap. Sebelum draf tulisan di-generate, silakan selesaikan tantangan logika 1 soal berikut demi memperkuat argumen tugasmu:
            </p>

            <!-- The Question Box -->
            <div class="bg-[#0c0d16] border border-[#1a1c33] p-4.5 rounded-xl space-y-1">
              <span class="text-[8px] font-black text-amber-500 uppercase tracking-widest font-mono">Soal Uji Nalar:</span>
              <p class="text-xs text-white leading-relaxed font-bold font-outfit whitespace-pre-line select-text">
                {{ activeAiSocraticQuestion }}
              </p>
            </div>

            <!-- Answer Input -->
            <div class="space-y-2">
              <label class="text-[8px] font-black text-gray-400 uppercase tracking-widest font-outfit block">Jawaban / Argumen Singkat Anda</label>
              <textarea 
                v-model="aiSocraticAnswer"
                rows="4"
                class="w-full bg-[#0c0d16] border border-[#1a1c33] focus:border-purple-500/25 rounded-xl p-3.5 text-[10px] text-gray-255 leading-relaxed focus:outline-none resize-none font-sans"
                placeholder="Ketikkan argumen logis singkat Anda di sini sesuai pemahaman/pendapat orisinal Anda..."
              ></textarea>
            </div>

            <!-- Generate Draft Button -->
            <button 
              @click="submitSocraticAnswer"
              :disabled="isProcessingWorkflow || !aiSocraticAnswer.trim()"
              class="w-full text-center py-2.5 px-4 bg-emerald-950/20 hover:bg-emerald-900/25 border border-emerald-500/25 text-emerald-400 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all duration-100 active:scale-98 cursor-pointer flex items-center justify-center gap-2 font-outfit disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isProcessingWorkflow" class="w-3.5 h-3.5 rounded-full border-2 border-emerald-300/20 border-t-emerald-300 animate-spin"></span>
              <span>{{ isProcessingWorkflow ? 'Mengevaluasi & Menulis Draf...' : 'Konfirmasi & Generate Draf Akademis Humanized' }}</span>
            </button>
          </div>

          <!-- ================= FASE 3: HASIL DRAF (PREVIEW & CONSOLE) ================= -->
          <div v-else-if="activeAiSessionState === 'evaluated'" class="space-y-4">
            <div class="flex items-center justify-between border-b border-[#1a1c33] pb-1.5">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <h4 class="text-[10px] font-black text-white uppercase tracking-widest font-outfit">Hasil Draf Akademis Humanized</h4>
              </div>
              <button 
                @click="resetAiWorkflow"
                class="text-[7.5px] font-black text-rose-400 hover:text-rose-300 uppercase tracking-widest font-outfit bg-rose-950/10 px-2.5 py-1 border border-rose-500/10 rounded cursor-pointer transition-all duration-100 active:scale-95"
              >
                Reset & Tulis Ulang Dari Awal
              </button>
            </div>

            <p class="text-[9.5px] text-gray-400 leading-normal">
              Draf berhasil digenerate menggunakan kosakata alami manusia, ritme acak (burstiness), dan telah disuntikkan argumen lokal Anda secara murni. Lolos deteksi AI dan berbobot akademis!
            </p>

            <div class="bg-[#0c0d16] rounded-xl p-3 border border-[#1a1c33] mt-1 space-y-2">
              <div class="flex items-center justify-between mb-1 border-b border-[#1a1c33] pb-2">
                <span class="text-[8px] font-black text-purple-300 uppercase tracking-widest font-outfit">Asisten Draf Akademik AI</span>
                <div class="flex items-center gap-2 font-mono">
                  <button 
                    v-if="activeAiSessionTask.type === 'Tugas'"
                    @click="downloadDraftAsPDF(activeAiSessionTask)"
                    class="text-[8px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-widest cursor-pointer hover:underline font-outfit"
                  >
                    Cetak PDF
                  </button>
                  <button 
                    @click="copyText(activeAiSessionTask.ai_draft_answer)"
                    class="text-[8px] text-gray-400 hover:text-white font-bold uppercase tracking-widest cursor-pointer hover:underline font-outfit"
                  >
                    Salin
                  </button>
                </div>
              </div>
              
              <!-- Tab Toggler -->
              <div class="flex items-center gap-1 bg-[#05050a] p-1 border border-[#1a1c33] rounded-lg self-start mb-2 w-max">
                <button 
                  @click="activeWorkflowTab = 'edit'"
                  :class="[
                    'px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-md cursor-pointer transition-all duration-100 font-outfit border border-transparent',
                    activeWorkflowTab === 'edit' ? 'bg-[#131526] text-purple-300 border-[#1a1c33]' : 'text-gray-500 hover:text-gray-300'
                  ]"
                >
                  Tulis (Editor)
                </button>
                <button 
                  @click="activeWorkflowTab = 'preview'"
                  :class="[
                    'px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-md cursor-pointer transition-all duration-100 font-outfit border border-transparent',
                    activeWorkflowTab === 'preview' ? 'bg-[#131526] text-purple-300 border-[#1a1c33]' : 'text-gray-500 hover:text-gray-300'
                  ]"
                >
                  Pratinjau (Visual)
                </button>
              </div>

              <!-- Textarea Editor -->
              <textarea
                v-if="activeWorkflowTab === 'edit'"
                v-model="activeAiSessionTask.ai_draft_answer"
                rows="14"
                class="w-full bg-[#05050a] border border-[#1a1c33] focus:border-purple-500/20 rounded-xl p-4 text-[10.5px] text-gray-300 leading-relaxed focus:outline-none resize-y min-h-[300px] font-mono"
                placeholder="Edit draf jawaban akademik Anda di sini..."
              ></textarea>
              <div 
                v-else
                v-html="renderDraftPreviewHtml(activeAiSessionTask.ai_draft_answer)"
                class="w-full bg-[#05050a] border border-[#1a1c33] rounded-xl p-4 text-[10.5px] text-gray-250 leading-relaxed min-h-[300px] max-h-[450px] overflow-y-auto select-text preview-content"
              ></div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-[#1a1c33] bg-[#0c0d16] flex items-center justify-between shrink-0">
          <div class="text-[8px] text-gray-500 font-mono font-bold uppercase tracking-wider">
            <span v-if="activeAiSessionState === 'evaluated'">Karakter: {{ activeAiSessionTask.ai_draft_answer ? activeAiSessionTask.ai_draft_answer.length : 0 }}</span>
            <span v-else>PARETO-KAIZORA AI WORKFLOW SYSTEM</span>
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="closeAiSessionModal"
              class="px-4 py-2 bg-[#131526] text-gray-400 hover:text-white font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition-all duration-100 active:scale-95 border border-[#1a1c33] font-outfit"
            >
              {{ activeAiSessionState === 'evaluated' ? 'Selesai' : 'Tutup' }}
            </button>
            <button 
              v-if="activeAiSessionState === 'evaluated' && activeAiSessionTask.type === 'Diskusi'"
              @click="triggerDiscussionFromWorkflow"
              class="px-5 py-2 bg-emerald-950/20 hover:bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-widest rounded-xl cursor-pointer flex items-center gap-2 transition-all duration-100 active:scale-95 shadow-sm font-outfit"
            >
              Kirim ke Moodle
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 8. PREMIUM PRICING UPGRADE MODAL (Solid Opaque, Zero Glass) -->
    <div v-if="isPackageModalOpen" class="fixed inset-0 bg-[#05050a]/95 z-50 flex items-center justify-center p-4">
      <div class="w-full max-w-4xl bg-[#0c0d16] border border-[#1a1c33] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-[#1a1c33] flex items-center justify-between bg-[#101221] shrink-0">
          <div class="flex items-center gap-2">
            <h3 class="text-xs font-black text-white uppercase tracking-wider font-outfit">Upgrade Paket Akademik Kaizora</h3>
          </div>
          <button @click="isPackageModalOpen = false" class="text-gray-500 hover:text-white cursor-pointer transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Pricing Grid -->
        <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto bg-[#05050a]">
          <!-- Card 1: Explorer -->
          <div class="bg-[#0c0d16] border border-[#1a1c33] rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500/10 transition-all duration-150">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest font-outfit">The Explorer</span>
                <span v-if="packageType === 'free'" class="text-[8px] bg-[#131526] border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-black uppercase tracking-wider font-outfit">Active</span>
              </div>
              <h4 class="text-base font-black text-white mb-1 font-outfit">Gratis</h4>
              <p class="text-[10px] text-purple-300 font-bold uppercase tracking-wider mb-4 font-outfit">10.000 Token / Bulan</p>
              
              <div class="bg-[#05050a] border border-[#1a1c33] rounded-xl p-3.5 text-[8.5px] text-gray-400 leading-relaxed font-mono uppercase font-bold space-y-2">
                <div>Fitur Utama:</div>
                <div class="text-gray-300 font-sans font-medium text-[9px]">• Uji coba fungsionalitas</div>
                <div class="text-gray-300 font-sans font-medium text-[9px]">• Rangkum materi pendek</div>
                <div class="text-gray-300 font-sans font-medium text-[9px]">• SSL Bypass Moodle</div>
              </div>
            </div>
            
            <button 
              @click="handleUpgradePlan('free')"
              :disabled="packageType === 'free'"
              class="w-full py-2.5 rounded-xl bg-zinc-900 text-gray-400 disabled:opacity-50 disabled:bg-[#05050a] disabled:text-gray-600 font-black text-[9px] uppercase tracking-widest transition-all mt-6 cursor-pointer border border-[#1a1c33] font-outfit"
            >
              {{ packageType === 'free' ? 'Rencana Aktif Anda' : 'Pilih Rencana' }}
            </button>
          </div>

          <!-- Card 2: Scholar -->
          <div class="bg-[#101221] border border-purple-500/20 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all duration-150 shadow-sm relative">
            <div class="absolute -top-3 right-5 bg-purple-900 border border-purple-500/20 text-purple-100 text-[6.5px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full font-outfit">
              Best Value
            </div>
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-[8px] font-black text-purple-300 uppercase tracking-widest font-outfit">The Scholar</span>
                <span v-if="packageType === 'premium'" class="text-[8px] bg-[#131526] border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-black uppercase tracking-wider font-outfit">Active</span>
              </div>
              <h4 class="text-base font-black text-white mb-1 font-outfit">Rp 49.000<span class="text-[9px] text-gray-500 font-normal">/bln</span></h4>
              <p class="text-[10px] text-purple-300 font-bold uppercase tracking-wider mb-4 font-outfit">750.000 Token / Bulan</p>
              
              <div class="bg-[#05050a] border border-[#1a1c33] rounded-xl p-3.5 text-[8.5px] text-purple-200/90 leading-relaxed font-mono uppercase font-bold space-y-2">
                <div>Fitur Utama:</div>
                <div class="text-purple-300 font-sans font-medium text-[9px]">• ~75 Ringkasan Pareto penuh</div>
                <div class="text-purple-300 font-sans font-medium text-[9px]">• ~30 Draf AI</div>
                <div class="text-purple-300 font-sans font-medium text-[9px]">• Otomatisasi Absensi UT</div>
              </div>
            </div>
            
            <button 
              @click="handleUpgradePlan('premium')"
              :disabled="packageType === 'premium'"
              class="w-full py-2.5 rounded-xl bg-[#131526] hover:bg-[#1c1e36] border border-[#1a1c33] text-white disabled:opacity-50 font-black text-[9px] uppercase tracking-widest transition-all mt-6 cursor-pointer font-outfit"
            >
              {{ packageType === 'premium' ? 'Rencana Aktif Anda' : 'Upgrade Sekarang' }}
            </button>
          </div>

          <!-- Card 3: Elite -->
          <div class="bg-[#0c0d16] border border-[#1a1c33] rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/10 transition-all duration-150">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-[8px] font-black text-indigo-300 uppercase tracking-widest font-outfit">Bypass Elite</span>
                <span v-if="packageType === 'elite'" class="text-[8px] bg-indigo-950/20 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-black uppercase tracking-wider font-outfit">Active</span>
              </div>
              <h4 class="text-base font-black text-white mb-1 font-outfit">Rp 99.000<span class="text-[9px] text-gray-500 font-normal">/bln</span></h4>
              <p class="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mb-4 font-outfit">2.500.000 Token / Bulan</p>
              
              <div class="bg-[#05050a] border border-[#1a1c33] rounded-xl p-3.5 text-[8.5px] text-indigo-200/90 leading-relaxed font-mono uppercase font-bold space-y-2">
                <div>Fitur Utama:</div>
                <div class="text-indigo-300 font-sans font-medium text-[9px]">• Unlimited Pareto Summaries</div>
                <div class="text-indigo-300 font-sans font-medium text-[9px]">• Unlimited Tasks & Discussions</div>
                <div class="text-indigo-300 font-sans font-medium text-[9px]">• High Priority AI bypass</div>
              </div>
            </div>
            
            <button 
              @click="handleUpgradePlan('elite')"
              :disabled="packageType === 'elite'"
              class="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-[#131526] text-gray-400 hover:text-white disabled:opacity-50 font-black text-[9px] uppercase tracking-widest transition-all mt-6 cursor-pointer border border-[#1a1c33] font-outfit"
            >
              {{ packageType === 'elite' ? 'Rencana Aktif Anda' : 'Upgrade Rencana' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 9. TOP UP TOKENS INSTANT MODAL (Premium Invoice & QRIS Slip, Zero Glass) -->
    <div v-if="isTopUpModalOpen" class="fixed inset-0 bg-[#05050a]/95 z-50 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl bg-[#0c0d16] border border-[#1a1c33] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-[#1a1c33] flex items-center justify-between shrink-0 bg-[#101221]">
          <div class="flex items-center gap-2">
            <h3 class="text-xs font-black text-white uppercase tracking-wider font-outfit">Top Up Saldo Kuota Token</h3>
          </div>
          <button @click="closeTopUpModal" class="text-gray-500 hover:text-white cursor-pointer transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body Selection -->
        <div v-if="!selectedTopUpPackage" class="p-6 overflow-y-auto space-y-5 bg-[#05050a]">
          
          <!-- Rollover Balance Alert Box -->
          <div class="bg-purple-950/20 border border-purple-500/20 text-purple-300 text-[10px] leading-relaxed rounded-xl p-3.5 flex items-start gap-2.5">
            <svg class="w-4 h-4 shrink-0 text-purple-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <div class="space-y-1">
              <span class="font-extrabold uppercase font-outfit block">Info Saldo Rollover</span>
              <span class="text-gray-400 font-sans block leading-normal">Token top up bersifat akumulatif (permanen) & tidak memiliki kedaluwarsa. Token ini digunakan otomatis jika kuota bulanan paket langganan utama Anda habis.</span>
            </div>
          </div>

          <p class="text-[10px] text-gray-450 uppercase font-black tracking-widest font-outfit">PILIH PAKET ADD-ON TOKEN:</p>

          <div class="space-y-3">
            <!-- Lite Boost -->
            <button 
              @click="selectedTopUpPackage = 'lite'"
              class="w-full text-left p-4.5 rounded-xl border border-[#1a1c33] bg-[#0c0d16] hover:border-purple-500/30 hover:bg-[#101221] transition-all duration-150 cursor-pointer flex items-center justify-between active:scale-[0.99] group"
            >
              <div class="space-y-1">
                <span class="text-[7.5px] font-black text-gray-500 uppercase tracking-widest block font-outfit">Token Boost Lite</span>
                <span class="text-sm font-black text-white block font-outfit group-hover:text-purple-300 transition-colors">+100.000 <span class="text-[9px] text-gray-500 font-normal">Token AI</span></span>
              </div>
              <div class="text-right shrink-0">
                <span class="text-xs font-black text-white block font-mono">Rp 15.000</span>
                <span class="text-[8px] text-gray-500 block font-mono uppercase">Rp 150/1k tkn</span>
              </div>
            </button>

            <!-- Medium Boost -->
            <button 
              @click="selectedTopUpPackage = 'medium'"
              class="w-full text-left p-4.5 rounded-xl border border-[#1a1c33] bg-[#0c0d16] hover:border-purple-500/30 hover:bg-[#101221] transition-all duration-150 cursor-pointer flex items-center justify-between active:scale-[0.99] group"
            >
              <div class="space-y-1">
                <span class="text-[7.5px] font-black text-purple-400 uppercase tracking-widest block font-outfit">Token Boost Medium</span>
                <span class="text-sm font-black text-white block font-outfit group-hover:text-purple-300 transition-colors">+300.000 <span class="text-[9px] text-gray-500 font-normal">Token AI</span></span>
              </div>
              <div class="text-right shrink-0">
                <span class="text-xs font-black text-white block font-mono">Rp 35.000</span>
                <span class="text-[8px] text-purple-400/80 block font-mono uppercase">Rp 116/1k tkn</span>
              </div>
            </button>

            <!-- Max Boost -->
            <button 
              @click="selectedTopUpPackage = 'max'"
              class="w-full text-left p-4.5 rounded-xl border border-purple-500/20 bg-[#101221] hover:border-purple-500/40 hover:bg-[#131526] transition-all duration-150 cursor-pointer flex items-center justify-between active:scale-[0.99] group relative"
            >
              <div class="absolute -top-2.5 right-4 bg-purple-900 text-purple-100 text-[6.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded font-outfit">
                Best Value Boost
              </div>
              <div class="space-y-1">
                <span class="text-[7.5px] font-black text-indigo-400 uppercase tracking-widest block font-outfit">Token Boost Max</span>
                <span class="text-sm font-black text-white block font-outfit group-hover:text-indigo-300 transition-colors">+600.000 <span class="text-[9px] text-gray-500 font-normal">Token AI</span></span>
              </div>
              <div class="text-right shrink-0">
                <span class="text-xs font-black text-white block font-mono">Rp 65.000</span>
                <span class="text-[8px] text-indigo-400 block font-mono uppercase">Rp 108/1k tkn</span>
              </div>
            </button>
          </div>
        </div>

        <!-- QRIS simulated invoice slip checkout screen -->
        <div v-else class="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#05050a]">
          
          <!-- Column 1: Invoice details -->
          <div class="space-y-4 flex flex-col justify-between">
            <div class="space-y-3.5">
              <span class="text-[8px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2 py-1 rounded font-mono">
                Invoice checkout
              </span>
              
              <div class="space-y-1">
                <h4 class="text-xs font-black text-white font-outfit">Detail Rincian Pembayaran</h4>
                <p class="text-[9px] text-gray-500 font-mono font-bold uppercase tracking-wider">No. Invoice: INV-SCHOLAR-{{ Math.floor(100000 + Math.random() * 900000) }}</p>
              </div>

              <!-- Checkout breakdown card -->
              <div class="bg-[#0c0d16] border border-[#1a1c33] rounded-xl p-4.5 space-y-3 text-[9.5px]">
                <div class="flex justify-between text-gray-400 font-medium">
                  <span>Item Pembelian:</span>
                  <span class="text-white font-bold uppercase">
                    {{ selectedTopUpPackage === 'lite' ? 'Token Boost Lite' : selectedTopUpPackage === 'medium' ? 'Token Boost Medium' : 'Token Boost Max' }}
                  </span>
                </div>
                <div class="flex justify-between text-gray-400 font-medium">
                  <span>Isi Saldo Tambahan:</span>
                  <span class="text-white font-mono font-bold">
                    {{ selectedTopUpPackage === 'lite' ? '+100.000' : selectedTopUpPackage === 'medium' ? '+300.000' : '+600.000' }} Token
                  </span>
                </div>
                <div class="h-[1px] bg-[#1a1c33] my-1"></div>
                <div class="flex justify-between text-white font-extrabold uppercase font-outfit">
                  <span>Total Tagihan:</span>
                  <span class="text-emerald-400 font-mono">
                    Rp {{ selectedTopUpPackage === 'lite' ? '15.000' : selectedTopUpPackage === 'medium' ? '35.000' : '65.000' }}
                  </span>
                </div>
              </div>

              <!-- Payment Method Selector Mockup -->
              <div class="space-y-2">
                <label class="text-[7.5px] font-black text-gray-500 uppercase tracking-widest font-outfit block">Metode Pembayaran</label>
                <div class="bg-[#0c0d16] border border-[#1a1c33] rounded-xl p-3 flex items-center justify-between text-[9px] text-white font-bold font-outfit">
                  <span class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>QRIS Otomatis (Gopay / ShopeePay / Bank)</span>
                  </span>
                  <span class="text-[8px] text-gray-500 uppercase tracking-wider">Pilihan</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 text-[9px] text-gray-500 font-mono font-bold uppercase tracking-wider py-2">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Menunggu pembayaran via QRIS...</span>
            </div>
          </div>

          <!-- Column 2: Simulated QR Code scanner -->
          <div class="bg-[#0c0d16] border border-[#1a1c33] rounded-2xl p-6 flex flex-col items-center justify-center space-y-5">
            <!-- Simulated QR Code -->
            <div class="relative p-4.5 bg-white rounded-xl flex items-center justify-center w-36 h-36 border border-gray-200 shadow-lg">
              <svg class="w-full h-full text-black" viewBox="0 0 100 100">
                <rect x="10" y="10" width="20" height="20" fill="currentColor"/>
                <rect x="15" y="15" width="10" height="10" fill="white"/>
                <rect x="70" y="10" width="20" height="20" fill="currentColor"/>
                <rect x="75" y="15" width="10" height="10" fill="white"/>
                <rect x="10" y="70" width="20" height="20" fill="currentColor"/>
                <rect x="15" y="75" width="10" height="10" fill="white"/>
                <rect x="35" y="35" width="30" height="30" fill="currentColor"/>
                <rect x="40" y="40" width="20" height="20" fill="white"/>
                <rect x="45" y="45" width="10" height="10" fill="currentColor"/>
                
                <rect x="35" y="10" width="5" height="5" fill="currentColor"/>
                <rect x="45" y="15" width="5" height="10" fill="currentColor"/>
                <rect x="55" y="20" width="10" height="5" fill="currentColor"/>
                <rect x="10" y="35" width="5" height="10" fill="currentColor"/>
                <rect x="20" y="45" width="10" height="5" fill="currentColor"/>
                <rect x="75" y="35" width="15" height="5" fill="currentColor"/>
                <rect x="70" y="45" width="5" height="15" fill="currentColor"/>
                <rect x="85" y="55" width="5" height="10" fill="currentColor"/>
              </svg>
            </div>

            <!-- CTA Actions -->
            <div class="w-full space-y-2">
              <button 
                @click="simulateQrisSuccess"
                :disabled="isProcessingPayment"
                class="w-full py-3 bg-emerald-950/20 hover:bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 disabled:opacity-50 font-black text-[9.5px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm font-outfit"
              >
                <span v-if="isProcessingPayment" class="w-3 h-3 rounded-full border-2 border-emerald-350/20 border-t-emerald-350 animate-spin"></span>
                <span>Konfirmasi Pembayaran Sukses</span>
              </button>
              
              <button 
                @click="selectedTopUpPackage = null"
                class="w-full py-2.5 bg-[#131526] hover:bg-[#1c1e36] border border-[#1a1c33] text-gray-400 hover:text-white font-black text-[9.5px] uppercase tracking-wider rounded-xl cursor-pointer text-center active:scale-95 transition-all font-outfit"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api/axios';

const router = useRouter();
const userEmail = ref(localStorage.getItem('kaizora_user_email') || '');

const courses = ref([]);
const sessions = ref([]);
const selectedCourse = ref(null);

const loadingCourses = ref(false);
const loadingSessions = ref(false);
const isResyncing = ref(false);
const isSyncingOverlay = ref(false);

const isBypassingAttendance = ref(false);
const isMarkingAllDone = ref(false);

const draftingTasks = ref({});
const bypassingSingleAttendanceIds = ref({});

const activeDiscussionTask = ref(null);
const activeDiscussionSession = ref(null);
const discussionReplyText = ref('');
const isSubmittingDiscussion = ref(false);
const isRegeneratingDraft = ref(false);

// Conversational Socratic 3-Fase Workflow Blueprint variables
const activeAiSessionTask = ref(null);
const activeAiSessionState = ref('idle');
const aiContextForm = ref({ style: 'Analitis-Tajam', perspective: '', localExample: '' });
const activeAiSocraticQuestion = ref('');
const aiSocraticAnswer = ref('');
const isProcessingWorkflow = ref(false);
const activeWorkflowTab = ref('edit');

// Monospace Markdown/ASCII & HTML Table Preview System
const activeDraftTabs = ref({}); // { [taskId]: 'edit' | 'preview' }
const activeModalTab = ref('edit'); // 'edit' | 'preview'

const getActiveTab = (taskId) => {
  return activeDraftTabs.value[taskId] || 'edit';
};

const setActiveTab = (taskId, tab) => {
  activeDraftTabs.value[taskId] = tab;
};

const renderDraftPreviewHtml = (text) => {
  if (!text) return '<span class="text-gray-500">Belum ada draf jawaban yang di-generate. Silakan klik tombol di bawah untuk membuatnya.</span>';
  
  // Convert ASCII table structures to HTML tables first
  const withTables = convertAsciiTableToHtml(text);
  
  // Split the text into HTML blocks and plain paragraphs
  const blocks = withTables.split(/(<div class="theme-table-wrap"[\s\S]*?<\/div>)/g);
  
  return blocks.map(block => {
    if (block.trim().startsWith('<div class="theme-table-wrap"')) {
      return block; // Preserve the table HTML block entirely
    }
    // Standard paragraph wrapper with soft line breaks
    return block
      .split(/\n{2,}/)
      .map(p => {
        const cleanP = p.trim().replace(/\n/g, '<br />');
        return cleanP ? `<p class="mb-3">${cleanP}</p>` : '';
      })
      .filter(Boolean)
      .join('');
  }).join('');
};

const convertAsciiTableToHtml = (text) => {
  if (!text) return '';
  const lines = text.split('\n');
  let inTable = false;
  let tableLines = [];
  const output = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Detect lines starting and ending with vertical pipes or containing at least two pipes
    const isTableLine = (line.startsWith('|') && line.endsWith('|')) || (line.split('|').length > 2 && line.startsWith('|'));

    if (isTableLine) {
      if (!inTable) {
        inTable = true;
        tableLines = [];
      }
      tableLines.push(line);
    } else {
      if (inTable) {
        output.push(renderHtmlTable(tableLines));
        inTable = false;
        tableLines = [];
      }
      output.push(lines[i]);
    }
  }

  if (inTable) {
    output.push(renderHtmlTable(tableLines));
  }

  return output.join('\n');
};

const renderHtmlTable = (lines) => {
  if (lines.length === 0) return '';

  const parseRow = (line) => {
    let clean = line.trim();
    if (clean.startsWith('|')) clean = clean.slice(1);
    if (clean.endsWith('|')) clean = clean.slice(0, -1);
    return clean.split('|').map(cell => cell.trim());
  };

  let html = '<div class="theme-table-wrap overflow-x-auto my-4 w-full border border-[#1a1c33] rounded-xl"><table class="w-full border-collapse text-[10px] text-gray-300">';
  let hasHeader = false;

  if (lines.length > 1) {
    const secondRowCells = parseRow(lines[1]);
    const isSeparator = secondRowCells.every(cell => cell.match(/^:?-+:?$/));
    if (isSeparator) {
      hasHeader = true;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    if (i === 1 && hasHeader) continue; // Skip separator line

    const cells = parseRow(lines[i]);
    if (i === 0 && hasHeader) {
      html += '<thead class="bg-[#131526] text-purple-300 font-bold border-b border-[#1a1c33]"><tr>';
      for (const cell of cells) {
        html += `<th class="border-r border-[#1a1c33] last:border-r-0 p-2.5 text-left">${cell}</th>`;
      }
      html += '</tr></thead><tbody class="divide-y divide-[#1a1c33]">';
    } else {
      if (i === 0 && !hasHeader) {
        html += '<tbody class="divide-y divide-[#1a1c33]">';
      }
      html += '<tr class="hover:bg-[#0c0d16]/30 bg-[#05050a]/40">';
      for (const cell of cells) {
        html += `<td class="border-r border-[#1a1c33] last:border-r-0 p-2.5">${cell}</td>`;
      }
      html += '</tr>';
    }
  }

  html += '</tbody></table></div>';
  return html;
};

const activeAssignmentTask = ref(null);
const activeAssignmentSession = ref(null);
const selectedFile = ref(null);
const hasCheckedStatement = ref(false);
const isSubmittingAssignment = ref(false);
const fileInputRef = ref(null);

// Academic Profile Variables
const studentName = ref(localStorage.getItem('academic_student_name') || 'Fadjar Setiawan');
const studentNIM = ref(localStorage.getItem('academic_student_nim') || '054308893');
const studentProdi = ref(localStorage.getItem('academic_student_prodi') || 'Sistem Informasi');
const isProfileModalOpen = ref(false);

// Header User Menu State
const isUserMenuOpen = ref(false);

// Collapsible Desktop Sidebar state
const isSidebarCollapsed = ref(false);

// Mobile Sidebar Drawer state
const isMobileSidebarOpen = ref(false);

// SaaS Pricing, Top Up & Tokens State
const activeTab = ref('dashboard');
const packageType = ref('free');
const tokensUsed = ref(0);
const tokensMax = ref(10000);
const aiTokensPurchased = ref(0);
const isPackageModalOpen = ref(false);
const isTopUpModalOpen = ref(false);
const selectedTopUpPackage = ref(null);
const isProcessingPayment = ref(false);
const tokenLogs = ref([]);

// Active Session Index for Horizontal Navigation Selector
const selectedSessionIndex = ref(0);

// Active Session-level AI Summarization Modal states
const activeSessionSummary = ref(null);
const activeSummaryMaterialIdx = ref(0);

const openSessionSummary = (session) => {
  activeSessionSummary.value = session;
  activeSummaryMaterialIdx.value = 0;
};

// Donut Chart Computeds
const totalSpentTokens = computed(() => {
  return tokenLogs.value
    .filter(log => log.tokensSwapped < 0)
    .reduce((acc, log) => acc + Math.abs(log.tokensSwapped), 0);
});

const saveProfile = () => {
  localStorage.setItem('academic_student_name', studentName.value);
  localStorage.setItem('academic_student_nim', studentNIM.value);
  localStorage.setItem('academic_student_prodi', studentProdi.value);
  isProfileModalOpen.value = false;
  alert('Profil akademik berhasil disimpan!');
};

const handleUpgradePlan = async (plan) => {
  try {
    const res = await api.post('/auth/upgrade', {
      email: userEmail.value,
      package_type: plan
    });
    if (res.data.success) {
      packageType.value = res.data.user.packageType;
      tokensUsed.value = res.data.user.tokensUsed;
      tokensMax.value = res.data.user.tokensMax;
      alert(`Sukses Upgrade Paket! Anda saat ini berada di paket ${plan.toUpperCase()}.`);
      isPackageModalOpen.value = false;
    }
  } catch (err) {
    console.error(err);
    alert('Gagal melakukan upgrade paket.');
  }
};

onMounted(() => {
  if (!userEmail.value) {
    router.push({ name: 'Login' });
  } else {
    fetchCourses();
  }
});

const formatDate = (dateStr) => {
  if (!dateStr) return 'Never';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const formatDescription = (desc) => {
  if (!desc) return '';
  if (desc.includes('[Kaizora-Attachments]:')) {
    return desc.split('[Kaizora-Attachments]:')[0].trim();
  }
  return desc;
};

const extractAttachments = (desc) => {
  if (!desc || !desc.includes('[Kaizora-Attachments]:')) return [];
  try {
    const parts = desc.split('[Kaizora-Attachments]:');
    return JSON.parse(parts[1].trim());
  } catch (err) {
    console.error('Failed to parse attachments:', err);
    return [];
  }
};

const fetchCourses = async () => {
  loadingCourses.value = true;
  try {
    const res = await api.get(`/courses?email=${userEmail.value}`);
    if (res.data.success) {
      courses.value = res.data.courses;
      
      if (res.data.user) {
        packageType.value = res.data.user.packageType;
        tokensUsed.value = res.data.user.tokensUsed;
        tokensMax.value = res.data.user.tokensMax;
        aiTokensPurchased.value = res.data.user.aiTokensPurchased || 0;
      }
      
      if (courses.value.length > 0 && !selectedCourse.value) {
        selectCourse(courses.value[0]);
      }
    }
  } catch (err) {
    console.error('Error fetching courses:', err);
  } finally {
    loadingCourses.value = false;
  }
};

const selectCourse = async (course) => {
  selectedCourse.value = course;
  selectedSessionIndex.value = 0;
  loadingSessions.value = true;
  try {
    const res = await api.get(`/courses/${course.id}/data`);
    if (res.data.success) {
      sessions.value = res.data.sessions;
    }
  } catch (err) {
    console.error('Error selecting course:', err);
  } finally {
    loadingSessions.value = false;
  }
};

const openDiscussionModal = (task, session) => {
  activeDiscussionTask.value = task;
  activeDiscussionSession.value = session;
  discussionReplyText.value = task.ai_draft_answer || '';
  activeModalTab.value = 'edit';
};

const closeDiscussionModal = () => {
  activeDiscussionTask.value = null;
  activeDiscussionSession.value = null;
  discussionReplyText.value = '';
  activeModalTab.value = 'edit';
};

const openAssignmentModal = (task, session) => {
  activeAssignmentTask.value = task;
  activeAssignmentSession.value = session;
  selectedFile.value = null;
  hasCheckedStatement.value = false;
};

const closeAssignmentModal = () => {
  activeAssignmentTask.value = null;
  activeAssignmentSession.value = null;
  selectedFile.value = null;
  hasCheckedStatement.value = false;
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
};

const getFormattedFileName = () => {
  if (!activeAssignmentTask.value || !selectedFile.value) return '';
  const taskNumMatch = activeAssignmentTask.value.title.match(/tugas\s*(\d+)/i);
  const taskNum = taskNumMatch ? taskNumMatch[1] : '1';
  const fileExt = selectedFile.value.name.includes('.') 
    ? selectedFile.value.name.substring(selectedFile.value.name.lastIndexOf('.')) 
    : '.pdf';
  return `Tugas ${taskNum} - ${selectedCourse.value.name} | ${studentName.value}${fileExt}`;
};

const submitAssignmentToMoodle = async () => {
  if (!selectedFile.value || !hasCheckedStatement.value) return;

  isSubmittingAssignment.value = true;
  try {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64String = reader.result.split(',')[1];
        
        const res = await api.post(`/courses/${selectedCourse.value.id}/submit-assignment`, {
          task_id: activeAssignmentTask.value.id,
          file_base64: base64String,
          file_name: selectedFile.value.name,
          email: userEmail.value
        });

        if (res.data.success) {
          alert(res.data.message || 'Tugas berhasil diunggah ke Moodle UT!');
          activeAssignmentTask.value.status = 'submitted';
          closeAssignmentModal();
          await selectCourse(selectedCourse.value);
        }
      } catch (postErr) {
        console.error('Post error:', postErr);
        const msg = postErr.response?.data?.message || 'Gagal mengirim tugas ke Moodle UT.';
        alert(msg);
      } finally {
        isSubmittingAssignment.value = false;
      }
    };
    
    reader.onerror = () => {
      alert('Gagal membaca berkas tugas dari komputer Anda.');
      isSubmittingAssignment.value = false;
    };

    reader.readAsDataURL(selectedFile.value);

  } catch (err) {
    console.error('Submit error:', err);
    alert('Terjadi kesalahan yang tidak terduga saat mengunggah berkas.');
    isSubmittingAssignment.value = false;
  }
};

const downloadDraftAsPDF = (task) => {
  if (!task.ai_draft_answer) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Browser memblokir pop-up. Harap izinkan pop-up untuk mencetak draf PDF.');
    return;
  }

  const rawMarkdown = task.ai_draft_answer || '';
  const nameVal = studentName.value || 'Fadjar Setiawan';
  const nimVal = studentNIM.value || '054308893';
  const prodiVal = studentProdi.value || 'Sistem Informasi';

  const isDigitalEraCourse = selectedCourse.value && 
    (selectedCourse.value.name.toLowerCase().includes('era digital') || 
     selectedCourse.value.name.toLowerCase().includes('digital citizen') ||
     task.title.toLowerCase().includes('digital'));

  const documentHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${task.title} - ${nameVal}</title>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css?family=Times+New+Roman&display=swap" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
        <script>
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
              displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
              processEscapes: true
            },
            options: {
              ignoreHtmlClass: 'tex2jax_ignore',
              processHtmlClass: 'tex2jax_process'
            }
          };
        <\/script>
        <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" id="MathJax-script" async><\/script>
        
        <style>
          @page {
            size: A4;
            margin: 3cm 3cm 3cm 4cm;
          }
          
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            background-color: #fff;
            margin: 0;
            padding: 0;
          }

          .academic-container {
            width: 100%;
            box-sizing: border-box;
          }

          .header-container {
            border-bottom: 3px double #000;
            padding-bottom: 12px;
            margin-bottom: 24px;
          }

          .header-line {
            font-size: 12pt;
            margin-bottom: 4px;
            font-weight: normal;
          }

          .header-line:first-child {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
          }

          #content {
            font-size: 12pt;
          }

          #content p {
            margin-top: 0;
            margin-bottom: 12px;
            text-align: justify;
            text-indent: 1.25cm;
          }

          #content h1, #content h2, #content h3, #content h4, #content h5, #content h6 {
            color: #000;
            page-break-after: avoid;
            text-indent: 0;
            margin-top: 24px;
            margin-bottom: 12px;
          }

          #content h1 {
            font-size: 14pt;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
          }

          #content h2 {
            font-size: 12pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            padding-bottom: 4px;
          }

          #content h3 {
            font-size: 12pt;
            font-weight: bold;
            text-decoration: underline;
          }

          #content h4 {
            font-size: 12pt;
            font-weight: bold;
            font-style: italic;
          }

          #content ul, #content ol {
            margin-top: 0;
            margin-bottom: 12px;
            padding-left: 2cm;
          }

          #content li {
            margin-bottom: 6px;
            text-align: justify;
            text-indent: 0;
          }

          #content table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
            margin-bottom: 18px;
            font-size: 11pt;
            page-break-inside: avoid;
          }

          #content th, #content td {
            border: 1px solid #000;
            padding: 8px 12px;
            text-align: center;
          }

          #content th {
            font-weight: bold;
            background-color: #f5f5f5;
          }

          #content td {
            line-height: 1.4;
          }

          .illustration-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 30px;
            margin-bottom: 30px;
            page-break-inside: avoid;
          }

          .illustration-title {
            font-size: 10pt;
            font-style: italic;
            margin-bottom: 12px;
            text-align: center;
          }

          .venn-svg {
            border: 1px solid #ddd;
            padding: 10px;
            background-color: #fafafa;
          }

          .circle {
            fill: none;
            stroke: #000;
            stroke-width: 1.5;
          }

          .circle-left {
            stroke-dasharray: 4 2;
          }

          .circle-right {
            stroke-width: 2;
          }

          .print-btn-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 1000;
          }

          .print-btn {
            background-color: #059669;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 9999px;
            cursor: pointer;
            box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.4);
            font-family: system-ui, -apple-system, sans-serif;
            transition: all 0.2s ease;
          }

          .print-btn:hover {
            background-color: #047857;
            transform: translateY(-2px);
          }

          @media print {
            .print-btn-container {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-btn-container">
          <button class="print-btn" onclick="window.print()">Simpan sebagai PDF / Cetak</button>
        </div>
        
        <div class="academic-container">
          <div class="header-container">
            <div class="header-line"><b>${task.title.replace(/\s+\d+\s*$/, '')}</b></div>
            <div class="header-line">Nama: ${nameVal}</div>
            <div class="header-line">NIM: ${nimVal}</div>
            <div class="header-line">Prodi: ${prodiVal}</div>
          </div>
          
          <div id="content" class="tex2jax_process"></div>
        </div>

        <script>
          let mdText = \`${rawMarkdown.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
          
          document.getElementById('content').innerHTML = marked.parse(mdText);

          if (${isDigitalEraCourse}) {
            const vennDiv = document.createElement('div');
            vennDiv.innerHTML = \`
              <div class="illustration-container">
                <div class="illustration-title">Gambar 1. Diagram Eksistensi Hubungan Warga Digital dan Jurnalisme Warga</div>
                <svg width="450" height="220" viewBox="0 0 450 220" class="venn-svg">
                  <circle cx="170" cy="110" r="90" class="circle circle-left" />
                  <circle cx="280" cy="110" r="90" class="circle circle-right" />
                  
                  <text x="125" y="105" style="font-family:'Times New Roman'; font-size:10pt; font-weight:bold; text-anchor:middle; fill:#000;">Warga Digital</text>
                  <text x="125" y="125" style="font-family:'Times New Roman'; font-size:9pt; font-style:italic; text-anchor:middle; fill:#333;">(Digital Citizen)</text>
                  
                  <text x="325" y="105" style="font-family:'Times New Roman'; font-size:10pt; font-weight:bold; text-anchor:middle; fill:#000;">Jurnalisme Warga</text>
                  <text x="325" y="125" style="font-family:'Times New Roman'; font-size:9pt; font-style:italic; text-anchor:middle; fill:#333;">(Citizen Journalism)</text>
                  
                  <text x="225" y="100" style="font-family:'Times New Roman'; font-size:10pt; font-weight:bold; text-anchor:middle; fill:#000;">Sinergi</text>
                  <text x="225" y="115" style="font-family:'Times New Roman'; font-size:9pt; font-style:italic; text-anchor:middle; fill:#333;">Partisipasi</text>
                  <text x="225" y="130" style="font-family:'Times New Roman'; font-size:9pt; font-style:italic; text-anchor:middle; fill:#333;">Publik Etis</text>
                </svg>
              </div>
            \`;
            document.getElementById('content').appendChild(vennDiv);
          }

          window.addEventListener('load', () => {
            if (window.MathJax) {
              window.MathJax.startup.promise.then(() => {
                setTimeout(() => {
                  window.print();
                }, 800);
              });
            } else {
              setTimeout(() => {
                window.print();
              }, 1000);
            }
          });
        <\/script>
      </body>
    </html>
  `;

  printWindow.document.write(documentHtml);
  printWindow.document.close();
};

const reGenerateModalDraft = async () => {
  isRegeneratingDraft.value = true;
  try {
    const res = await api.post('/ai/generate-task', { 
      task_id: activeDiscussionTask.value.id,
      academic_details: {
        name: studentName.value,
        nim: studentNIM.value,
        prodi: studentProdi.value
      }
    });
    if (res.data.success) {
      activeDiscussionTask.value.ai_draft_answer = res.data.task.aiDraftAnswer;
      activeDiscussionTask.value.status = 'drafted';
      discussionReplyText.value = res.data.task.aiDraftAnswer;
      if (res.data.user) {
        tokensUsed.value = res.data.user.tokensUsed;
        tokensMax.value = res.data.user.tokensMax;
        packageType.value = res.data.user.packageType;
        aiTokensPurchased.value = res.data.user.aiTokensPurchased || 0;
      }
    }
  } catch (err) {
    console.error('Error drafting task:', err);
    alert(err.response?.data?.message || 'Batas kuota rate limit atau Engine sibuk. Gagal generate.');
  } finally {
    isRegeneratingDraft.value = false;
  }
};

const submitDiscussionToMoodle = async () => {
  if (!discussionReplyText.value.trim()) return;
  
  isSubmittingDiscussion.value = true;
  try {
    const res = await api.post(`/courses/${selectedCourse.value.id}/submit-discussion`, {
      task_id: activeDiscussionTask.value.id,
      reply_text: discussionReplyText.value,
      email: userEmail.value
    });
    
    if (res.data.success) {
      alert(res.data.message || 'Jawaban diskusi berhasil dikirim ke Moodle UT!');
      activeDiscussionTask.value.ai_draft_answer = discussionReplyText.value;
      activeDiscussionTask.value.status = 'submitted';
      closeDiscussionModal();
      await selectCourse(selectedCourse.value);
    }
  } catch (err) {
    console.error('Error submitting discussion:', err);
    const msg = err.response?.data?.message || 'Gagal mengirim diskusi. Silakan periksa sesi login Moodle Anda.';
    alert(msg);
  } finally {
    isSubmittingDiscussion.value = false;
  }
};

const generateDraft = async (task) => {
  draftingTasks.value[task.id] = true;
  try {
    const res = await api.post('/ai/generate-task', { 
      task_id: task.id,
      academic_details: {
        name: studentName.value,
        nim: studentNIM.value,
        prodi: studentProdi.value
      }
    });
    if (res.data.success) {
      // Sync local task copy from the backend response
      task.ai_session_state = res.data.phase;
      task.ai_socratic_question = res.data.socraticQuestion || res.data.task.aiSocraticQuestion;
      task.ai_socratic_answer = res.data.task.aiSocraticAnswer;
      task.ai_draft_answer = res.data.task.aiDraftAnswer;
      task.ai_context_form = res.data.task.aiContextForm;

      // Populate interactive Vue reactive states
      activeAiSessionTask.value = task;
      activeAiSessionState.value = res.data.phase;
      activeAiSocraticQuestion.value = task.ai_socratic_question || '';
      aiSocraticAnswer.value = task.ai_socratic_answer || '';
      
      if (task.ai_context_form) {
        try {
          aiContextForm.value = JSON.parse(task.ai_context_form);
        } catch (e) {
          aiContextForm.value = { style: 'Analitis-Tajam', perspective: '', localExample: '' };
        }
      } else {
        aiContextForm.value = { style: 'Analitis-Tajam', perspective: '', localExample: '' };
      }

      if (res.data.user) {
        tokensUsed.value = res.data.user.tokensUsed;
        tokensMax.value = res.data.user.tokensMax;
        packageType.value = res.data.user.packageType;
        aiTokensPurchased.value = res.data.user.aiTokensPurchased || 0;
      }
    }
  } catch (err) {
    console.error('Error initiating AI session:', err);
    alert(err.response?.data?.message || 'Batas kuota rate limit atau Engine sibuk. Gagal memuat sesi AI.');
  } finally {
    draftingTasks.value[task.id] = false;
  }
};

const closeAiSessionModal = () => {
  activeAiSessionTask.value = null;
};

const submitContextForm = async () => {
  if (!activeAiSessionTask.value) return;
  isProcessingWorkflow.value = true;
  try {
    const res = await api.post('/ai/generate-task', {
      task_id: activeAiSessionTask.value.id,
      context_form: aiContextForm.value,
      academic_details: {
        name: studentName.value,
        nim: studentNIM.value,
        prodi: studentProdi.value
      }
    });
    if (res.data.success) {
      activeAiSessionState.value = res.data.phase; // should be 'activation'
      activeAiSocraticQuestion.value = res.data.socraticQuestion;
      
      // Update local task properties
      activeAiSessionTask.value.ai_session_state = res.data.phase;
      activeAiSessionTask.value.ai_socratic_question = res.data.socraticQuestion;
      activeAiSessionTask.value.ai_context_form = JSON.stringify(aiContextForm.value);
    }
  } catch (err) {
    console.error('Error submitting context form:', err);
    alert(err.response?.data?.message || 'Gagal memproses form konteks. Silakan coba lagi.');
  } finally {
    isProcessingWorkflow.value = false;
  }
};

const submitSocraticAnswer = async () => {
  if (!activeAiSessionTask.value || !aiSocraticAnswer.value.trim()) return;
  isProcessingWorkflow.value = true;
  try {
    const res = await api.post('/ai/generate-task', {
      task_id: activeAiSessionTask.value.id,
      socratic_answer: aiSocraticAnswer.value,
      academic_details: {
        name: studentName.value,
        nim: studentNIM.value,
        prodi: studentProdi.value
      }
    });
    if (res.data.success) {
      activeAiSessionState.value = res.data.phase; // should be 'evaluated'
      
      // Update local task properties
      activeAiSessionTask.value.ai_session_state = res.data.phase;
      activeAiSessionTask.value.ai_socratic_answer = aiSocraticAnswer.value;
      activeAiSessionTask.value.ai_draft_answer = res.data.task.aiDraftAnswer;
      activeAiSessionTask.value.status = 'drafted';

      if (res.data.user) {
        tokensUsed.value = res.data.user.tokensUsed;
        tokensMax.value = res.data.user.tokensMax;
        packageType.value = res.data.user.packageType;
        aiTokensPurchased.value = res.data.user.aiTokensPurchased || 0;
      }
    }
  } catch (err) {
    console.error('Error generating final humanized draft:', err);
    alert(err.response?.data?.message || 'Gagal memproses draf humanized. Silakan coba lagi.');
  } finally {
    isProcessingWorkflow.value = false;
  }
};

const resetAiWorkflow = async () => {
  if (!activeAiSessionTask.value) return;
  if (!confirm('Apakah Anda yakin ingin me-reset seluruh progres sesi interaktif AI ini? Anda harus mengisi form dari awal.')) return;
  
  isProcessingWorkflow.value = true;
  try {
    const res = await api.post('/ai/generate-task', {
      task_id: activeAiSessionTask.value.id,
      reset: true
    });
    if (res.data.success) {
      activeAiSessionState.value = 'interrogation';
      activeAiSocraticQuestion.value = '';
      aiSocraticAnswer.value = '';
      aiContextForm.value = { style: 'Analitis-Tajam', perspective: '', localExample: '' };
      
      // Update local task copy
      activeAiSessionTask.value.ai_session_state = 'interrogation';
      activeAiSessionTask.value.ai_socratic_question = null;
      activeAiSessionTask.value.ai_socratic_answer = null;
      activeAiSessionTask.value.ai_draft_answer = null;
      activeAiSessionTask.value.status = 'pending';
    }
  } catch (err) {
    console.error('Error resetting workflow:', err);
    alert('Gagal me-reset sesi AI.');
  } finally {
    isProcessingWorkflow.value = false;
  }
};

const triggerDiscussionFromWorkflow = () => {
  if (!activeAiSessionTask.value) return;
  // Copy active workflow variables to activeDiscussionTask for the submit modal
  activeDiscussionTask.value = activeAiSessionTask.value;
  activeDiscussionSession.value = sessions.value[selectedSessionIndex.value];
  discussionReplyText.value = activeAiSessionTask.value.ai_draft_answer;
  activeModalTab.value = 'edit';
  
  // Close workflow modal
  closeAiSessionModal();
};

const copyText = (text) => {
  navigator.clipboard.writeText(text);
  alert('Draf disalin ke clipboard!');
};



const markAllActivitiesDone = async (course) => {
  isMarkingAllDone.value = true;
  try {
    const res = await api.post(`/courses/${course.id}/mark-all-done`, {
      email: userEmail.value
    });
    if (res.data.success) {
      alert(res.data.message || 'Semua aktivitas berhasil ditandai selesai (Mark as done) secara eksternal!');
      await selectCourse(course);
    }
  } catch (err) {
    console.error('Mark all done failed:', err);
    alert('Gagal menandai selesai. Pastikan sesi login Moodle Anda masih aktif.');
  } finally {
    isMarkingAllDone.value = false;
  }
};

const triggerResync = async () => {
  isSyncingOverlay.value = true;
  isResyncing.value = true;
  try {
    const res = await api.post('/auth/resync', {
      email: userEmail.value
    });

    if (res.data.success) {
      alert(res.data.message || 'Sinkronisasi ulang berhasil diselesaikan!');
      await fetchCourses();
      if (selectedCourse.value) {
        const updated = courses.value.find(c => c.utCourseId === selectedCourse.value.utCourseId);
        if (updated) await selectCourse(updated);
      }
    }
  } catch (err) {
    console.error('Sync failed:', err);
    const serverMessage = err.response?.data?.message;
    alert(serverMessage || 'Sinkronisasi gagal. Pastikan koneksi internet stabil dan sandi Moodle Anda benar.');
  } finally {
    isSyncingOverlay.value = false;
    isResyncing.value = false;
  }
};

const handleLogout = () => {
  localStorage.removeItem('kaizora_user_email');
  router.push({ name: 'Login' });
};

// Token Audit & Top Up Methods
const fetchTokenLogs = async () => {
  try {
    const res = await api.get(`/auth/token-logs?email=${userEmail.value}`);
    if (res.data.success) {
      tokenLogs.value = res.data.logs;
    }
  } catch (err) {
    console.error('Failed to fetch token logs:', err);
  }
};

const closeTopUpModal = () => {
  isTopUpModalOpen.value = false;
  selectedTopUpPackage.value = null;
  isProcessingPayment.value = false;
};

const simulateQrisSuccess = async () => {
  isProcessingPayment.value = true;
  try {
    const res = await api.post('/auth/topup', {
      email: userEmail.value,
      package_boost: selectedTopUpPackage.value
    });
    if (res.data.success) {
      packageType.value = res.data.user.packageType;
      tokensUsed.value = res.data.user.tokensUsed;
      tokensMax.value = res.data.user.tokensMax;
      aiTokensPurchased.value = res.data.user.aiTokensPurchased || 0;
      
      alert(res.data.message);
      await fetchTokenLogs();
      closeTopUpModal();
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'Gagal melakukan top up saldo token.');
  } finally {
    isProcessingPayment.value = false;
  }
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + ' tahun lalu';
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + ' bulan lalu';
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + ' hari lalu';
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + ' jam lalu';
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + ' menit lalu';
  return 'Baru saja';
};

watch(activeTab, (newTab) => {
  if (newTab === 'analytics') {
    fetchTokenLogs();
  }
});
</script>

<style scoped>
/* Outfit Google Font for sleek headings */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;650;700;850;900&family=Inter:wght@400;500;600;700&display=swap');

.font-outfit {
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.font-inter {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

/* Hide scrollbars but keep scroll functionality */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Beautiful styling for HTML elements inside scraped task descriptions */
:deep(.description-html) table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-family: var(--font-inter), sans-serif;
  background-color: #05050a;
  border: 1px solid #1c1e36;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.description-html) th, :deep(.description-html) td {
  border: 1px solid #1c1e36;
  padding: 8px 12px;
  text-align: left;
  color: #9ca3af; /* gray-400 */
}

:deep(.description-html) th {
  background-color: #101221;
  font-weight: 700;
  color: #c084fc; /* purple-400 */
  font-size: 9.5px;
}

:deep(.description-html) td {
  font-size: 9px;
  line-height: 1.5;
}

:deep(.description-html) tr:hover {
  background-color: #0c0d16;
}

:deep(.description-html) p {
  margin-bottom: 8px;
}

:deep(.description-html) p:last-child {
  margin-bottom: 0;
}

:deep(.description-html) ul, :deep(.description-html) ol {
  padding-left: 18px;
  margin: 6px 0;
}

:deep(.description-html) li {
  list-style-type: disc;
  margin-bottom: 4px;
  color: #d1d5db;
}

:deep(.description-html) strong, :deep(.description-html) b {
  color: #fff;
  font-weight: 750;
}
</style>
