<script lang="ts">
  import { page } from "$app/state";
  import NotFoundPage from "../features/common/pages/NotFoundPage.svelte";
</script>

{#if page.status === 404}
  <NotFoundPage />
{:else}
  <section class="py-16 text-center">
    <h1 class="text-2xl font-bold text-slate-900">Terjadi kesalahan</h1>
    <p class="mt-2 text-slate-700">{page.error?.message ?? "Silakan coba lagi beberapa saat lagi."}</p>
  </section>
{/if}
