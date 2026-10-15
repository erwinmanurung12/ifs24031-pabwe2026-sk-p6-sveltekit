<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import { go } from "../../../helpers/navHelper";
  import { token, sessionReady, profile, loadProfile } from "../../auth/states/authStore";

  let { children } = $props();
  let mounted = $state(false);
  let menuOpen = $state(false);
  let loadingProfile = false;

  const path = $derived(page.url.pathname);

  onMount(() => {
    mounted = true;
  });

  $effect(() => {
    void path;
    menuOpen = false;
  });

  $effect(() => {
    if (mounted && $sessionReady && !$token) go("/auth/login", { replace: true });
  });

  $effect(() => {
    if (mounted && $token && !$profile && !loadingProfile) {
      loadingProfile = true;
      loadProfile().finally(() => (loadingProfile = false));
    }
  });
</script>

{#if mounted && $token}
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-blue-800 focus:shadow-lg"
  >Lewati ke konten utama</a>

  <div class="min-h-screen bg-slate-50">
    <Navbar {menuOpen} onToggle={() => (menuOpen = !menuOpen)} />
    <div class="lg:flex">
      <Sidebar {path} open={menuOpen} />
      <main id="main" tabindex="-1" class="mx-auto w-full min-w-0 max-w-6xl flex-1 p-4 focus:outline-none sm:p-6 lg:p-8">
        {@render children()}
      </main>
    </div>
  </div>
{:else}
  <main id="main" class="grid min-h-screen place-items-center p-6">
    <h1 class="sr-only">Delcom Courses</h1>
    <p role="status" class="text-slate-700">Memuat...</p>
  </main>
{/if}
