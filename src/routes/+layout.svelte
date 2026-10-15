<script lang="ts">
  import "../index.css";
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import CourseLayout from "../features/courses/layouts/CourseLayout.svelte";
  import { initSession } from "../features/auth/states/authStore";

  let { children } = $props();

  if (browser) initSession();

  const isAuthRoute = $derived(page.url.pathname.startsWith("/auth"));
</script>

{#if isAuthRoute}
  {@render children()}
{:else}
  <CourseLayout>
    {@render children()}
  </CourseLayout>
{/if}
