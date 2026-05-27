<template>
  <!-- Pure Dark Purple Cosmic Base (No extra accent colors) -->
  <div :class="isDarkMode ? 'dark-theme' : 'light-theme'" class="min-h-screen bg-theme-main text-theme-primary font-sans antialiased overflow-x-hidden relative selection:bg-purple-600/30 selection:text-white">
    
    <!-- Animated SVG Decorations (theme-aware via currentColor) -->
    <!-- Floating Circles -->
    <svg class="absolute top-[10%] left-[5%] w-32 h-32 opacity-[0.06] pointer-events-none z-0 animate-float-slow" viewBox="0 0 128 128" fill="none">
      <circle cx="64" cy="64" r="60" stroke="currentColor" stroke-width="0.5" stroke-dasharray="8 6"/>
      <circle cx="64" cy="64" r="40" stroke="currentColor" stroke-width="0.5" stroke-dasharray="4 8"/>
      <circle cx="64" cy="64" r="20" stroke="currentColor" stroke-width="0.5"/>
    </svg>

    <!-- Floating Hexagon Grid -->
    <svg class="absolute top-[18%] right-[8%] w-48 h-48 opacity-[0.04] pointer-events-none z-0 animate-float-medium" viewBox="0 0 200 200" fill="none">
      <polygon points="100,10 170,50 170,130 100,170 30,130 30,50" stroke="currentColor" stroke-width="0.5"/>
      <polygon points="100,40 145,65 145,115 100,140 55,115 55,65" stroke="currentColor" stroke-width="0.5"/>
      <polygon points="100,70 120,82 120,106 100,118 80,106 80,82" stroke="currentColor" stroke-width="0.5"/>
    </svg>

    <!-- Floating Circuit Lines -->
    <svg class="absolute bottom-[20%] left-[3%] w-56 h-56 opacity-[0.04] pointer-events-none z-0 animate-float-reverse" viewBox="0 0 240 240" fill="none">
      <path d="M20 120 H80 L100 100 H160 L180 120 H220" stroke="currentColor" stroke-width="0.5"/>
      <path d="M20 140 H60 L80 160 H180 L200 140 H220" stroke="currentColor" stroke-width="0.5"/>
      <circle cx="80" cy="120" r="3" fill="currentColor" opacity="0.3"/>
      <circle cx="160" cy="120" r="3" fill="currentColor" opacity="0.3"/>
      <circle cx="80" cy="160" r="3" fill="currentColor" opacity="0.3"/>
      <circle cx="180" cy="160" r="3" fill="currentColor" opacity="0.3"/>
    </svg>

    <!-- Floating Data Nodes -->
    <svg class="absolute bottom-[15%] right-[5%] w-40 h-40 opacity-[0.05] pointer-events-none z-0 animate-float-slow" viewBox="0 0 160 160" fill="none">
      <circle cx="80" cy="30" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="30" cy="130" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="130" cy="130" r="4" fill="currentColor" opacity="0.4"/>
      <line x1="80" y1="30" x2="30" y2="130" stroke="currentColor" stroke-width="0.5" stroke-dasharray="4 4"/>
      <line x1="80" y1="30" x2="130" y2="130" stroke="currentColor" stroke-width="0.5" stroke-dasharray="4 4"/>
      <line x1="30" y1="130" x2="130" y2="130" stroke="currentColor" stroke-width="0.5" stroke-dasharray="4 4"/>
      <circle cx="80" cy="80" r="2" fill="currentColor" opacity="0.6"/>
    </svg>

    <!-- Pulsing Dot Grid -->
    <svg class="absolute top-[45%] left-[12%] w-20 h-20 opacity-[0.06] pointer-events-none z-0" viewBox="0 0 80 80" fill="none">
      <circle cx="10" cy="10" r="1.5" fill="currentColor" class="animate-pulse"/>
      <circle cx="30" cy="10" r="1.5" fill="currentColor" class="animate-pulse" style="animation-delay: 0.3s"/>
      <circle cx="50" cy="10" r="1.5" fill="currentColor" class="animate-pulse" style="animation-delay: 0.6s"/>
      <circle cx="70" cy="10" r="1.5" fill="currentColor" class="animate-pulse" style="animation-delay: 0.9s"/>
      <circle cx="10" cy="30" r="1.5" fill="currentColor" class="animate-pulse" style="animation-delay: 0.2s"/>
      <circle cx="30" cy="30" r="1.5" fill="currentColor" class="animate-pulse" style="animation-delay: 0.5s"/>
      <circle cx="50" cy="30" r="1.5" fill="currentColor" class="animate-pulse" style="animation-delay: 0.8s"/>
      <circle cx="70" cy="30" r="1.5" fill="currentColor" class="animate-pulse" style="animation-delay: 1.1s"/>
      <circle cx="10" cy="50" r="1.5" fill="currentColor" class="animate-pulse" style="animation-delay: 0.4s"/>
      <circle cx="30" cy="50" r="1.5" fill="currentColor" class="animate-pulse" style="animation-delay: 0.7s"/>
      <circle cx="50" cy="50" r="1.5" fill="currentColor" class="animate-pulse" style="animation-delay: 1.0s"/>
      <circle cx="70" cy="50" r="1.5" fill="currentColor" class="animate-pulse" style="animation-delay: 1.3s"/>
    </svg>

    <!-- DNA Helix -->
    <svg class="absolute top-[55%] right-[10%] w-16 h-64 opacity-[0.04] pointer-events-none z-0 animate-float-medium" viewBox="0 0 60 250" fill="none">
      <path d="M10 10 C30 30, 50 30, 50 50 C50 70, 10 70, 10 90 C10 110, 50 110, 50 130 C50 150, 10 150, 10 170 C10 190, 50 190, 50 210 C50 230, 30 240, 10 240" stroke="currentColor" stroke-width="0.5"/>
      <path d="M50 10 C30 30, 10 30, 10 50 C10 70, 50 70, 50 90 C50 110, 10 110, 10 130 C10 150, 50 150, 50 170 C50 190, 10 190, 10 210 C10 230, 30 240, 50 240" stroke="currentColor" stroke-width="0.5"/>
    </svg>

    <!-- Transparent, Borderless, Header -->
    <nav class="sticky top-0 z-50 bg-transparent px-8 py-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        
        <!-- Logo -->
        <div class="flex items-center gap-3 cursor-pointer group" @click="scrollTo('hero')">
          <div class="w-8.5 h-8.5 rounded-xl bg-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <svg class="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
            </svg>
          </div>
          <span class="text-xs font-black tracking-widest uppercase text-white group-hover:text-purple-400 transition-colors duration-200">
            Kaizora <span class="text-purple-500">Scholar</span>
          </span>
        </div>

        <!-- Right: Theme Toggle + Login -->
        <div class="flex items-center gap-3">
          <!-- Theme Toggle Button -->
          <button 
            @click="toggleTheme" 
            class="p-2.5 rounded-xl border transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105 hover:-translate-y-0.5 flex items-center justify-center"
            :class="isDarkMode ? 'border-[#1e2040] text-gray-300 hover:text-white bg-[#10111c]' : 'border-gray-200 text-gray-600 hover:text-gray-800 bg-white'"
            title="Toggle Theme"
          >
            <svg v-if="isDarkMode" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 115.636 5.636a9 9 0 0112.728 12.728z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Login Button -->
          <router-link 
            to="/login"
            class="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 border border-purple-600 hover:border-purple-500 text-[10px] font-black rounded-xl text-white transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest shadow-md hover:shadow-purple-500/20"
          >
            Masuk Dashboard
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Section 1: Hero Section (Full Viewport Screen) -->
    <header id="hero" class="min-h-screen flex flex-col justify-center relative max-w-7xl mx-auto px-8 text-center z-10 -mt-20">
      <div class="space-y-6">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-purple-950/20 border border-purple-500/20 text-purple-300 text-[9px] font-black uppercase tracking-widest hover:border-purple-500/40 transition-colors duration-200 cursor-pointer">
          <span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
          <span>Bypass Engine v2.0 Online</span>
        </div>

        <!-- Giant Title -->
        <h1 class="text-5xl sm:text-7xl md:text-[84px] font-black tracking-tight text-white leading-[0.98] font-sans">
          Kuliah di UT Tanpa Kehilangan <br/>
          <span class="bg-gradient-to-r from-white via-purple-300 to-purple-500 bg-clip-text text-transparent">
            Waktu Istirahat
          </span> Selesai Kerja.
        </h1>

        <!-- Description -->
        <p class="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Bypass UI e-learning UT yang lambat. Otomatisasi absensi lengkap, rangkum modul tebal dengan AI Pareto 20%, dan susun draf jawaban diskusi akademis secara instan dalam satu dashboard super cepat.
        </p>

        <!-- CTA -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
          <router-link 
            to="/login"
            class="w-full sm:w-auto px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-purple-500/25"
          >
            <span>Mulai Akses Gratis</span>
            <svg class="w-3.5 h-3.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </router-link>
          
          <a 
            @click="scrollTo('video')"
            class="w-full sm:w-auto px-10 py-4 font-black rounded-xl text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center cursor-pointer border"
            :class="isDarkMode ? 'bg-[#10111c] hover:bg-[#161828] border-[#1e2040] text-gray-300 hover:text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900'"
          >
            Tonton Video Simulasi
          </a>
        </div>
      </div>
    </header>

    <!-- Section 2: Video Simulation (Full Viewport Screen) -->
    <section id="video" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-8 relative z-10 border-t border-white/[0.04]">
      <div class="text-center mb-12 reveal-item">
        <span class="text-[9px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/5 border border-purple-500/10 px-3.5 py-1.5 rounded-full">Simulasi Video Singkat</span>
        <h2 class="text-3xl md:text-[42px] font-black text-white mt-5">Lihat Kaizora Beraksi</h2>
        <p class="text-xs text-gray-400 mt-2 max-w-lg mx-auto">Tonton demo berdurasi 1 menit bagaimana scraper Moodle terhubung aman dan AI Pareto memangkas waktu belajar Anda.</p>
      </div>

      <!-- High-Fidelity Interactive Video Mockup Panel -->
      <div class="max-w-4xl mx-auto w-full bg-[#080913] border border-[#1b1c2b] rounded-3xl p-1 shadow-2xl relative overflow-hidden reveal-item">
        <div class="relative aspect-video rounded-[22px] bg-[#030307] overflow-hidden flex flex-col justify-between p-6">
          
          <!-- Simulated Video Screen Graphic -->
          <div class="absolute inset-0 flex items-center justify-center z-10 bg-black/40">
            <button 
              @click="toggleVideoPlay" 
              class="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <svg v-if="!isVideoPlaying" class="w-7 h-7 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
          </div>

          <!-- Video Background Simulation -->
          <div class="absolute inset-0 flex flex-col justify-between p-6 font-mono text-[9px] text-gray-500 select-none z-0">
            <div class="flex justify-between items-center">
              <span>CAMERA 01 // SECURE_SYNC_STREAM</span>
              <span class="text-purple-400 font-bold">● ACTIVE</span>
            </div>
            
            <!-- Dynamic Playing State Visuals -->
            <div class="space-y-1.5 max-w-md bg-[#05060b] border border-[#1b1c2b] p-4 rounded-xl text-left" :class="isVideoPlaying ? 'opacity-90 transition-opacity duration-300' : 'opacity-25'">
              <p class="text-purple-400">// BYPASS INITIALIZATION SEQUENCE</p>
              <p>NIM: 054308893 ... <span class="text-purple-400">FOUND</span></p>
              <p>AUTO-ATTENDANCE: <span class="text-purple-400 font-bold">[MARKED AS DONE]</span></p>
              <p>ALCHEMIST AI: Modul 4 compressed to 5 core concepts.</p>
            </div>

            <div class="flex justify-between text-[8px]">
              <span>RESOLVING MOODLE CAPTCHA... OK</span>
              <span>1080p @ 60 FPS</span>
            </div>
          </div>

          <!-- Video Custom Controller Bar -->
          <div class="w-full bg-[#05060b]/90 border border-[#1b1c2b] rounded-xl px-4 py-3 flex items-center justify-between gap-4 z-20 mt-auto">
            <button @click="toggleVideoPlay" class="text-purple-400 hover:text-white transition-colors duration-150">
              <svg v-if="!isVideoPlaying" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>

            <!-- Video Timeline slider -->
            <div class="flex-1 h-1 bg-[#121324] rounded-full relative overflow-hidden">
              <div 
                class="absolute top-0 left-0 h-full bg-purple-600 transition-all duration-300"
                :style="{ width: isVideoPlaying ? '65%' : '0%' }"
              ></div>
            </div>

            <div class="text-[9px] text-gray-400 font-bold font-mono">
              {{ isVideoPlaying ? '0:39' : '0:00' }} / 1:00
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Section 3: Bento Grid Feature (Full Viewport Screen) -->
    <section id="features" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-8 relative z-10 border-t border-white/[0.04]">
      
      <div class="text-center mb-16 reveal-item">
        <span class="text-[9px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/5 border border-purple-500/10 px-3.5 py-1.5 rounded-full">Bento Workspace Features</span>
        <h2 class="text-3xl md:text-[42px] font-black text-white mt-5">Satu Platform. Otomatisasi Sempurna.</h2>
        <p class="text-xs text-gray-400 mt-2 max-w-lg mx-auto">Kami menggabungkan data perkuliahan UT Anda dengan model AI canggih dalam dashboard solid berperforma ekstrem.</p>
      </div>

      <!-- 4-Block High-Fidelity Bento Grid (strictly dark and purple theme) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        
        <!-- Bento Cell 1: Auto-Attendance Terminal Mockup (Wide) -->
        <div class="md:col-span-2 bg-[#080913] border border-[#1b1c2b] rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xl reveal-item">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
              </div>
              <h3 class="text-base font-black text-white">Auto-Attendance Scheduler</h3>
            </div>
            <p class="text-xs text-gray-400 max-w-xl leading-relaxed">
              Sistem backend kami melakukan sinkronisasi berkala dengan server e-learning UT, mengkonfirmasi absensi Anda setiap kali sesi perkuliahan baru dirilis secara terjadwal otomatis.
            </p>
          </div>

          <!-- Live Mockup Component -->
          <div class="mt-6 border border-[#1d1f35] rounded-xl bg-[#030307] p-4 font-mono text-[10px]">
            <div class="flex items-center justify-between border-b border-[#1d1f35] pb-2 mb-3">
              <span class="text-gray-500 text-[9px] uppercase tracking-wider font-bold">Live Scheduler Log</span>
              <span class="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
            </div>
            <div class="space-y-1.5 text-gray-400">
              <p><span class="text-[#8b5cf6]">[18:00:03]</span> Connecting to moodle.ut.ac.id... <span class="text-purple-400">OK</span></p>
              <p><span class="text-[#8b5cf6]">[18:00:04]</span> Fetching course listing for NIM 054308893... <span class="text-purple-400">8 Matkul ditemukan</span></p>
              <p><span class="text-[#8b5cf6]">[18:00:06]</span> Session 4 Attendance MSIM4301 marked as <span class="text-purple-400 font-bold">DONE</span></p>
            </div>
          </div>
        </div>

        <!-- Bento Cell 2: Vector Search / Module (Narrow) -->
        <div class="bg-[#080913] border border-[#1b1c2b] rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xl reveal-item delay-100">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <h3 class="text-base font-black text-white">The Alchemist AI</h3>
            </div>
            <p class="text-xs text-gray-400 leading-relaxed">
              Meringkas materi 100+ halaman modul PDF menjadi 5 konsep inti Pareto yang sering diujikan di Ujian Akhir Semester.
            </p>
          </div>

          <!-- Staggered Active Tab Preview -->
          <div class="mt-6 p-4 rounded-xl bg-[#0c0d1b] border border-[#1d1f35] space-y-3">
            <div class="flex gap-2">
              <span class="px-2 py-0.5 rounded bg-[#1b1c2b] text-white text-[8px] font-bold">Modul 1</span>
              <span class="px-2 py-0.5 rounded bg-transparent text-gray-500 text-[8px] font-bold">Modul 2</span>
              <span class="px-2 py-0.5 rounded bg-transparent text-gray-500 text-[8px] font-bold">Modul 3</span>
            </div>
            <p class="text-[10px] text-gray-300 leading-normal">
              <strong>Prinsip Agility</strong>: Mengutamakan kolaborasi antar individu dan kecepatan merespons perubahan daripada dokumentasi kaku.
            </p>
          </div>
        </div>

        <!-- Bento Cell 3: Anti-Plagiarism Generator (Narrow) -->
        <div class="bg-[#080913] border border-[#1b1c2b] rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xl reveal-item delay-100">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <h3 class="text-base font-black text-white">Safe Anti-Fraud Engine</h3>
            </div>
            <p class="text-xs text-gray-400 leading-relaxed">
              Membuat draf jawaban forum diskusi akademik secara instan yang memiliki tingkat kemiripan kalimat di bawah batas deteksi sistem plagiarism UT.
            </p>
          </div>

          <!-- Plagiarism Score Meter Mockup -->
          <div class="mt-6 p-4 rounded-xl bg-[#0c0d1b] border border-[#1d1f35] flex items-center justify-between">
            <div>
              <span class="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">Similarity Rating</span>
              <span class="text-lg font-black text-purple-400 font-mono">2.8%</span>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] text-purple-400 font-black uppercase tracking-widest">Sangat Aman</span>
          </div>
        </div>

        <!-- Bento Cell 4: Top Up & Purchased Log (Wide) -->
        <div class="md:col-span-2 bg-[#080913] border border-[#1b1c2b] rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xl reveal-item">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 class="text-base font-black text-white">Roll-Over Extra Token</h3>
            </div>
            <p class="text-xs text-gray-400 max-w-xl leading-relaxed">
              Jika kuota bulanan habis, Anda dapat melakukan top-up saldo token instan menggunakan QRIS. Menariknya, kuota tambahan ini tidak akan pernah hangus ketika pergantian bulan.
            </p>
          </div>

          <!-- Purchased Token Roll Log Mockup -->
          <div class="mt-6 border border-[#1d1f35] rounded-xl bg-[#030307] overflow-hidden text-[9px] font-mono">
            <div class="grid grid-cols-3 bg-[#0d0e22] px-4 py-2 border-b border-[#1d1f35] font-black uppercase text-gray-400 tracking-wider">
              <span>Tanggal</span>
              <span>Jumlah</span>
              <span>Status</span>
            </div>
            <div class="px-4 py-2.5 space-y-2 text-gray-300">
              <div class="grid grid-cols-3">
                <span>2026-05-23</span>
                <span class="text-purple-400 font-bold">+100.000 Token</span>
                <span class="text-purple-400 font-bold">QRIS Sukses</span>
              </div>
              <div class="grid grid-cols-3">
                <span>2026-05-19</span>
                <span class="text-purple-400 font-bold">+50.000 Token</span>
                <span class="text-purple-400 font-bold">QRIS Sukses</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Section 4: Interactive Playground (Full Viewport Screen) -->
    <section id="playground" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-8 relative z-10 border-t border-[#1b1c2b]">
      
      <div class="text-center mb-16 reveal-item">
        <span class="text-[9px] font-black uppercase tracking-widest text-purple-400">Playground Simulasi</span>
        <h2 class="text-3xl md:text-[40px] font-black text-white mt-5">Lihat Cara Kerja Sistem</h2>
        <p class="text-xs text-gray-400 mt-2 max-w-lg mx-auto">Pilih fitur di bawah ini untuk melihat simulasi input e-learning dan output respons AI akademis.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto items-stretch reveal-item">
        
        <!-- Left Panel: Playground Tabs Switcher -->
        <div class="lg:col-span-2 space-y-3.5 flex flex-col justify-center">
          
          <button 
            @click="activePlaygroundTab = 'absensi'"
            :class="activePlaygroundTab === 'absensi' ? 'border-purple-500 bg-[#0d0e22] text-white shadow-lg' : 'border-[#1b1c2b] bg-transparent text-gray-400 hover:text-white'"
            class="w-full text-left p-5 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all duration-200"
          >
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full" :class="activePlaygroundTab === 'absensi' ? 'bg-purple-500' : 'bg-gray-600'"></span>
              <span>1. Otomatisasi Absensi</span>
            </div>
            <p class="text-[10px] text-gray-500 font-medium normal-case mt-1.5 leading-relaxed">
              Bypass navigasi lambat Moodle UT dengan penjadwalan mandiri.
            </p>
          </button>

          <button 
            @click="activePlaygroundTab = 'ringkasan'"
            :class="activePlaygroundTab === 'ringkasan' ? 'border-purple-500 bg-[#0d0e22] text-white shadow-lg' : 'border-[#1b1c2b] bg-transparent text-gray-400 hover:text-white'"
            class="w-full text-left p-5 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all duration-200"
          >
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full" :class="activePlaygroundTab === 'ringkasan' ? 'bg-purple-500' : 'bg-gray-600'"></span>
              <span>2. Rangkum Buku Materi Pokok</span>
            </div>
            <p class="text-[10px] text-gray-500 font-medium normal-case mt-1.5 leading-relaxed">
              Model AI memilah 20% isi modul penting pembawa 80% pemahaman.
            </p>
          </button>

          <button 
            @click="activePlaygroundTab = 'jawaban'"
            :class="activePlaygroundTab === 'jawaban' ? 'border-purple-500 bg-[#0d0e22] text-white shadow-lg' : 'border-[#1b1c2b] bg-transparent text-gray-400 hover:text-white'"
            class="w-full text-left p-5 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all duration-200"
          >
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full" :class="activePlaygroundTab === 'jawaban' ? 'bg-purple-500' : 'bg-gray-600'"></span>
              <span>3. Susun Draf Diskusi</span>
            </div>
            <p class="text-[10px] text-gray-500 font-medium normal-case mt-1.5 leading-relaxed">
              Ketik kerangka jawaban akademis yang aman dari indikator plagiat.
            </p>
          </button>

        </div>

        <!-- Right Panel: Dynamic Tab Workspace Screen -->
        <div class="lg:col-span-3 bg-[#080913] border border-[#1b1c2b] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          
          <div class="flex items-center justify-between px-6 py-4 bg-[#05060b] border-b border-[#1b1c2b]">
            <span class="text-[9px] font-black uppercase tracking-widest text-purple-400">Terminal Preview</span>
            <div class="flex gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-[#1b1c2b]"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-[#1b1c2b]"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            </div>
          </div>

          <div class="p-6 md:p-8 flex-1 font-mono text-xs leading-relaxed text-gray-300">
            
            <!-- Tab Absensi Content -->
            <div v-if="activePlaygroundTab === 'absensi'" class="space-y-4">
              <p class="text-gray-500">// Menjalankan Bypass Kehadiran Sesi 4</p>
              <div class="space-y-1.5">
                <p>NIM Mahasiswa: <span class="text-white font-bold">054308893</span></p>
                <p>Mata Kuliah: <span class="text-purple-400 font-bold">MSIM4301 Rekayasa Perangkat Lunak</span></p>
                <p>Status Moodle: <span class="text-purple-400 font-bold">Menunggu Sinkronisasi Sesi...</span></p>
              </div>
              <div class="p-4 rounded bg-[#030307] border border-[#1d1f35] space-y-1.5 text-gray-400">
                <p>✓ Menarik daftar token login e-learning... Sukses</p>
                <p>✓ Membuka post form kehadiran sesi 4... Sukses</p>
                <p>✓ Mengirimkan konfirmasi attendance... <span class="text-purple-400 font-bold">DISETUJUI</span></p>
              </div>
            </div>

            <!-- Tab Ringkasan Content -->
            <div v-if="activePlaygroundTab === 'ringkasan'" class="space-y-4">
              <p class="text-gray-500">// Hasil Ekstraksi AI Pareto (Modul 4 Halaman 45-98)</p>
              <div class="space-y-1">
                <h4 class="text-white font-bold text-xs uppercase tracking-wider">Topik: Analisis Kelayakan Perangkat Lunak</h4>
                <p class="text-purple-400 font-semibold">Model Analisis: 3 Poin Konsep Utama</p>
              </div>
              <div class="p-4 rounded bg-[#030307] border border-[#1d1f35] space-y-3 text-gray-400">
                <p>1. <span class="text-white font-bold">Kelayakan Operasional</span>: Mengukur sejauh mana sistem baru dapat diterima dan dioperasikan oleh pengguna akhir UT.</p>
                <p>2. <span class="text-white font-bold">Kelayakan Teknis</span>: Mengevaluasi ketersediaan infrastruktur jaringan, hardware, dan kesiapan teknologi pendukung.</p>
                <p>3. <span class="text-white font-bold">Kelayakan Ekonomis</span>: Membandingkan biaya pengembangan (cost) dengan nilai manfaat jangka panjang (benefit).</p>
              </div>
            </div>

            <!-- Tab Jawaban Content -->
            <div v-if="activePlaygroundTab === 'jawaban'" class="space-y-4">
              <p class="text-gray-500">// Draft Jawaban Diskusi AI Akademis Terstruktur</p>
              <div class="space-y-1.5">
                <p class="text-[10px] text-gray-500 uppercase tracking-widest">Prompt Pertanyaan Forum:</p>
                <p class="text-white text-[11px] leading-normal font-bold">"Jelaskan mengapa model spiral lebih cocok untuk pengembangan perangkat lunak skala besar?"</p>
              </div>
              
              <!-- Typing Simulation Response Container -->
              <div class="p-4 rounded bg-[#030307] border border-[#1d1f35] space-y-2 text-gray-400">
                <p class="text-[#c084fc] font-bold text-[9px] uppercase tracking-wider">KAIZORA SCHOLAR AI WRITER:</p>
                <p class="text-[11px] leading-normal italic text-gray-300">
                  "Model Spiral sangat relevan untuk proyek perangkat lunak skala besar karena memprioritaskan analisis risiko di setiap siklus evolusinya. Melalui integrasi pendekatan prototipe berulang, tim dapat mendeteksi kegagalan teknis secara dini sebelum memasuki tahapan penulisan kode massal..."
                </p>
                <div class="flex justify-between items-center text-[8px] text-gray-500 pt-2">
                  <span>Akurasi Model: 98.6%</span>
                  <span class="text-purple-400 font-bold font-black">Copy to Clipboard ✓</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- Section 5: Token Analytics Simulator (Full Viewport Screen) -->
    <section id="simulator" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-8 relative z-10 border-t border-[#1b1c2b]">
      <div class="max-w-4xl mx-auto bg-[#080913] border border-[#1b1c2b] p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl reveal-item">
        
        <div class="text-center mb-12">
          <span class="text-[9px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/5 border border-purple-500/10 px-3.5 py-1.5 rounded-full">Kalkulator Penggunaan Token AI</span>
          <h2 class="text-2xl md:text-3.5xl font-black text-white mt-4">Simulasikan Kebutuhan Token Anda</h2>
          <p class="text-xs text-gray-400 mt-2 max-w-md mx-auto">Sesuaikan dengan jumlah mata kuliah yang Anda ambil di semester ini.</p>
        </div>

        <div class="space-y-10">
          <!-- Slider Control -->
          <div class="space-y-5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Mata Kuliah Diambil:</span>
              <span class="text-xl text-purple-400 font-black font-mono">{{ coursesCount }} Matkul</span>
            </div>
            
            <div class="relative">
              <input 
                type="range" 
                min="1" 
                max="8" 
                v-model.number="coursesCount"
                class="w-full h-1.5 bg-[#121324] rounded-lg appearance-none cursor-pointer accent-purple-500 border border-white/5"
              />
            </div>
            
            <div class="flex justify-between text-[9px] text-gray-500 font-extrabold uppercase tracking-widest">
              <span>1 Mata Kuliah</span>
              <span>4 Mata Kuliah</span>
              <span>8 Mata Kuliah (Maks)</span>
            </div>
          </div>

          <div class="h-[1px] bg-white/[0.04]"></div>

          <!-- Calculation Displays -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="space-y-2">
              <span class="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Estimasi Kuota AI Dibutuhkan:</span>
              <div class="text-3xl md:text-4xl font-black text-white font-mono flex items-baseline gap-1.5">
                {{ formattedTokensNeeded }}
                <span class="text-xs font-bold text-gray-400">Token</span>
              </div>
              <p class="text-[11px] text-gray-400 leading-relaxed">
                Total estimasi kuota yang dibutuhkan untuk menutupi seluruh pengerjaan modul sesi 1-8, auto-absensi, dan tugas terstruktur per mata kuliah.
              </p>
            </div>

            <!-- Recommendation Box -->
            <div class="p-6 rounded-2xl border border-[#1b1c2b] bg-[#030307] relative group overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-500/[0.02] to-indigo-500/[0.02] opacity-100"></div>
              <span class="text-[9px] font-extrabold uppercase tracking-widest text-gray-500 block mb-1">Rekomendasi Paket Kaizora:</span>
              <span class="text-sm font-black text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent block mb-2">
                {{ recommendedPlan.name }}
              </span>
              <p class="text-[11px] text-gray-400 leading-relaxed">
                {{ recommendedPlan.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 6: Pricing Tier (Full Viewport Screen) -->
    <section id="pricing" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-8 relative z-10 border-t border-white/[0.04]">
      <div class="text-center mb-16 reveal-item">
        <span class="text-[9px] font-black uppercase tracking-widest text-purple-400">Skema Investasi Belajar</span>
        <h2 class="text-3xl md:text-4xl font-black text-white mt-2">Investasi Belajar Tanpa Batas</h2>
        <p class="text-xs text-gray-400 mt-2 max-w-lg mx-auto">Semua paket dilengkapi fungsionalitas bypass dasar. Upgrade paket Anda kapan saja untuk kuota AI lebih besar.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
        
        <!-- Tier Free -->
        <div class="bg-[#080913] border border-[#1b1c2b] p-8 rounded-3xl flex flex-col justify-between hover:border-purple-500/20 transition-all duration-200 shadow-xl reveal-item delay-100">
          <div>
            <span class="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Uji Coba Sistem</span>
            <h3 class="text-lg font-bold text-white mt-1">Paket GRATIS</h3>
            <p class="text-xs text-gray-400 mt-3 leading-relaxed">Setara dengan membaca 1-2 ringkasan materi pendek saja. Sempurna untuk mengetes koneksi akun UT Anda.</p>
            <div class="my-6">
              <span class="text-3xl font-black text-white font-mono">Rp 0</span>
              <span class="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold"> / selamanya</span>
            </div>
            <div class="h-[1px] bg-[#1b1c2b] my-5"></div>
            <ul class="space-y-3.5 text-xs text-gray-400">
              <li class="flex items-center gap-2.5">
                <span class="text-purple-400">✓</span>
                <span>Maks 10.000 Token AI / Bulan</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-400">✓</span>
                <span>Bypass Sinkronisasi e-learning UT</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-400">✓</span>
                <span>Auto-Absensi e-learning</span>
              </li>
            </ul>
          </div>
          <router-link 
            to="/login"
            class="w-full py-3.5 mt-8 text-xs font-bold rounded-xl text-center transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 uppercase tracking-widest cursor-pointer border flex items-center justify-center"
            :class="isDarkMode ? 'bg-[#10111c] hover:bg-[#161828] border-[#1e2040] text-gray-300 hover:text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900'"
          >
            Mulai Percobaan
          </router-link>
        </div>

        <!-- Tier Premium -->
        <div class="bg-[#080913] border-2 border-purple-500/30 p-8 rounded-3xl flex flex-col justify-between relative hover:border-purple-500/50 transition-all duration-200 shadow-xl shadow-purple-500/[0.03] reveal-item delay-200">
          <div class="absolute top-0 right-6 -translate-y-1/2 px-3.5 py-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full text-[8px] font-extrabold uppercase tracking-widest text-white shadow-md">
            Rekomendasi Utama
          </div>
          <div>
            <span class="text-[9px] font-extrabold text-purple-400 uppercase tracking-widest font-black">The Scholar</span>
            <h3 class="text-lg font-bold text-white mt-1">Paket PREMIUM</h3>
            <p class="text-xs text-gray-400 mt-3 leading-relaxed">Pilihan tepat untuk mengcover 4-8 mata kuliah. Setara dengan membaca ~50 ringkasan modul penuh & tugas AI.</p>
            <div class="my-6">
              <span class="text-3xl font-black text-white font-mono">Rp 49.000</span>
              <span class="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold"> / bulan</span>
            </div>
            <div class="h-[1px] bg-[#1b1c2b] my-5"></div>
            <ul class="space-y-3.5 text-xs text-gray-400">
              <li class="flex items-center gap-2.5">
                <span class="text-purple-400">✓</span>
                <span class="text-white font-semibold">Maks 750.000 Token AI / Bulan</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-400">✓</span>
                <span>Pareto Summarizer Tanpa Batas</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-400">✓</span>
                <span>Auto Attendance & Mark as Done</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-400">✓</span>
                <span>Generator Jawaban Forum Diskusi</span>
              </li>
            </ul>
          </div>
          <router-link 
            to="/login"
            class="w-full py-3.5 mt-8 bg-purple-600 hover:bg-purple-500 text-xs font-bold rounded-xl text-white text-center transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 uppercase tracking-widest cursor-pointer shadow-md hover:shadow-purple-500/20 flex items-center justify-center"
          >
            Upgrade ke Premium
          </router-link>
        </div>

        <!-- Tier Elite -->
        <div class="bg-[#080913] border border-[#1b1c2b] p-8 rounded-3xl flex flex-col justify-between hover:border-purple-500/20 transition-all duration-200 shadow-xl reveal-item delay-300">
          <div>
            <span class="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">The Bypass Engine</span>
            <h3 class="text-lg font-bold text-white mt-1">Paket ELITE</h3>
            <p class="text-xs text-gray-400 mt-3 leading-relaxed">Dibuat khusus untuk otomatisasi penuh beban belajar ekstrem. Ditenagai engine akademik Kaizora respons penalaran tinggi.</p>
            <div class="my-6">
              <span class="text-3xl font-black text-white font-mono">Rp 99.000</span>
              <span class="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold"> / bulan</span>
            </div>
            <div class="h-[1px] bg-[#1b1c2b] my-5"></div>
            <ul class="space-y-3.5 text-xs text-gray-400">
              <li class="flex items-center gap-2.5">
                <span class="text-purple-400">✓</span>
                <span class="text-white font-semibold">Maks 2.500.000 Token AI / Bulan</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-400">✓</span>
                <span>Engine Akademik Penalaran Tinggi (Kaizora Core)</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-400">✓</span>
                <span>Jalur Koneksi Crawling e-learning Prioritas</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-400">✓</span>
                <span>Integrasi Kustom & Bantuan Premium 24/7</span>
              </li>
            </ul>
          </div>
          <router-link 
            to="/login"
            class="w-full py-3.5 mt-8 text-xs font-bold rounded-xl text-center transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 uppercase tracking-widest cursor-pointer border flex items-center justify-center"
            :class="isDarkMode ? 'bg-[#10111c] hover:bg-[#161828] border-[#1e2040] text-gray-300 hover:text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900'"
          >
            Ambil Paket Elite
          </router-link>
        </div>
      </div>
    </section>

    <!-- Section 7: Dynamic Expanded FAQs (Full Viewport Screen) -->
    <section class="min-h-screen flex flex-col justify-center max-w-4xl mx-auto px-8 relative z-10 border-t border-white/[0.04]">
      <div class="text-center mb-16 reveal-item">
        <span class="text-[9px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/5 border border-purple-500/10 px-3.5 py-1.5 rounded-full">Pertanyaan Umum</span>
        <h2 class="text-3xl font-black text-white mt-5">FAQ & Bantuan Akademis</h2>
        <p class="text-xs text-gray-400 mt-2 max-w-md mx-auto">Klik salah satu pertanyaan di bawah untuk membaca jawaban interaktif mengenai protokol bypass Kaizora.</p>
      </div>

      <!-- Vue-Driven Dynamic Accordion Grid -->
      <div class="space-y-4 max-w-3xl mx-auto w-full reveal-item">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="border border-[#1b1c2b] bg-[#080913] rounded-2xl overflow-hidden transition-all duration-300"
        >
          <button 
            @click="toggleFaq(index)"
            class="w-full flex items-center justify-between px-6 py-5 text-left font-black text-xs uppercase tracking-wider text-white hover:text-purple-400 transition-colors duration-150 cursor-pointer"
          >
            <span>{{ faq.q }}</span>
            <svg 
              class="w-4 h-4 text-purple-400 transition-transform duration-300"
              :class="activeFaqIndex === index ? 'rotate-180' : ''"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          
          <!-- Smooth height expansion wrapper -->
          <div 
            v-show="activeFaqIndex === index" 
            class="px-6 pb-6 text-xs text-gray-400 leading-relaxed border-t border-white/[0.02] pt-4"
          >
            {{ faq.a }}
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-[#1b1c2b] bg-[#020204] py-16 px-6 text-center text-xs text-gray-500 relative z-10">
      <div class="max-w-7xl mx-auto space-y-3">
        <p class="font-bold text-gray-400">Kaizora Scholar Platform - Developed by Fadjar Setiawan for Universitas Terbuka.</p>
        <p class="text-[10px] text-gray-600 max-w-xl mx-auto leading-relaxed">
          Layanan ini bersifat independen untuk mempermudah administrasi belajar mahasiswa UT. Merek dan logo Universitas Terbuka dan Moodle adalah milik masing-masing pemilik hak cipta.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

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

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('kaizora_dark_mode', isDarkMode.value);
  updateDOMTheme();
};

const coursesCount = ref(4);
const activePlaygroundTab = ref('absensi');
const isVideoPlaying = ref(false);
const activeFaqIndex = ref(null);

const faqs = ref([
  {
    q: 'Apakah Kaizora menyimpan kata sandi Moodle UT saya?',
    a: 'Tidak sama sekali secara mentah. Kata sandi Moodle Anda dienkripsi secara militer menggunakan AES-256-GCM langsung dari peramban Anda, dan hanya diteruskan secara aman ke server e-learning UT untuk melakukan sinkronisasi modul akademik Anda secara instan.'
  },
  {
    q: 'Bagaimana Kaizora menjamin jawaban diskusi aman dari deteksi plagiarisme?',
    a: 'The Alchemist AI menyusun draf jawaban forum diskusi menggunakan teknik parafrasa akademis terstruktur dan mencocokkannya secara real-time dengan database Moodle UT, menjamin tingkat kemiripan (similarity score) berada di bawah ambang batas aman 5%.'
  },
  {
    q: 'Apa itu fitur kuota Token AI Roll-Over?',
    a: 'Jika kuota bulanan dasar paket Anda habis, Anda dapat melakukan top-up token instan kapan saja. Kuota token tambahan dari top-up ini bersifat Roll-Over, artinya sisa token tersebut tidak akan pernah hangus atau di-reset saat pergantian bulan.'
  },
  {
    q: 'Apakah proses sinkronisasi ini dapat diakses melalui handphone?',
    a: 'Sangat bisa. Seluruh antarmuka Kaizora dirancang dengan pendekatan Mobile-First yang responsif. Anda dapat melakukan sinkronisasi perkuliahan, membaca ringkasan AI, dan menyalin draf jawaban langsung dari layar smartphone Anda.'
  },
  {
    q: 'Berapa lama waktu yang dihemat setiap minggu dengan Kaizora?',
    a: 'Berdasarkan statistik riil dari mahasiswa aktif UT yang menggunakan Kaizora, rata-rata mahasiswa menghemat antara 8 hingga 14 jam per minggu yang biasanya dihabiskan untuk membaca modul tebal dan mengurus administrasi absensi secara manual.'
  },
  {
    q: 'Bagaimana cara kerja sistem Auto-Attendance Bypass?',
    a: 'Setelah Anda melakukan sinkronisasi pertama kali, scheduler backend kami secara terjadwal otomatis mengirimkan sinyal kehadiran sesi e-learning ke server UT tepat waktu setiap kali sesi mingguan baru dirilis.'
  }
]);

// Token Math: 62.500 tokens needed per course for normal usage per semester
const tokensNeeded = computed(() => {
  return coursesCount.value * 62500;
});

const formattedTokensNeeded = computed(() => {
  return new Intl.NumberFormat('id-ID').format(tokensNeeded.value);
});

// Dynamic Recommended Plan
const recommendedPlan = computed(() => {
  const tokens = tokensNeeded.value;
  if (tokens <= 10000) {
    return {
      name: 'Paket Explorer (Gratis)',
      desc: 'Sangat pas bagi Anda yang hanya mengambil 1 mata kuliah singkat atau sekadar menguji kemampuan visual bypass.'
    };
  } else if (tokens <= 750000) {
    return {
      name: 'Paket Scholar (Premium) — Paling Direkomendasikan!',
      desc: 'Batas kuota 750.000 Token sangat aman untuk mengcover seluruh kebutuhan ringkasan modul tebal dan tugas 4-8 mata kuliah dalam sebulan penuh.'
    };
  } else {
    return {
      name: 'Paket Elite (Bypass Engine)',
      desc: 'Sangat direkomendasikan untuk mahasiswa dengan beban belajar penuh 8 mata kuliah yang ingin bypass instan dengan performa engine akademik Kaizora.'
    };
  }
});

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const toggleVideoPlay = () => {
  isVideoPlaying.value = !isVideoPlaying.value;
};

const toggleFaq = (index) => {
  if (activeFaqIndex.value === index) {
    activeFaqIndex.value = null;
  } else {
    activeFaqIndex.value = index;
  }
};

// Apple/Supabase style scroll reveal
onMounted(() => {
  updateDOMTheme();
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-item').forEach(el => {
    observer.observe(el);
  });
});
</script>

<style>
/* ─── Scroll Reveal ─── */
.reveal-item {
  opacity: 0;
  transform: translateY(35px);
  transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}
.reveal-item.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ─── Floating SVG Animations ─── */
@keyframes float-slow {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-18px) rotate(3deg); }
}
@keyframes float-medium {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(-2deg); }
}
@keyframes float-reverse {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(14px) rotate(2deg); }
}
.animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
.animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
.animate-float-reverse { animation: float-reverse 7s ease-in-out infinite; }

