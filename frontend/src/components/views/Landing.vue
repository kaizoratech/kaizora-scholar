<template>
  <div :class="isDarkMode ? 'dark-theme' : 'light-theme'" class="min-h-screen bg-theme-main text-theme-primary font-sans antialiased overflow-x-hidden relative selection:bg-purple-600/30 selection:text-white transition-colors duration-1000">
    
    <!-- Spatial Deep Parallax Canvas Starfield Background -->
    <canvas ref="canvasRef" class="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"></canvas>
    
    <!-- Muted Cosmic Ambient Gradients (Sophisticated Layering) -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-[30%] left-[10%] w-[60%] aspect-square rounded-full bg-gradient-radial from-purple-500/[0.04] to-transparent blur-[160px] dark:from-purple-600/[0.02]"></div>
      <div class="absolute top-[40%] right-[5%] w-[50%] aspect-square rounded-full bg-gradient-radial from-indigo-500/[0.03] to-transparent blur-[160px] dark:from-indigo-600/[0.01]"></div>
      <div class="absolute -bottom-[20%] left-[5%] w-[55%] aspect-square rounded-full bg-gradient-radial from-purple-500/[0.04] to-transparent blur-[160px] dark:from-purple-600/[0.02]"></div>
    </div>

    <!-- Editorial Header Navigation -->
    <nav class="sticky top-0 z-50 bg-transparent border-b border-theme-nav px-12 py-6 transition-all duration-300">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        
        <!-- Logo -->
        <div class="flex items-center gap-3.5 cursor-pointer group" @click="scrollTo('hero')">
          <div class="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-md shadow-purple-500/10 group-hover:scale-105 transition-all duration-300">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
            </svg>
          </div>
          <span class="text-[11px] font-black tracking-[0.25em] uppercase text-theme-primary group-hover:text-purple-500 transition-colors duration-300">
            Kaizora <span class="text-purple-500 font-medium">Scholar</span>
          </span>
        </div>

        <!-- Right Menu Options -->
        <div class="flex items-center gap-5">
          <!-- Theme Toggle -->
          <button 
            @click="toggleTheme" 
            class="p-3 rounded-xl border border-theme-btn transition-all duration-300 cursor-pointer active:scale-95 hover:scale-105 flex items-center justify-center bg-theme-card"
            title="Toggle Theme"
          >
            <svg v-if="isDarkMode" class="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 115.636 5.636a9 9 0 0112.728 12.728z" />
            </svg>
            <svg v-else class="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Editorial CTA -->
          <router-link 
            to="/login"
            class="px-7 py-3 bg-purple-600 hover:bg-purple-500 text-[10px] font-black rounded-xl text-white transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 uppercase tracking-[0.2em] shadow-md shadow-purple-500/10 flex items-center gap-2"
          >
            <span>MASUK</span>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Scene 1: Hero Editorial (100vh - Asymmetric Cinematic Composition) -->
    <header id="hero" class="min-h-screen flex flex-col justify-center relative max-w-7xl mx-auto px-12 z-10 -mt-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full pt-16">
        
        <!-- Left Side: Editorial Typography & Space -->
        <div class="lg:col-span-7 text-left space-y-8 reveal-item">
          <!-- Premium Subtle Badge -->
          <div class="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-lg bg-theme-badge border border-theme text-purple-600 dark:text-purple-400 text-[9px] font-extrabold uppercase tracking-[0.25em] shadow-sm">
            <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            <span>ACADEMIC ENGINE V2.0</span>
          </div>

          <!-- Editorial Title -->
          <h1 class="text-5xl sm:text-7xl lg:text-[76px] font-black tracking-tight text-theme-primary leading-[1.05] font-sans">
            Meringankan <br/>
            Beban Belajar. <br/>
            <span class="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent dark:from-white dark:to-purple-400">
              Selesai Tepat Waktu.
            </span>
          </h1>

          <!-- Muted Narrative Description -->
          <p class="text-sm md:text-[15px] text-theme-secondary max-w-xl leading-relaxed font-medium">
            Selamat datang di Kaizora Scholar, sebuah antarmuka akademis yang dirancang khusus untuk memotong waktu belajar administratif mahasiswa Universitas Terbuka. Jadwalkan kehadiran otomatis, rangkum modul tebal dengan AI Pareto, dan susun draf diskusi secara ringkas dalam satu operating system yang tenang.
          </p>

          <!-- Spatial CTAs -->
          <div class="flex flex-col sm:flex-row items-center gap-5 pt-3">
            <router-link 
              to="/login"
              class="w-full sm:w-auto px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 text-center"
            >
              Mulai Akses Gratis
            </router-link>
            
            <a 
              @click="scrollTo('video')"
              class="w-full sm:w-auto px-10 py-4 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 text-center cursor-pointer border border-theme bg-theme-card text-theme-primary"
            >
              Lihat Simulasi
            </a>
          </div>
        </div>

        <!-- Right Side: Structural Matte Graphic Frame -->
        <div class="lg:col-span-5 relative hidden lg:block reveal-item delay-100">
          <div class="border border-theme bg-theme-card p-4.5 rounded-[28px] shadow-2xl relative overflow-hidden">
            <!-- Simulated Interface Showcase -->
            <div class="bg-theme-main rounded-[20px] p-6 space-y-5 border border-theme">
              <div class="flex items-center justify-between border-b border-theme pb-4">
                <span class="text-[9px] uppercase tracking-[0.2em] text-theme-secondary font-black">KA-SCHOLAR LOG</span>
                <span class="text-[9px] text-purple-600 font-bold">100% ONLINE</span>
              </div>

              <!-- Compact logs demonstrating utility -->
              <div class="space-y-3 font-mono text-[10px] text-theme-secondary">
                <div class="p-3 bg-theme-card border border-theme rounded-xl flex items-center justify-between">
                  <span>✓ Auto Attendance Session 4</span>
                  <span class="text-green-500 font-bold">SUCCESS</span>
                </div>
                <div class="p-3 bg-theme-card border border-theme rounded-xl flex items-center justify-between">
                  <span>✓ Alchemist AI Summarizer</span>
                  <span class="text-purple-500 font-bold">COMPLETED</span>
                </div>
                <div class="p-3 bg-theme-card border border-theme rounded-xl flex items-center justify-between">
                  <span>✓ Anti-Plagiarism Guard</span>
                  <span class="text-purple-500 font-bold">Similarity: 2.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>

    <!-- Scene 2: The Cinematic Video Observatory (120vh-140vh Screen Pacing) -->
    <section id="video" class="min-h-[120vh] flex flex-col justify-center max-w-7xl mx-auto px-12 py-32 relative z-10 border-t border-theme-divider">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
        
        <!-- Left: Large Asymmetrical Title -->
        <div class="lg:col-span-5 space-y-4 text-left reveal-item">
          <span class="text-[9px] font-black uppercase tracking-[0.25em] text-purple-600 bg-purple-500/5 border border-purple-500/10 px-4 py-2 rounded-lg">SIMULASI SISTEM</span>
          <h2 class="text-3xl sm:text-[44px] font-black text-theme-primary leading-tight font-sans">
            Menghubungkan <br/>
            Secara Instan.
          </h2>
        </div>

        <!-- Right: Description -->
        <div class="lg:col-span-7 text-left lg:pt-10 reveal-item delay-100">
          <p class="text-sm text-theme-secondary leading-relaxed font-medium max-w-xl">
            Tonton demonstrasi video singkat di bawah ini. Kami mendemonstrasikan bagaimana scraper e-learning kami terhubung secara aman menggunakan enkripsi ujung ke ujung, dan mengekstrak materi modul perkuliahan Anda secara real-time.
          </p>
        </div>
      </div>

      <!-- Matte Media Frame -->
      <div class="max-w-5xl mx-auto w-full bg-theme-card border border-theme p-2 rounded-[32px] shadow-2xl relative overflow-hidden reveal-item">
        <div class="relative aspect-video rounded-[24px] bg-black overflow-hidden flex flex-col justify-between p-8">
          
          <!-- Screen Overlay controls -->
          <div class="absolute inset-0 flex items-center justify-center z-10 bg-black/40 backdrop-blur-[2px]">
            <button 
              @click="toggleVideoPlay" 
              class="w-20 h-20 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-transform duration-300 hover:scale-110 active:scale-90 cursor-pointer"
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
          <div class="absolute inset-0 flex flex-col justify-between p-8 font-mono text-[10px] text-gray-500 select-none z-0">
            <div class="flex justify-between items-center">
              <span>SYNC_OBSERVATORY // STREAM_SESSION</span>
              <span class="text-purple-400 font-bold">● ONLINE</span>
            </div>
            
            <div class="space-y-2 max-w-md bg-[#05060b] border border-[#1b1c2b] p-5 rounded-xl text-left" :class="isVideoPlaying ? 'opacity-90' : 'opacity-20'">
              <p class="text-purple-400 font-bold">// SECURE SCRA PING ESTABLISHED</p>
              <p>USER STATUS: <span class="text-green-500">AUTHENTICATED</span></p>
              <p>SCHEDULER STATUS: <span class="text-purple-400">WAITING FOR NEXT MODULE</span></p>
            </div>

            <div class="flex justify-between text-[8px]">
              <span>RESOLVING SECURE GATEWAY... SUCCESS</span>
              <span>1080p @ 60 FPS</span>
            </div>
          </div>

          <!-- Controller Overlay -->
          <div class="w-full bg-[#05060b]/90 border border-[#1b1c2b] rounded-xl px-5 py-4 flex items-center justify-between gap-5 z-20 mt-auto">
            <button @click="toggleVideoPlay" class="text-purple-400 hover:text-white transition-colors duration-150 cursor-pointer">
              <svg v-if="!isVideoPlaying" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>

            <div class="flex-1 h-1 bg-[#121324] rounded-full relative overflow-hidden">
              <div 
                class="absolute top-0 left-0 h-full bg-purple-600 transition-all duration-300"
                :style="{ width: isVideoPlaying ? '65%' : '0%' }"
              ></div>
            </div>

            <div class="text-[10px] text-gray-400 font-bold font-mono">
              {{ isVideoPlaying ? '0:39' : '0:00' }} / 1:00
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Scene 3: Structural Matte Bento Architecture (Asymmetrical Layout) -->
    <section id="features" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-12 py-32 relative z-10 border-t border-theme-divider">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-20">
        <div class="lg:col-span-6 space-y-4 text-left reveal-item">
          <span class="text-[9px] font-black uppercase tracking-[0.25em] text-purple-600 bg-purple-500/5 border border-purple-500/10 px-4 py-2 rounded-lg">KAPABILITAS UTAMA</span>
          <h2 class="text-3xl sm:text-[44px] font-black text-theme-primary leading-tight font-sans">Satu Antarmuka. Seluruh Kemudahan.</h2>
        </div>
        <div class="lg:col-span-6 text-left reveal-item delay-100">
          <p class="text-sm text-theme-secondary leading-relaxed font-medium max-w-xl">
            Kami membangun core engine modular yang bertindak sebagai jembatan cerdas antara Anda dan portal belajar, menyaring konten serta menyelesaikannya secara instan.
          </p>
        </div>
      </div>

      <!-- Asymmetrical Editorial Matte Cells -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
        
        <!-- Cell 1: Auto Attendance (Col 8) -->
        <div class="md:col-span-8 bg-theme-card border border-theme rounded-[28px] p-8 flex flex-col justify-between shadow-sm hover:border-purple-500/20 transition-all duration-300 group reveal-item">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-black text-theme-primary">Kehadiran Otomatis Terjadwal</h3>
            </div>
            <p class="text-xs text-theme-secondary max-w-xl leading-relaxed">
              Scheduler backend kami memonitor rilis sesi mingguan e-learning baru, kemudian secara terjadwal otomatis mengirimkan konfirmasi kehadiran sehingga Anda selalu tercatat hadir tepat waktu.
            </p>
          </div>

          <!-- Solid Matte Log terminal -->
          <div class="mt-8 border border-theme rounded-2xl bg-theme-main p-5 font-mono text-[10px]">
            <div class="flex items-center justify-between border-b border-theme pb-3 mb-4">
              <span class="text-theme-secondary text-[9px] uppercase tracking-widest font-black">Scheduler Log</span>
              <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            </div>
            <div class="space-y-2 text-theme-secondary">
              <p><span class="text-[#8b5cf6] font-bold">[18:00:03]</span> Connecting to learning gateway... <span class="text-green-500 font-bold">OK</span></p>
              <p><span class="text-[#8b5cf6] font-bold">[18:00:04]</span> Fetching courses for NIM 054308893... <span class="text-purple-500 font-bold">8 Courses Found</span></p>
              <p><span class="text-[#8b5cf6] font-bold">[18:00:06]</span> Confirming attendance status... <span class="text-green-500 font-black">[SUCCESS]</span></p>
            </div>
          </div>
        </div>

        <!-- Cell 2: Alchemist AI (Col 4) -->
        <div class="md:col-span-4 bg-theme-card border border-theme rounded-[28px] p-8 flex flex-col justify-between shadow-sm hover:border-purple-500/20 transition-all duration-300 group reveal-item delay-100">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <h3 class="text-lg font-black text-theme-primary">The Alchemist AI</h3>
            </div>
            <p class="text-xs text-theme-secondary leading-relaxed">
              Mengekstraksi konsep inti paling berharga (Prinsip Pareto 20%) dari tumpukan ratusan halaman file BMP UT Anda secara instan.
            </p>
          </div>

          <div class="mt-8 p-4.5 rounded-2xl bg-theme-main border border-theme space-y-3 font-medium">
            <div class="flex gap-2">
              <span class="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[8px] font-bold">Modul 1</span>
              <span class="px-2.5 py-1 rounded text-theme-secondary text-[8px] font-bold">Modul 2</span>
            </div>
            <p class="text-[10px] text-theme-primary leading-normal">
              <strong>Agile Analysis</strong>: Kolaborasi tim secara adaptif jauh lebih bernilai dibanding pematuhan rencana kerja kaku.
            </p>
          </div>
        </div>

        <!-- Cell 3: Anti Plagiarism Guard (Col 4) -->
        <div class="md:col-span-4 bg-theme-card border border-theme rounded-[28px] p-8 flex flex-col justify-between shadow-sm hover:border-purple-500/20 transition-all duration-300 group reveal-item delay-100">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <h3 class="text-lg font-black text-theme-primary">Anti-Fraud Shield</h3>
            </div>
            <p class="text-xs text-theme-secondary leading-relaxed">
              Membuat rangkuman jawaban forum yang bebas plagiarisme dan memiliki tingkat kemiripan kata yang super aman dari pelacak eksternal.
            </p>
          </div>

          <div class="mt-8 p-4.5 rounded-2xl bg-theme-main border border-theme flex items-center justify-between">
            <div>
              <span class="text-[9px] uppercase tracking-wider text-theme-secondary font-black block">Similarity Score</span>
              <span class="text-lg font-black text-purple-500 font-mono">2.8%</span>
            </div>
            <span class="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] text-purple-500 font-black uppercase tracking-wider">Sangat Aman</span>
          </div>
        </div>

        <!-- Cell 4: QRIS Roll Over (Col 8) -->
        <div class="md:col-span-8 bg-theme-card border border-theme rounded-[28px] p-8 flex flex-col justify-between shadow-sm hover:border-purple-500/20 transition-all duration-300 group reveal-item">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 class="text-lg font-black text-theme-primary">Roll-Over Extra Token</h3>
            </div>
            <p class="text-xs text-theme-secondary max-w-xl leading-relaxed">
              Jika kuota bulanan dasar habis, Anda dapat melakukan top-up token secara instan menggunakan QRIS. Menariknya, kuota tambahan ini tidak akan pernah hangus ketika pergantian bulan.
            </p>
          </div>

          <div class="mt-8 border border-theme rounded-2xl bg-theme-main overflow-hidden text-[9px] font-mono">
            <div class="grid grid-cols-3 bg-theme-card px-4 py-3.5 border-b border-theme font-black uppercase text-theme-secondary tracking-wider">
              <span>Tanggal</span>
              <span>Jumlah</span>
              <span>Status</span>
            </div>
            <div class="px-4 py-3.5 space-y-2 text-theme-primary">
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

    <!-- Scene 4: The Workspace Playground (Cinematic Split Screen Pacing) -->
    <section id="playground" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-12 py-32 relative z-10 border-t border-theme-divider">
      
      <div class="text-center mb-20 reveal-item">
        <span class="text-[9px] font-black uppercase tracking-[0.25em] text-purple-600 bg-purple-500/5 border border-purple-500/10 px-4 py-2 rounded-lg">LIVE SIMULATION</span>
        <h2 class="text-3xl md:text-[44px] font-black text-theme-primary mt-6 leading-tight font-sans">Simulasikan Kemampuan</h2>
        <p class="text-sm text-theme-secondary mt-3 max-w-xl mx-auto leading-relaxed">Pilih salah satu fungsi modular di bawah ini untuk melihat pratinjau output backend e-learning.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto items-stretch reveal-item">
        
        <!-- Left Side: Tabs as Clean Solid Matte Panels -->
        <div class="lg:col-span-2 space-y-5 flex flex-col justify-center">
          
          <button 
            @click="activePlaygroundTab = 'absensi'"
            :class="activePlaygroundTab === 'absensi' ? 'border-purple-500 bg-theme-card text-theme-primary shadow-sm' : 'border-theme bg-transparent text-theme-secondary hover:text-theme-primary'"
            class="w-full text-left p-6 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full" :class="activePlaygroundTab === 'absensi' ? 'bg-purple-500' : 'bg-gray-400'"></span>
              <span>1. Otomatisasi Absensi</span>
            </div>
            <p class="text-[10px] text-theme-secondary font-medium normal-case mt-2.5 leading-relaxed">
              Bypass navigasi lambat Moodle UT dengan penjadwalan mandiri.
            </p>
          </button>

          <button 
            @click="activePlaygroundTab = 'ringkasan'"
            :class="activePlaygroundTab === 'ringkasan' ? 'border-purple-500 bg-theme-card text-theme-primary shadow-sm' : 'border-theme bg-transparent text-theme-secondary hover:text-theme-primary'"
            class="w-full text-left p-6 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full" :class="activePlaygroundTab === 'ringkasan' ? 'bg-purple-500' : 'bg-gray-400'"></span>
              <span>2. Rangkum Buku Materi Pokok</span>
            </div>
            <p class="text-[10px] text-theme-secondary font-medium normal-case mt-2.5 leading-relaxed">
              Model AI memilah 20% isi modul penting pembawa 80% pemahaman.
            </p>
          </button>

          <button 
            @click="activePlaygroundTab = 'jawaban'"
            :class="activePlaygroundTab === 'jawaban' ? 'border-purple-500 bg-theme-card text-theme-primary shadow-sm' : 'border-theme bg-transparent text-theme-secondary hover:text-theme-primary'"
            class="w-full text-left p-6 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full" :class="activePlaygroundTab === 'jawaban' ? 'bg-purple-500' : 'bg-gray-400'"></span>
              <span>3. Susun Draf Diskusi</span>
            </div>
            <p class="text-[10px] text-theme-secondary font-medium normal-case mt-2.5 leading-relaxed">
              Ketik kerangka jawaban akademis yang aman dari indikator plagiat.
            </p>
          </button>

        </div>
 
        <!-- Right Side: Solid Matte Workspace Screen -->
        <div class="lg:col-span-3 bg-theme-card border border-theme rounded-[28px] overflow-hidden shadow-sm flex flex-col">
          
          <div class="flex items-center justify-between px-6 py-4 bg-theme-main border-b border-theme">
            <span class="text-[10px] font-black uppercase tracking-widest text-purple-500">Terminal Response</span>
            <div class="flex gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-theme-btn"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-theme-btn"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            </div>
          </div>

          <div class="p-8 flex-1 font-mono text-xs leading-relaxed text-theme-primary">
            
            <!-- Absensi -->
            <div v-if="activePlaygroundTab === 'absensi'" class="space-y-5">
              <p class="text-theme-secondary">// Executing Attendance Bypass Routine</p>
              <div class="space-y-2">
                <p>StudentID: <span class="font-bold text-theme-primary">054308893</span></p>
                <p>CourseID: <span class="text-purple-500 font-bold">MSIM4301 Rekayasa Perangkat Lunak</span></p>
                <p>Scheduler Trigger: <span class="text-purple-500 font-bold">SESSION_04_CONFIRMED</span></p>
              </div>
              <div class="p-5 rounded-2xl bg-theme-main border border-theme space-y-2 text-theme-secondary">
                <p>✓ Pulling moodle token payload... OK</p>
                <p>✓ Forwarding secure attendance header... OK</p>
                <p>✓ Status e-learning updated... <span class="text-green-500 font-bold font-black">[MARKED_DONE]</span></p>
              </div>
            </div>

            <!-- Ringkasan -->
            <div v-if="activePlaygroundTab === 'ringkasan'" class="space-y-5">
              <p class="text-theme-secondary">// Pareto Extraction Routine (Modul 4 pages 45-98)</p>
              <div class="space-y-1">
                <h4 class="font-bold text-xs uppercase tracking-wider">Topik: Analisis Kelayakan Perangkat Lunak</h4>
                <p class="text-purple-500 font-bold">Model Analisis: 3 Poin Konsep Utama</p>
              </div>
              <div class="p-5 rounded-2xl bg-theme-main border border-theme space-y-4 text-theme-secondary">
                <p>1. <span class="font-bold text-theme-primary">Kelayakan Operasional</span>: Mengukur sejauh mana sistem baru dapat diterima dan dioperasikan oleh pengguna akhir UT.</p>
                <p>2. <span class="font-bold text-theme-primary">Kelayakan Teknis</span>: Mengevaluasi ketersediaan infrastruktur jaringan, hardware, dan kesiapan teknologi pendukung.</p>
                <p>3. <span class="font-bold text-theme-primary">Kelayakan Ekonomis</span>: Membandingkan biaya pengembangan (cost) dengan nilai manfaat jangka panjang (benefit).</p>
              </div>
            </div>

            <!-- Draft Jawaban -->
            <div v-if="activePlaygroundTab === 'jawaban'" class="space-y-5">
              <p class="text-theme-secondary">// AI Anti-Plagiarism Academic Formulator Draft</p>
              <div class="space-y-2">
                <p class="text-[9px] text-theme-secondary uppercase tracking-widest font-black">Prompt Pertanyaan Forum:</p>
                <p class="text-[11px] leading-normal font-bold text-theme-primary">"Jelaskan mengapa model spiral lebih cocok untuk pengembangan perangkat lunak skala besar?"</p>
              </div>
              
              <div class="p-5 rounded-2xl bg-theme-main border border-theme space-y-3 text-theme-secondary">
                <p class="text-purple-500 font-bold text-[9px] uppercase tracking-widest font-black">KAIZORA AI WRITER:</p>
                <p class="text-[11px] leading-relaxed italic text-theme-primary">
                  "Model Spiral sangat relevan untuk proyek perangkat lunak skala besar karena memprioritaskan analisis risiko di setiap siklus evolusinya. Melalui integrasi pendekatan prototipe berulang, tim dapat mendeteksi kegagalan teknis secara dini sebelum memasuki tahapan penulisan kode massal..."
                </p>
                <div class="flex justify-between items-center text-[9px] text-theme-secondary pt-3.5 border-t border-theme">
                  <span>Akurasi Model: 98.6%</span>
                  <span class="text-purple-500 font-bold">Copy to Clipboard ✓</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>

    <!-- Scene 5: Token Analytics Simulator (Premium Spatial Matte Slider) -->
    <section id="simulator" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-12 py-32 relative z-10 border-t border-theme-divider">
      <div class="max-w-4xl mx-auto bg-theme-card border border-theme p-10 md:p-14 rounded-[32px] relative overflow-hidden shadow-sm reveal-item">
        
        <div class="text-center mb-12">
          <span class="text-[9px] font-black uppercase tracking-[0.25em] text-purple-600 bg-purple-500/5 border border-purple-500/10 px-4 py-2 rounded-lg">TOKEN CALCULATOR</span>
          <h2 class="text-3xl font-black text-theme-primary mt-6 leading-tight font-sans">Simulasikan Kebutuhan Anda</h2>
          <p class="text-sm text-theme-secondary mt-3 max-w-md mx-auto leading-relaxed">Sesuaikan slider di bawah dengan total beban kuliah Anda semester ini.</p>
        </div>

        <div class="space-y-12">
          <!-- Slider Control -->
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-theme-secondary">Beban Studi:</span>
              <span class="text-xl text-purple-600 font-black font-mono">{{ coursesCount }} Mata Kuliah</span>
            </div>
            
            <div class="relative flex items-center">
              <input 
                type="range" 
                min="1" 
                max="8" 
                v-model.number="coursesCount"
                class="w-full h-1.5 bg-theme-main rounded-lg appearance-none cursor-pointer accent-purple-600 border border-theme"
              />
            </div>
            
            <div class="flex justify-between text-[9px] text-theme-secondary font-black uppercase tracking-wider">
              <span>1 Mata Kuliah</span>
              <span>4 Mata Kuliah</span>
              <span>8 Mata Kuliah (Maks)</span>
            </div>
          </div>

          <div class="h-[1px] bg-theme-divider"></div>

          <!-- Calculation Displays -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div class="space-y-4">
              <span class="text-[9px] font-black text-theme-secondary uppercase tracking-[0.2em]">Estimasi Kuota AI Dibutuhkan:</span>
              <div class="text-4xl font-black text-theme-primary font-mono flex items-baseline gap-2">
                {{ formattedTokensNeeded }}
                <span class="text-xs font-bold text-theme-secondary uppercase tracking-widest">Token</span>
              </div>
              <p class="text-xs text-theme-secondary leading-relaxed font-medium">
                Estimasi kuota komparatif untuk mencakup pengerjaan modul sesi 1-8, sinkronisasi, auto-absensi, dan tugas terstruktur untuk seluruh kelas.
              </p>
            </div>

            <!-- Recommendation Box -->
            <div class="p-7 rounded-2xl border border-theme bg-theme-main relative group overflow-hidden">
              <span class="text-[9px] font-black uppercase tracking-[0.2em] text-purple-600 block mb-1">Rekomendasi Paket:</span>
              <span class="text-base font-black text-theme-primary block mb-2">
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

    <!-- Scene 6: Structural Pricing Tier (Editorial Matte Columns) -->
    <section id="pricing" class="min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-12 py-32 relative z-10 border-t border-theme-divider">
      <div class="text-center mb-20 reveal-item">
        <span class="text-[9px] font-black uppercase tracking-[0.25em] text-purple-600 bg-purple-500/5 border border-purple-500/10 px-4 py-2 rounded-lg">SKEMA INVESTASI</span>
        <h2 class="text-3xl md:text-[44px] font-black text-theme-primary mt-6 leading-tight font-sans">Investasi Belajar Tanpa Batas</h2>
        <p class="text-sm text-theme-secondary mt-3 max-w-xl mx-auto leading-relaxed">Semua paket dilengkapi fungsionalitas bypass dasar. Upgrade paket Anda kapan saja untuk kuota AI lebih besar.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
        
        <!-- Tier Free -->
        <div class="bg-theme-card border border-theme p-8 rounded-[28px] flex flex-col justify-between hover:border-purple-500/20 transition-all duration-300 shadow-sm reveal-item delay-100">
          <div>
            <span class="text-[9px] font-black text-theme-secondary uppercase tracking-[0.2em]">Uji Coba</span>
            <h3 class="text-xl font-black text-theme-primary mt-2">Paket GRATIS</h3>
            <p class="text-xs text-theme-secondary mt-3 leading-relaxed font-medium">Sangat cocok untuk mengetes sinkronisasi akun e-learning UT Anda.</p>
            <div class="my-6">
              <span class="text-3.5xl font-black text-theme-primary font-mono">Rp 0</span>
              <span class="text-[9px] text-theme-secondary uppercase tracking-widest font-black"> / selamanya</span>
            </div>
            <div class="h-[1px] bg-theme-divider my-5"></div>
            <ul class="space-y-4 text-xs text-theme-secondary">
              <li class="flex items-center gap-3">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Maks 10.000 Token AI / Bulan</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Bypass Sinkronisasi e-learning UT</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Auto-Absensi e-learning</span>
              </li>
            </ul>
          </div>
          <router-link 
            to="/login"
            class="w-full py-4 mt-8 text-xs font-bold rounded-xl text-center transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 uppercase tracking-widest cursor-pointer border flex items-center justify-center"
            :class="isDarkMode ? 'bg-[#10111c] hover:bg-[#161828] border-[#1e2040] text-gray-300 hover:text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900'"
          >
            Mulai Percobaan
          </router-link>
        </div>

        <!-- Tier Premium -->
        <div class="bg-theme-card border-2 border-purple-500/30 p-8 rounded-[28px] flex flex-col justify-between relative hover:border-purple-500/50 transition-all duration-300 shadow-md reveal-item delay-200">
          <div class="absolute top-0 right-6 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-[9px] font-extrabold uppercase tracking-widest text-white shadow-md">
            Rekomendasi Utama
          </div>
          <div>
            <span class="text-[9px] font-black text-purple-400 uppercase tracking-[0.2em] font-black">The Scholar</span>
            <h3 class="text-xl font-black text-theme-primary mt-2">Paket PREMIUM</h3>
            <p class="text-xs text-theme-secondary mt-3 leading-relaxed font-medium">Mengcover 4-8 mata kuliah dengan token yang aman untuk ringkasan modul penuh & tugas AI.</p>
            <div class="my-6">
              <span class="text-3.5xl font-black text-theme-primary font-mono">Rp 49.000</span>
              <span class="text-[9px] text-theme-secondary uppercase tracking-widest font-black"> / bulan</span>
            </div>
            <div class="h-[1px] bg-theme-divider my-5"></div>
            <ul class="space-y-4 text-xs text-theme-secondary">
              <li class="flex items-center gap-3">
                <span class="text-purple-500 font-bold">✓</span>
                <span class="text-theme-primary font-semibold">Maks 750.000 Token AI / Bulan</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Pareto Summarizer Tanpa Batas</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Auto Attendance & Mark as Done</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Generator Jawaban Forum Diskusi</span>
              </li>
            </ul>
          </div>
          <router-link 
            to="/login"
            class="w-full py-4 mt-8 bg-purple-600 hover:bg-purple-500 text-xs font-bold rounded-xl text-white text-center transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 uppercase tracking-widest cursor-pointer shadow-lg shadow-purple-500/20 flex items-center justify-center"
          >
            Upgrade ke Premium
          </router-link>
        </div>

        <!-- Tier Elite -->
        <div class="bg-theme-card border border-theme p-8 rounded-[28px] flex flex-col justify-between hover:border-purple-500/20 transition-all duration-300 shadow-sm reveal-item delay-300">
          <div>
            <span class="text-[9px] font-black text-theme-secondary uppercase tracking-[0.2em]">The Bypass Engine</span>
            <h3 class="text-xl font-black text-theme-primary mt-2">Paket ELITE</h3>
            <p class="text-xs text-theme-secondary mt-3 leading-relaxed font-medium">Beban belajar penuh 8 mata kuliah yang ingin bypass instan dengan performa engine akademik Kaizora.</p>
            <div class="my-6">
              <span class="text-3.5xl font-black text-theme-primary font-mono">Rp 99.000</span>
              <span class="text-[9px] text-theme-secondary uppercase tracking-widest font-black"> / bulan</span>
            </div>
            <div class="h-[1px] bg-theme-divider my-5"></div>
            <ul class="space-y-4 text-xs text-theme-secondary">
              <li class="flex items-center gap-3">
                <span class="text-purple-500 font-bold">✓</span>
                <span class="text-theme-primary font-semibold">Maks 2.500.000 Token AI / Bulan</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Engine Akademik Penalaran Tinggi (Kaizora Core)</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Jalur Koneksi Crawling e-learning Prioritas</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-purple-500 font-bold">✓</span>
                <span>Integrasi Kustom & Bantuan Premium 24/7</span>
              </li>
            </ul>
          </div>
          <router-link 
            to="/login"
            class="w-full py-4 mt-8 text-xs font-bold rounded-xl text-center transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 uppercase tracking-widest cursor-pointer border flex items-center justify-center"
            :class="isDarkMode ? 'bg-[#10111c] hover:bg-[#161828] border-[#1e2040] text-gray-300 hover:text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900'"
          >
            Ambil Paket Elite
          </router-link>
        </div>
      </div>
    </section>

    <!-- Scene 7: Academic FAQs (Editorial Accordion Pacing) -->
    <section class="min-h-screen flex flex-col justify-center max-w-4xl mx-auto px-12 py-32 relative z-10 border-t border-theme-divider">
      <div class="text-center mb-16 reveal-item">
        <span class="text-[9px] font-black uppercase tracking-[0.25em] text-purple-600 bg-purple-500/5 border border-purple-500/10 px-4 py-2 rounded-lg">FAQ & HELP</span>
        <h2 class="text-3xl md:text-[44px] font-black text-theme-primary mt-6 leading-tight font-sans">Bantuan & FAQ</h2>
        <p class="text-sm text-theme-secondary mt-3 max-w-md mx-auto leading-relaxed">Klik salah satu pertanyaan di bawah untuk membaca jawaban interaktif mengenai protokol bypass Kaizora.</p>
      </div>

      <div class="space-y-5 max-w-3xl mx-auto w-full reveal-item">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="border border-theme bg-theme-card rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-500/30"
        >
          <button 
            @click="toggleFaq(index)"
            class="w-full flex items-center justify-between px-7 py-6 text-left font-black text-xs uppercase tracking-wider text-theme-primary hover:text-purple-500 transition-colors duration-150 cursor-pointer"
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
          
          <div 
            v-show="activeFaqIndex === index" 
            class="px-7 pb-6 text-xs text-theme-secondary leading-relaxed border-t border-theme-divider pt-5 font-medium transition-all duration-300"
          >
            {{ faq.a }}
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Scene -->
    <footer class="border-t border-theme-divider bg-theme-footer py-20 px-12 text-center text-xs text-theme-muted relative z-10 transition-colors duration-1000">
      <div class="max-w-7xl mx-auto space-y-4">
        <p class="font-bold text-theme-secondary uppercase tracking-widest text-[9px]">Kaizora Scholar Platform - Developed by Fadjar Setiawan for Universitas Terbuka.</p>
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
const scrollY = ref(0);
let animationFrameId = null;

