<template>
  <div :class="isDarkMode ? 'dark-theme' : 'light-theme'" class="min-h-screen bg-theme-main text-theme-primary font-sans antialiased overflow-x-hidden relative selection:bg-purple-600/30 selection:text-white transition-colors duration-700">
    
    <!-- Immersive Interactive Cosmic Canvas Background -->
    <canvas ref="canvasRef" class="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"></canvas>
    
    <!-- Spatial Background Glows -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-[40%] -right-[30%] w-[80%] aspect-square rounded-full bg-gradient-radial from-purple-500/10 to-transparent blur-[120px] dark:from-purple-600/5"></div>
      <div class="absolute -bottom-[30%] -left-[20%] w-[70%] aspect-square rounded-full bg-gradient-radial from-indigo-500/10 to-transparent blur-[120px] dark:from-indigo-600/5"></div>
    </div>

    <!-- Cinematic Navigation Header -->
    <nav class="sticky top-0 z-50 bg-transparent backdrop-blur-md border-b border-theme-nav px-8 py-5 transition-all duration-300">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        
        <!-- Logo with Elegant Micro-Interaction -->
        <div class="flex items-center gap-3 cursor-pointer group" @click="scrollTo('hero')">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
            </svg>
          </div>
          <span class="text-xs font-black tracking-widest uppercase text-theme-primary group-hover:text-purple-400 transition-colors duration-200">
            Kaizora <span class="text-purple-500">Scholar</span>
          </span>
        </div>

        <!-- Right: Theme Switcher + Elegant CTA -->
        <div class="flex items-center gap-4">
          <!-- Ambient Theme Switcher -->
          <button 
            @click="toggleTheme" 
            class="p-2.5 rounded-xl border border-theme-btn transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105 hover:-translate-y-0.5 flex items-center justify-center bg-theme-card hover:border-purple-500/40"
            title="Toggle Theme"
          >
            <svg v-if="isDarkMode" class="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 115.636 5.636a9 9 0 0112.728 12.728z" />
            </svg>
            <svg v-else class="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Magnetic Dashboard Access -->
          <router-link 
            to="/login"
            class="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-[10px] font-black rounded-xl text-white transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest shadow-lg shadow-purple-500/10 flex items-center gap-1.5"
          >
            <span>Masuk Dashboard</span>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Section 1: Hero Scene (Full Viewport Screen) -->
    <header id="hero" class="min-h-[92vh] flex flex-col justify-center relative max-w-7xl mx-auto px-8 text-center z-10 -mt-20">
      <div class="space-y-8 max-w-4xl mx-auto reveal-item">
        
        <!-- Interactive Glowing Badge -->
        <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 dark:text-purple-300 text-[10px] font-extrabold uppercase tracking-widest hover:border-purple-500/40 transition-all duration-300 cursor-pointer shadow-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
          <span>Bypass Engine v2.0 Online</span>
        </div>

        <!-- Giant Spatial Title -->
        <h1 class="text-4xl sm:text-6xl md:text-[80px] font-black tracking-tight text-theme-primary leading-[1.05] font-sans">
          Kuliah di UT Tanpa Kehilangan <br/>
          <span class="bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400 bg-clip-text text-transparent dark:from-white dark:via-purple-300 dark:to-purple-500">
            Waktu Istirahat
          </span> Selesai Kerja.
        </h1>

        <!-- Cinematic Description -->
        <p class="text-sm md:text-lg text-theme-secondary max-w-2xl mx-auto leading-relaxed font-medium">
          Bypass UI e-learning UT yang lambat. Otomatisasi absensi lengkap, rangkum modul tebal dengan AI Pareto 20%, dan susun draf jawaban diskusi akademis secara instan dalam satu dashboard super cepat.
        </p>

        <!-- CTA Cluster with Smooth Motion -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
          <router-link 
            to="/login"
            class="w-full sm:w-auto px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-purple-500/25"
          >
            <span>Mulai Akses Gratis</span>
            <svg class="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </router-link>
          
          <a 
            @click="scrollTo('video')"
            class="w-full sm:w-auto px-10 py-4 font-black rounded-xl text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 flex items-center justify-center cursor-pointer border border-theme-btn bg-theme-card text-theme-primary"
          >
            Tonton Video Simulasi
          </a>
        </div>
      </div>
    </header>

    <!-- Section 2: Video Simulation Scene (Cinematic Showcase) -->
    <section id="video" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-8 py-24 relative z-10 border-t border-theme-divider">
      <div class="text-center mb-16 reveal-item">
        <span class="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/5 border border-purple-500/10 px-4 py-2 rounded-full">Simulasi Video Singkat</span>
        <h2 class="text-3xl md:text-[44px] font-black text-theme-primary mt-6 leading-tight">Lihat Kaizora Beraksi</h2>
        <p class="text-sm text-theme-secondary mt-3 max-w-xl mx-auto leading-relaxed">Tonton demo berdurasi 1 menit bagaimana scraper Moodle terhubung aman dan AI Pareto memangkas waktu belajar Anda.</p>
      </div>

      <!-- High-Fidelity Interactive Video Mockup Panel -->
      <div class="max-w-4xl mx-auto w-full bg-theme-card border border-theme p-1.5 rounded-[28px] shadow-2xl relative overflow-hidden reveal-item">
        <div class="relative aspect-video rounded-[22px] bg-black overflow-hidden flex flex-col justify-between p-6">
          
          <!-- Simulated Video Screen Graphic Overlay -->
          <div class="absolute inset-0 flex items-center justify-center z-10 bg-black/45 backdrop-blur-[2px]">
            <button 
              @click="toggleVideoPlay" 
              class="w-18 h-18 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl shadow-purple-600/35 transition-transform duration-300 hover:scale-110 active:scale-90 cursor-pointer"
            >
              <svg v-if="!isVideoPlaying" class="w-8 h-8 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <svg v-else class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
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
              <p class="text-purple-400 font-bold">// BYPASS INITIALIZATION SEQUENCE</p>
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
            <button @click="toggleVideoPlay" class="text-purple-400 hover:text-white transition-colors duration-150 cursor-pointer">
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

    <!-- Section 3: Bento Grid Feature (Cinematic Space Architecture) -->
    <section id="features" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-8 py-24 relative z-10 border-t border-theme-divider">
      
      <div class="text-center mb-20 reveal-item">
        <span class="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/5 border border-purple-500/10 px-4 py-2 rounded-full">Bento Workspace Features</span>
        <h2 class="text-3xl md:text-[44px] font-black text-theme-primary mt-6 leading-tight">Satu Platform. Otomatisasi Sempurna.</h2>
        <p class="text-sm text-theme-secondary mt-3 max-w-xl mx-auto leading-relaxed">Kami menggabungkan data perkuliahan UT Anda dengan model AI canggih dalam dashboard solid berperforma ekstrem.</p>
      </div>

      <!-- 4-Block Bento Grid with layered depth & subtle borders -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        
        <!-- Bento Cell 1: Auto-Attendance Terminal Mockup (Wide) -->
        <div class="md:col-span-2 bg-theme-card border border-theme rounded-[24px] p-8 flex flex-col justify-between shadow-lg hover:border-purple-500/20 transition-all duration-300 group reveal-item">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-black text-theme-primary">Auto-Attendance Scheduler</h3>
            </div>
            <p class="text-xs text-theme-secondary max-w-xl leading-relaxed">
              Sistem backend kami melakukan sinkronisasi berkala dengan server e-learning UT, mengkonfirmasi kehadiran absensi Anda setiap kali sesi perkuliahan baru dirilis secara terjadwal otomatis.
            </p>
          </div>

          <!-- Live Mockup Component -->
          <div class="mt-8 border border-theme rounded-xl bg-theme-main p-4 font-mono text-[10px]">
            <div class="flex items-center justify-between border-b border-theme pb-2.5 mb-3.5">
              <span class="text-theme-secondary text-[9px] uppercase tracking-wider font-bold">Live Scheduler Log</span>
              <span class="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
            </div>
            <div class="space-y-2 text-theme-secondary">
              <p><span class="text-[#8b5cf6] font-bold">[18:00:03]</span> Connecting to e-learning server... <span class="text-green-500 font-bold">OK</span></p>
              <p><span class="text-[#8b5cf6] font-bold">[18:00:04]</span> Fetching course listing for NIM 054308893... <span class="text-purple-500 font-bold">8 Matkul ditemukan</span></p>
              <p><span class="text-[#8b5cf6] font-bold">[18:00:06]</span> Session 4 Attendance MSIM4301 marked as <span class="text-green-500 font-bold font-black">[DONE]</span></p>
            </div>
          </div>
        </div>

        <!-- Bento Cell 2: Vector Search / Module (Narrow) -->
        <div class="bg-theme-card border border-theme rounded-[24px] p-8 flex flex-col justify-between shadow-lg hover:border-purple-500/20 transition-all duration-300 group reveal-item delay-100">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <h3 class="text-lg font-black text-theme-primary">The Alchemist AI</h3>
            </div>
            <p class="text-xs text-theme-secondary leading-relaxed">
              Meringkas materi 100+ halaman modul PDF menjadi 5 konsep inti Pareto yang sering diujikan di Ujian Akhir Semester.
            </p>
          </div>

          <!-- Staggered Active Tab Preview -->
          <div class="mt-8 p-4.5 rounded-xl bg-theme-main border border-theme space-y-3.5">
            <div class="flex gap-2">
              <span class="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-bold">Modul 1</span>
              <span class="px-2 py-0.5 rounded text-theme-secondary text-[8px] font-bold">Modul 2</span>
              <span class="px-2 py-0.5 rounded text-theme-secondary text-[8px] font-bold">Modul 3</span>
            </div>
            <p class="text-[10px] text-theme-primary leading-normal font-medium">
              <strong>Prinsip Agility</strong>: Mengutamakan kolaborasi antar individu dan kecepatan merespons perubahan daripada dokumentasi kaku.
            </p>
          </div>
        </div>

        <!-- Bento Cell 3: Anti-Plagiarism Generator (Narrow) -->
        <div class="bg-theme-card border border-theme rounded-[24px] p-8 flex flex-col justify-between shadow-lg hover:border-purple-500/20 transition-all duration-300 group reveal-item delay-100">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <h3 class="text-lg font-black text-theme-primary">Safe Anti-Fraud</h3>
            </div>
            <p class="text-xs text-theme-secondary leading-relaxed">
              Membuat draf jawaban forum diskusi akademik secara instan yang memiliki tingkat kemiripan kalimat di bawah batas deteksi plagiarism UT.
            </p>
          </div>

          <!-- Plagiarism Score Meter Mockup -->
          <div class="mt-8 p-4.5 rounded-xl bg-theme-main border border-theme flex items-center justify-between">
            <div>
              <span class="text-[9px] uppercase tracking-wider text-theme-secondary font-bold block">Similarity Rating</span>
              <span class="text-lg font-black text-purple-500 font-mono">2.8%</span>
            </div>
            <span class="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] text-purple-400 font-black uppercase tracking-widest">Sangat Aman</span>
          </div>
        </div>

        <!-- Bento Cell 4: Top Up & Purchased Log (Wide) -->
        <div class="md:col-span-2 bg-theme-card border border-theme rounded-[24px] p-8 flex flex-col justify-between shadow-lg hover:border-purple-500/20 transition-all duration-300 group reveal-item">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 class="text-lg font-black text-theme-primary">Roll-Over Extra Token</h3>
            </div>
            <p class="text-xs text-theme-secondary max-w-xl leading-relaxed">
              Jika kuota bulanan habis, Anda dapat melakukan top-up saldo token instan menggunakan QRIS. Menariknya, kuota tambahan ini tidak akan pernah hangus ketika pergantian bulan.
            </p>
          </div>

          <!-- Purchased Token Roll Log Mockup -->
          <div class="mt-8 border border-theme rounded-xl bg-theme-main overflow-hidden text-[9px] font-mono">
            <div class="grid grid-cols-3 bg-theme-card px-4 py-3.5 border-b border-theme font-black uppercase text-theme-secondary tracking-wider">
              <span>Tanggal</span>
              <span>Jumlah</span>
              <span>Status</span>
            </div>
            <div class="px-4 py-3 space-y-2 text-theme-primary">
              <div class="grid grid-cols-3">
                <span>2026-05-23</span>
                <span class="text-purple-500 font-bold">+100.000 Token</span>
                <span class="text-purple-500 font-bold">QRIS Sukses</span>
              </div>
              <div class="grid grid-cols-3">
                <span>2026-05-19</span>
                <span class="text-purple-500 font-bold">+50.000 Token</span>
                <span class="text-purple-500 font-bold">QRIS Sukses</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Section 4: Interactive Playground (Modern Showcase Tab System) -->
    <section id="playground" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-8 py-24 relative z-10 border-t border-theme-divider">
      
      <div class="text-center mb-16 reveal-item">
        <span class="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/5 border border-purple-500/10 px-4 py-2 rounded-full">Playground Simulasi</span>
        <h2 class="text-3xl md:text-[44px] font-black text-theme-primary mt-6 leading-tight">Lihat Cara Kerja Sistem</h2>
        <p class="text-sm text-theme-secondary mt-3 max-w-xl mx-auto leading-relaxed">Pilih fitur di bawah ini untuk melihat simulasi input e-learning dan output respons AI akademis.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto items-stretch reveal-item">
        
        <!-- Left Panel: Playground Tabs Switcher -->
        <div class="lg:col-span-2 space-y-4 flex flex-col justify-center">
          
          <button 
            @click="activePlaygroundTab = 'absensi'"
            :class="activePlaygroundTab === 'absensi' ? 'border-purple-500 bg-theme-card text-theme-primary shadow-lg shadow-purple-500/5' : 'border-theme-btn bg-transparent text-theme-secondary hover:text-theme-primary'"
            class="w-full text-left p-6 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full" :class="activePlaygroundTab === 'absensi' ? 'bg-purple-500' : 'bg-gray-400'"></span>
              <span>1. Otomatisasi Absensi</span>
            </div>
            <p class="text-[10px] text-theme-secondary font-medium normal-case mt-2 leading-relaxed">
              Bypass navigasi lambat Moodle UT dengan penjadwalan mandiri.
            </p>
          </button>

          <button 
            @click="activePlaygroundTab = 'ringkasan'"
            :class="activePlaygroundTab === 'ringkasan' ? 'border-purple-500 bg-theme-card text-theme-primary shadow-lg shadow-purple-500/5' : 'border-theme-btn bg-transparent text-theme-secondary hover:text-theme-primary'"
            class="w-full text-left p-6 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full" :class="activePlaygroundTab === 'ringkasan' ? 'bg-purple-500' : 'bg-gray-400'"></span>
              <span>2. Rangkum Buku Materi Pokok</span>
            </div>
            <p class="text-[10px] text-theme-secondary font-medium normal-case mt-2 leading-relaxed">
              Model AI memilah 20% isi modul penting pembawa 80% pemahaman.
            </p>
          </button>

          <button 
            @click="activePlaygroundTab = 'jawaban'"
            :class="activePlaygroundTab === 'jawaban' ? 'border-purple-500 bg-theme-card text-theme-primary shadow-lg shadow-purple-500/5' : 'border-theme-btn bg-transparent text-theme-secondary hover:text-theme-primary'"
            class="w-full text-left p-6 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full" :class="activePlaygroundTab === 'jawaban' ? 'bg-purple-500' : 'bg-gray-400'"></span>
              <span>3. Susun Draf Diskusi</span>
            </div>
            <p class="text-[10px] text-theme-secondary font-medium normal-case mt-2 leading-relaxed">
              Ketik kerangka jawaban akademis yang aman dari indikator plagiat.
            </p>
          </button>

        </div>
 
        <!-- Right Panel: Dynamic Tab Workspace Screen -->
        <div class="lg:col-span-3 bg-theme-card border border-theme rounded-[24px] overflow-hidden shadow-2xl flex flex-col">
          
          <div class="flex items-center justify-between px-6 py-4 bg-theme-main border-b border-theme">
            <span class="text-[10px] font-black uppercase tracking-widest text-purple-400">Terminal Preview</span>
            <div class="flex gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-theme-btn"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-theme-btn"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            </div>
          </div>

          <div class="p-6 md:p-8 flex-1 font-mono text-xs leading-relaxed text-theme-primary">
            
            <!-- Tab Absensi Content -->
            <div v-if="activePlaygroundTab === 'absensi'" class="space-y-4">
              <p class="text-theme-secondary">// Menjalankan Bypass Kehadiran Sesi 4</p>
              <div class="space-y-1.5">
                <p>NIM Mahasiswa: <span class="font-bold">054308893</span></p>
                <p>Mata Kuliah: <span class="text-purple-500 font-bold">MSIM4301 Rekayasa Perangkat Lunak</span></p>
                <p>Status Moodle: <span class="text-purple-500 font-bold animate-pulse">Menunggu Sinkronisasi Sesi...</span></p>
              </div>
              <div class="p-4 rounded-xl bg-theme-main border border-theme space-y-1.5 text-theme-secondary">
                <p>✓ Menarik daftar token login e-learning... Sukses</p>
                <p>✓ Membuka post form kehadiran sesi 4... Sukses</p>
                <p>✓ Mengirimkan konfirmasi attendance... <span class="text-purple-500 font-bold font-black">DISETUJUI</span></p>
              </div>
            </div>

            <!-- Tab Ringkasan Content -->
            <div v-if="activePlaygroundTab === 'ringkasan'" class="space-y-4">
              <p class="text-theme-secondary">// Hasil Ekstraksi AI Pareto (Modul 4 Halaman 45-98)</p>
              <div class="space-y-1">
                <h4 class="font-bold text-xs uppercase tracking-wider">Topik: Analisis Kelayakan Perangkat Lunak</h4>
                <p class="text-purple-500 font-bold">Model Analisis: 3 Poin Konsep Utama</p>
              </div>
              <div class="p-4 rounded-xl bg-theme-main border border-theme space-y-3.5 text-theme-secondary">
                <p>1. <span class="font-bold text-theme-primary">Kelayakan Operasional</span>: Mengukur sejauh mana sistem baru dapat diterima dan dioperasikan oleh pengguna akhir UT.</p>
                <p>2. <span class="font-bold text-theme-primary">Kelayakan Teknis</span>: Mengevaluasi ketersediaan infrastruktur jaringan, hardware, dan kesiapan teknologi pendukung.</p>
                <p>3. <span class="font-bold text-theme-primary">Kelayakan Ekonomis</span>: Membandingkan biaya pengembangan (cost) dengan nilai manfaat jangka panjang (benefit).</p>
              </div>
            </div>

            <!-- Tab Jawaban Content -->
            <div v-if="activePlaygroundTab === 'jawaban'" class="space-y-4">
              <p class="text-theme-secondary">// Draft Jawaban Diskusi AI Akademis Terstruktur</p>
              <div class="space-y-2">
                <p class="text-[9px] text-theme-secondary uppercase tracking-widest font-bold">Prompt Pertanyaan Forum:</p>
                <p class="text-[11px] leading-normal font-bold text-theme-primary">"Jelaskan mengapa model spiral lebih cocok untuk pengembangan perangkat lunak skala besar?"</p>
              </div>
              
              <!-- Typing Simulation Response Container -->
              <div class="p-4 rounded-xl bg-theme-main border border-theme space-y-2.5 text-theme-secondary">
                <p class="text-purple-500 font-bold text-[9px] uppercase tracking-wider">KAIZORA SCHOLAR AI WRITER:</p>
                <p class="text-[11px] leading-relaxed italic text-theme-primary">
                  "Model Spiral sangat relevan untuk proyek perangkat lunak skala besar karena memprioritaskan analisis risiko di setiap siklus evolusinya. Melalui integrasi pendekatan prototipe berulang, tim dapat mendeteksi kegagalan teknis secara dini sebelum memasuki tahapan penulisan kode massal..."
                </p>
                <div class="flex justify-between items-center text-[8px] text-theme-secondary pt-2 border-t border-theme">
                  <span>Akurasi Model: 98.6%</span>
                  <span class="text-purple-500 font-black">Copy to Clipboard ✓</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- Section 5: Token Analytics Simulator (Premium Spatial Slider) -->
    <section id="simulator" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-8 py-24 relative z-10 border-t border-theme-divider">
      <div class="max-w-4xl mx-auto bg-theme-card border border-theme p-8 md:p-12 rounded-[28px] relative overflow-hidden shadow-2xl reveal-item">
        
        <div class="text-center mb-12">
          <span class="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/5 border border-purple-500/10 px-4 py-2 rounded-full">Kalkulator Penggunaan Token AI</span>
          <h2 class="text-3xl font-black text-theme-primary mt-6 leading-tight">Simulasikan Kebutuhan Token Anda</h2>
          <p class="text-sm text-theme-secondary mt-2 max-w-md mx-auto leading-relaxed">Sesuaikan dengan jumlah mata kuliah yang Anda ambil di semester ini.</p>
        </div>

        <div class="space-y-10">
          <!-- Slider Control -->
          <div class="space-y-5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-extrabold uppercase tracking-widest text-theme-secondary">Mata Kuliah Diambil:</span>
              <span class="text-xl text-purple-500 font-black font-mono">{{ coursesCount }} Matkul</span>
            </div>
            
            <div class="relative">
              <input 
                type="range" 
                min="1" 
                max="8" 
                v-model.number="coursesCount"
                class="w-full h-2 bg-theme-main rounded-lg appearance-none cursor-pointer accent-purple-500 border border-theme"
              />
            </div>
            
            <div class="flex justify-between text-[9px] text-theme-secondary font-extrabold uppercase tracking-widest">
              <span>1 Mata Kuliah</span>
              <span>4 Mata Kuliah</span>
              <span>8 Mata Kuliah (Maks)</span>
            </div>
          </div>

          <div class="h-[1px] bg-theme-divider"></div>

          <!-- Calculation Displays -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div class="space-y-3">
              <span class="text-[9px] font-extrabold text-theme-secondary uppercase tracking-widest">Estimasi Kuota AI Dibutuhkan:</span>
              <div class="text-4xl font-black text-theme-primary font-mono flex items-baseline gap-2">
                {{ formattedTokensNeeded }}
                <span class="text-sm font-bold text-theme-secondary">Token</span>
              </div>
              <p class="text-xs text-theme-secondary leading-relaxed font-medium">
                Total estimasi kuota yang dibutuhkan untuk menutupi seluruh pengerjaan modul sesi 1-8, auto-absensi, dan tugas terstruktur per mata kuliah.
              </p>
            </div>

            <!-- Recommendation Box -->
            <div class="p-6 rounded-2xl border border-theme bg-theme-main relative group overflow-hidden shadow-sm">
              <span class="text-[9px] font-extrabold uppercase tracking-widest text-purple-400 block mb-1">Rekomendasi Paket Kaizora:</span>
              <span class="text-base font-black text-theme-primary block mb-2 transition-colors duration-200">
                {{ recommendedPlan.name }}
              </span>
              <p class="text-xs text-theme-secondary leading-relaxed font-medium">
                {{ recommendedPlan.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 6: Pricing Tier (Cinematic Columns) -->
    <section id="pricing" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-8 py-24 relative z-10 border-t border-theme-divider">
      <div class="text-center mb-16 reveal-item">
        <span class="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/5 border border-purple-500/10 px-4 py-2 rounded-full">Skema Investasi Belajar</span>
        <h2 class="text-3xl md:text-[44px] font-black text-theme-primary mt-6 leading-tight">Investasi Belajar Tanpa Batas</h2>
        <p class="text-sm text-theme-secondary mt-3 max-w-xl mx-auto leading-relaxed">Semua paket dilengkapi fungsionalitas bypass dasar. Upgrade paket Anda kapan saja untuk kuota AI lebih besar.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
        
        <!-- Tier Free -->
        <div class="bg-theme-card border border-theme p-8 rounded-[28px] flex flex-col justify-between hover:border-purple-500/20 transition-all duration-300 shadow-xl reveal-item delay-100">
          <div>
            <span class="text-[9px] font-extrabold text-theme-secondary uppercase tracking-widest">Uji Coba Sistem</span>
            <h3 class="text-xl font-black text-theme-primary mt-2">Paket GRATIS</h3>
            <p class="text-xs text-theme-secondary mt-3 leading-relaxed font-medium">Setara dengan membaca 1-2 ringkasan materi pendek saja. Sempurna untuk mengetes koneksi akun UT Anda.</p>
            <div class="my-6">
              <span class="text-3.5xl font-black text-theme-primary font-mono">Rp 0</span>
              <span class="text-[10px] text-theme-secondary uppercase tracking-widest font-extrabold"> / selamanya</span>
            </div>
            <div class="h-[1px] bg-theme-divider my-5"></div>
            <ul class="space-y-4 text-xs text-theme-secondary">
              <li class="flex items-center gap-2.5">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Maks 10.000 Token AI / Bulan</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Bypass Sinkronisasi e-learning UT</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-500 font-bold">✓</span>
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
        <div class="bg-theme-card border-2 border-purple-500/30 p-8 rounded-[28px] flex flex-col justify-between relative hover:border-purple-500/50 transition-all duration-300 shadow-2xl shadow-purple-500/[0.03] reveal-item delay-200">
          <div class="absolute top-0 right-6 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white shadow-md">
            Rekomendasi Utama
          </div>
          <div>
            <span class="text-[9px] font-extrabold text-purple-400 uppercase tracking-widest font-black">The Scholar</span>
            <h3 class="text-xl font-black text-theme-primary mt-2">Paket PREMIUM</h3>
            <p class="text-xs text-theme-secondary mt-3 leading-relaxed font-medium">Pilihan tepat untuk mengcover 4-8 mata kuliah. Setara dengan membaca ~50 ringkasan modul penuh & tugas AI.</p>
            <div class="my-6">
              <span class="text-3.5xl font-black text-theme-primary font-mono">Rp 49.000</span>
              <span class="text-[10px] text-theme-secondary uppercase tracking-widest font-extrabold"> / bulan</span>
            </div>
            <div class="h-[1px] bg-theme-divider my-5"></div>
            <ul class="space-y-4 text-xs text-theme-secondary">
              <li class="flex items-center gap-2.5">
                <span class="text-purple-500 font-bold">✓</span>
                <span class="text-theme-primary font-semibold">Maks 750.000 Token AI / Bulan</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Pareto Summarizer Tanpa Batas</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Auto Attendance & Mark as Done</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Generator Jawaban Forum Diskusi</span>
              </li>
            </ul>
          </div>
          <router-link 
            to="/login"
            class="w-full py-3.5 mt-8 bg-purple-600 hover:bg-purple-500 text-xs font-bold rounded-xl text-white text-center transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 uppercase tracking-widest cursor-pointer shadow-lg shadow-purple-500/20 flex items-center justify-center"
          >
            Upgrade ke Premium
          </router-link>
        </div>

        <!-- Tier Elite -->
        <div class="bg-theme-card border border-theme p-8 rounded-[28px] flex flex-col justify-between hover:border-purple-500/20 transition-all duration-300 shadow-xl reveal-item delay-300">
          <div>
            <span class="text-[9px] font-extrabold text-theme-secondary uppercase tracking-widest">The Bypass Engine</span>
            <h3 class="text-xl font-black text-theme-primary mt-2">Paket ELITE</h3>
            <p class="text-xs text-theme-secondary mt-3 leading-relaxed font-medium">Dibuat khusus untuk otomatisasi penuh beban belajar ekstrem. Ditenagai engine akademik Kaizora core.</p>
            <div class="my-6">
              <span class="text-3.5xl font-black text-theme-primary font-mono">Rp 99.000</span>
              <span class="text-[10px] text-theme-secondary uppercase tracking-widest font-extrabold"> / bulan</span>
            </div>
            <div class="h-[1px] bg-theme-divider my-5"></div>
            <ul class="space-y-4 text-xs text-theme-secondary">
              <li class="flex items-center gap-2.5">
                <span class="text-purple-500 font-bold">✓</span>
                <span class="text-theme-primary font-semibold">Maks 2.500.000 Token AI / Bulan</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Engine Akademik Penalaran Tinggi (Kaizora Core)</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Jalur Koneksi Crawling e-learning Prioritas</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-purple-500 font-bold">✓</span>
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

    <!-- Section 7: Dynamic Expanded FAQs (Calming Visual Flow) -->
    <section class="min-h-screen flex flex-col justify-center max-w-4xl mx-auto px-8 py-24 relative z-10 border-t border-theme-divider">
      <div class="text-center mb-16 reveal-item">
        <span class="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/5 border border-purple-500/10 px-4 py-2 rounded-full">Pertanyaan Umum</span>
        <h2 class="text-3xl md:text-[44px] font-black text-theme-primary mt-6 leading-tight">FAQ & Bantuan Akademis</h2>
        <p class="text-sm text-theme-secondary mt-3 max-w-md mx-auto leading-relaxed">Klik salah satu pertanyaan di bawah untuk membaca jawaban interaktif mengenai protokol bypass Kaizora.</p>
      </div>

      <!-- Accordion Grid with premium custom animations -->
      <div class="space-y-4 max-w-3xl mx-auto w-full reveal-item">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="border border-theme bg-theme-card rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-500/30"
        >
          <button 
            @click="toggleFaq(index)"
            class="w-full flex items-center justify-between px-6 py-5 text-left font-black text-xs uppercase tracking-wider text-theme-primary hover:text-purple-500 transition-colors duration-150 cursor-pointer"
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
          
          <!-- Height transition drawer -->
          <div 
            v-show="activeFaqIndex === index" 
            class="px-6 pb-6 text-xs text-theme-secondary leading-relaxed border-t border-theme-divider pt-4.5 font-medium transition-all duration-300"
          >
            {{ faq.a }}
          </div>
        </div>
      </div>
    </section>

    <!-- Footer scene -->
    <footer class="border-t border-theme-divider bg-theme-footer py-16 px-6 text-center text-xs text-theme-muted relative z-10 transition-colors duration-700">
      <div class="max-w-7xl mx-auto space-y-4">
        <p class="font-bold text-theme-secondary">Kaizora Scholar Platform - Developed by Fadjar Setiawan for Universitas Terbuka.</p>
        <p class="text-[10px] text-theme-muted max-w-xl mx-auto leading-relaxed">
          Layanan ini bersifat independen untuk mempermudah administrasi belajar mahasiswa UT. Merek dan logo Universitas Terbuka dan Moodle adalah milik masing-masing pemilik hak cipta.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const isDarkMode = ref(localStorage.getItem('kaizora_dark_mode') !== 'false');
const canvasRef = ref(null);
let animationFrameId = null;

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

// Immersive canvas background system
const initCosmicCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  const handleResize = () => {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize);
  
  const particles = [];
  const particleCount = 45;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      alpha: Math.random() * 0.5 + 0.15
    });
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, width, height);
    
    // Ambient slow drift
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      
      if (isDarkMode.value) {
        ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`; 
      } else {
        ctx.fillStyle = `rgba(109, 40, 217, ${p.alpha * 0.55})`; 
      }
      ctx.fill();
    });
    
    // Connected constellations/lines with ultra low opacity
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 135) {
          const alpha = (1 - dist / 135) * 0.05;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          if (isDarkMode.value) {
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
          } else {
            ctx.strokeStyle = `rgba(109, 40, 217, ${alpha * 0.6})`;
          }
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    
    animationFrameId = requestAnimationFrame(animate);
  };
  
  animate();
  
  return () => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationFrameId);
  };
};

let cleanupCanvas = null;

onMounted(() => {
  updateDOMTheme();
  cleanupCanvas = initCosmicCanvas();
  
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

onUnmounted(() => {
  if (cleanupCanvas) cleanupCanvas();
});
</script>

<style>
/* ─── Scroll Reveal ─── */
.reveal-item {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}
.reveal-item.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ─── Theme System Variables ─── */
.light-theme {
  --bg-main: #f8fafc;
  --bg-card: #ffffff;
  --bg-hover: #f1f5f9;
  --bg-nav: rgba(248, 250, 252, 0.8);
  --bg-footer: #f1f5f9;
  --border-color: #e8eaf0;
  --border-btn: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --purple-accent: #7c3aed;
  --purple-text: #6d28d9;
  --divider-color: #e2e8f0;
}

.dark-theme {
  --bg-main: #0b0c14;
  --bg-card: #10111c;
  --bg-hover: #161828;
  --bg-nav: rgba(11, 12, 20, 0.85);
  --bg-footer: #080911;
  --border-color: #1e2040;
  --border-btn: #1e2040;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --purple-accent: #a78bfa;
  --purple-text: #a78bfa;
  --divider-color: #1b1c2b;
}

/* ─── Utility classes ─── */
.bg-theme-main { background-color: var(--bg-main) !important; }
.bg-theme-card { background-color: var(--bg-card) !important; }
.bg-theme-footer { background-color: var(--bg-footer) !important; }
.border-theme-nav { border-color: var(--bg-nav) !important; }
.border-theme-divider { border-color: var(--divider-color) !important; }
.text-theme-primary { color: var(--text-primary) !important; }
.text-theme-secondary { color: var(--text-secondary) !important; }
.text-theme-muted { color: var(--text-muted) !important; }

/* ─── Overrides ─── */
.light-theme [class*="bg-[#020205]"],
.light-theme [class*="bg-[#080913]"],
.light-theme [class*="bg-[#0d0d18]"],
.light-theme [class*="bg-[#0c0d1b]"],
.light-theme [class*="bg-[#05060b]"],
.light-theme [class*="bg-[#0a0b12]"],
.light-theme [class*="bg-[#030307]"],
.light-theme [class*="bg-[#0d0e22]"],
.light-theme [class*="bg-[#121324]"] {
  background-color: var(--bg-card) !important;
}

.light-theme [class*="border-[#1b1c2b]"],
.light-theme [class*="border-[#1d1f35]"] {
  border-color: var(--border-color) !important;
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
}

.dark-theme [class*="border-[#1b1c2b]"],
.dark-theme [class*="border-[#1d1f35]"] {
  border-color: var(--border-color) !important;
}

/* ─── Typography & Colors In Light mode ─── */
.light-theme .text-white { color: var(--text-primary) !important; }
.light-theme .text-gray-200,
.light-theme .text-gray-300 { color: var(--text-primary) !important; }
.light-theme .text-gray-400 { color: var(--text-secondary) !important; }
.light-theme .text-gray-500 { color: var(--text-muted) !important; }

/* ─── Buttons and Interactive Border systems ─── */
.border-theme { border-color: var(--border-color) !important; }
.border-theme-btn { border-color: var(--border-btn) !important; }

.shadow-2xl, .shadow-xl, .shadow-lg {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02) !important;
}
.dark-theme .shadow-2xl, .dark-theme .shadow-xl {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25) !important;
}
</style>