/* ─── Theme Variables ─── */
.light-theme {
  --bg-main: #f8fafc;
  --bg-card: #ffffff;
  --bg-hover: #f1f5f9;
  --border-color: #e8eaf0;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --purple-accent: #7c3aed;
  --purple-text: #6d28d9;
}
.dark-theme {
  --bg-main: #0b0c14;
  --bg-card: #10111c;
  --bg-hover: #161828;
  --border-color: #1e2040;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --purple-accent: #a78bfa;
  --purple-text: #a78bfa;
}

.bg-theme-main { background-color: var(--bg-main) !important; }
.bg-theme-card { background-color: var(--bg-card) !important; }
.text-theme-primary { color: var(--text-primary) !important; }

/* ─── Override Hardcoded BGs ─── */
.light-theme [class*="bg-[#020205]"],
.light-theme [class*="bg-[#080913]"],
.light-theme [class*="bg-[#0d0d18]"],
.light-theme [class*="bg-[#0c0d1b]"],
.light-theme [class*="bg-[#05060b]"],
.light-theme [class*="bg-[#0a0b12]"],
.light-theme [class*="bg-[#030307]"],
.light-theme [class*="bg-[#0d0e22]"],
.light-theme [class*="bg-[#121324]"],
.light-theme [class*="bg-black"] {
  background-color: var(--bg-card) !important;
  box-shadow: none !important;
}
.light-theme [class*="bg-[#020205]"], .light-theme [class*="bg-[#030307]"] {
  background-color: var(--bg-main) !important;
}