const updateDOMTheme = () => {
  const el = document.documentElement;
  if (isDarkMode.value) {
    el.classList.remove('light-theme');
    el.classList.add('dark-theme');
    document.body.style.backgroundColor = '#08090f';
  } else {
    el.classList.remove('dark-theme');
    el.classList.add('light-theme');
    document.body.style.backgroundColor = '#fdfcfb';
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

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

// Advanced Multi-Layer Parallax Background Canvas System
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
  const particleCount = 80;
  
  // Layer definitions for stellar depth
  for (let i = 0; i < particleCount; i++) {
    const depthCategory = i % 3; // 3 layers of stars
    let radius, vx, vy, alpha, parallaxSpeed;
    
    if (depthCategory === 0) {
      // Foreground stars (larger, drifts slightly faster, reacts more to scroll)
      radius = Math.random() * 0.9 + 1.1;
      vx = (Math.random() - 0.5) * 0.08;
      vy = (Math.random() - 0.5) * 0.08;
      alpha = Math.random() * 0.35 + 0.4;
      parallaxSpeed = 0.35;
    } else if (depthCategory === 1) {
      // Midground stars (medium)
      radius = Math.random() * 0.5 + 0.6;
      vx = (Math.random() - 0.5) * 0.05;
      vy = (Math.random() - 0.5) * 0.05;
      alpha = Math.random() * 0.25 + 0.25;
      parallaxSpeed = 0.18;
    } else {
      // Background stars (tiny, drifts almost imperceptibly, static scroll offset)
      radius = Math.random() * 0.3 + 0.2;
      vx = (Math.random() - 0.5) * 0.02;
      vy = (Math.random() - 0.5) * 0.02;
      alpha = Math.random() * 0.15 + 0.15;
      parallaxSpeed = 0.08;
    }

    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius,
      vx,
      vy,
      alpha,
      parallaxSpeed
    });
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, width, height);
    
    // Draw stellar system
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      
      // Calculate parallax translation on Y axis
      const shiftedY = (p.y - scrollY.value * p.parallaxSpeed + height) % height;
      
      ctx.beginPath();
      ctx.arc(p.x, shiftedY, p.radius, 0, Math.PI * 2);
      
      if (isDarkMode.value) {
        ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`; 
      } else {
        ctx.fillStyle = `rgba(109, 40, 217, ${p.alpha * 0.5})`; 
      }
      ctx.fill();
    });
    
    // connected network nodes - very light constellations
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        // Only link midground & foreground stars for spatial link lines
        if (particles[i].radius < 0.5 || particles[j].radius < 0.5) continue;
        
        const dx = particles[i].x - particles[j].x;
        const shiftedYi = (particles[i].y - scrollY.value * particles[i].parallaxSpeed + height) % height;
        const shiftedYj = (particles[j].y - scrollY.value * particles[j].parallaxSpeed + height) % height;
        const dy = shiftedYi - shiftedYj;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.035;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, shiftedYi);
          ctx.lineTo(particles[j].x, shiftedYj);
          if (isDarkMode.value) {
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
          } else {
            ctx.strokeStyle = `rgba(109, 40, 217, ${alpha * 0.7})`;
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
  window.addEventListener('scroll', handleScroll, { passive: true });
  
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
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style>
/* ─── Scroll Reveal ─── */
.reveal-item {
  opacity: 0;
  transform: translateY(35px);
  transition: opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}
.reveal-item.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ─── Editorial Color Systems ─── */
.light-theme {
  --bg-main: #fdfcfb;
  --bg-card: #ffffff;
  --bg-hover: #fcfbf9;
  --bg-nav: rgba(253, 252, 251, 0.85);
  --bg-footer: #f5f4f0;
  --bg-badge: #f7f6f2;
  --border-color: #eae9e5;
  --border-btn: #e6e5e0;
  --text-primary: #12141a;
  --text-secondary: #565d6b;
  --text-muted: #9aa1ad;
  --purple-accent: #6d28d9;
  --divider-color: #eae9e5;
}

.dark-theme {
  --bg-main: #08090f;
  --bg-card: #0e1017;
  --bg-hover: #12151f;
  --bg-nav: rgba(8, 9, 15, 0.85);
  --bg-footer: #05060b;
  --bg-badge: #11131c;
  --border-color: #1a1d27;
  --border-btn: #1f2230;
  --text-primary: #edf0f5;
  --text-secondary: #9098a6;
  --text-muted: #5c6270;
  --purple-accent: #a78bfa;
  --divider-color: #171a24;
}

/* ─── Structural Matte Utility bindings ─── */
.bg-theme-main { background-color: var(--bg-main) !important; }
.bg-theme-card { background-color: var(--bg-card) !important; }
.bg-theme-footer { background-color: var(--bg-footer) !important; }
.bg-theme-badge { background-color: var(--bg-badge) !important; }
.border-theme-nav { border-color: var(--bg-nav) !important; }
.border-theme-divider { border-color: var(--divider-color) !important; }
.text-theme-primary { color: var(--text-primary) !important; }
.text-theme-secondary { color: var(--text-secondary) !important; }
.text-theme-muted { color: var(--text-muted) !important; }

/* ─── Matte overrides ─── */
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

/* ─── Global overrides ─── */
.light-theme .text-white { color: var(--text-primary) !important; }
.light-theme .text-gray-200,
.light-theme .text-gray-300 { color: var(--text-primary) !important; }
.light-theme .text-gray-400 { color: var(--text-secondary) !important; }
.light-theme .text-gray-500 { color: var(--text-muted) !important; }

/* ─── Subtle border control ─── */
.border-theme { border-color: var(--border-color) !important; }
.border-theme-btn { border-color: var(--border-btn) !important; }

/* ─── Strip Shadows to maintain flat physical editorial look ─── */
.shadow-2xl, .shadow-xl, .shadow-lg {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01) !important;
}
.dark-theme .shadow-2xl, .dark-theme .shadow-xl {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
}
</style>
