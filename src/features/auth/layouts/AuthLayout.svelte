<script lang="ts">
  let { children } = $props();
</script>

<a
  href="#main"
  class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-blue-800 focus:shadow-lg"
>Lewati ke konten utama</a>

<div class="grid min-h-screen bg-slate-50 lg:grid-cols-2">
  <header class="flex flex-col justify-between gap-8 bg-blue-800 px-6 py-8 text-white sm:px-10 lg:py-12">
    <div class="flex items-center gap-3">
      <img src="/logo.svg" alt="" width="40" height="40" class="h-10 w-10 rounded-xl" />
      <p class="text-xl font-extrabold">Delcom Courses</p>
    </div>
    <div class="max-w-md space-y-3">
      <p class="text-2xl font-bold leading-snug sm:text-3xl">Belajar lebih terarah lewat kursus video pilihan.</p>
      <p class="text-blue-100">Temukan kursus, tonton materi, dan pantau progres belajarmu di satu tempat.</p>
    </div>
  </header>

  <main id="main" tabindex="-1" class="flex items-center justify-center px-6 py-10 focus:outline-none sm:px-10">
    <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {@render children()}
    </div>
  </main>
</div>