.dark-theme [class*="bg-[#020205]"],
.dark-theme [class*="bg-[#080913]"],
.dark-theme [class*="bg-[#0d0d18]"],
.dark-theme [class*="bg-[#0c0d1b]"],
.dark-theme [class*="bg-[#05060b]"],
.dark-theme [class*="bg-[#0a0b12]"],
.dark-theme [class*="bg-[#030307]"],
.dark-theme [class*="bg-[#0d0e22]"],
.dark-theme [class*="bg-[#121324]"] {
  background-color: var(--bg-card) !important;
  box-shadow: none !important;
}
.dark-theme [class*="bg-[#020205]"], .dark-theme [class*="bg-[#030307]"] {
  background-color: var(--bg-main) !important;
}

/* ─── Override Borders ─── */
.light-theme [class*="border-[#1b1c2b]"],
.light-theme [class*="border-[#1d1f35]"],
.light-theme [class*="border-white/"] {
  border-color: var(--border-color) !important;
}
.dark-theme [class*="border-[#1b1c2b]"],
.dark-theme [class*="border-[#1d1f35]"],
.dark-theme [class*="border-white/"] {
  border-color: var(--border-color) !important;
}

/* ─── Text Overrides ─── */
.light-theme .text-white { color: var(--text-primary) !important; }
.light-theme .text-gray-200,
.light-theme .text-gray-300 { color: var(--text-primary) !important; }
.light-theme .text-gray-400 { color: var(--text-secondary) !important; }
.light-theme .text-gray-500 { color: var(--text-muted) !important; }

.light-theme .text-purple-300,
.light-theme .text-purple-400,
.light-theme .text-purple-500 { color: var(--purple-text) !important; }

.dark-theme .text-purple-300,
.dark-theme .text-purple-400,
.dark-theme .text-purple-500 { color: var(--purple-text) !important; }

/* ─── Gradient Text → Solid Purple in Light Mode ─── */
.light-theme .bg-gradient-to-r {
  background-image: none !important;
  background-clip: unset !important;
  -webkit-background-clip: unset !important;
  -webkit-text-fill-color: unset !important;
  color: var(--purple-accent) !important;
}

/* ─── Strip shadows ─── */
.shadow-2xl, .shadow-xl, .shadow-lg, .shadow-md {
  box-shadow: none !important;
}
</style>
