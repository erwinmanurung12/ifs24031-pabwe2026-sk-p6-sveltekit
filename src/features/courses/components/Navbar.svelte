<script lang="ts">
  import { Menu, X, LogOut } from "lucide-svelte";
  import { link, go } from "../../../helpers/navHelper";
  import { showConfirmDialog } from "../../../helpers/toolsHelper";
  import { profile, logout } from "../../auth/states/authStore";

  let { menuOpen = false, onToggle } = $props();

  async function handleLogout() {
    const ok = await showConfirmDialog("Kamu yakin ingin keluar dari akun ini?", { title: "Keluar", confirmText: "Keluar" });
    if (!ok) return;
    logout();
    await go("/auth/login", { replace: true });
  }
</script>

<header class="sticky top-0 z-30 border-b border-slate-200 bg-white">
  <div class="flex min-h-16 items-center gap-3 px-4 sm:px-6">
    <button
      type="button"
      class="btn btn-secondary lg:hidden"
      aria-label="Menu navigasi"
      aria-expanded={menuOpen}
      aria-controls="sidebar-menu"
      onclick={onToggle}
    >
      {#if menuOpen}<X size={20} aria-hidden="true" />{:else}<Menu size={20} aria-hidden="true" />{/if}
    </button>

    <a href="/" use:link class="flex items-center gap-2 text-lg font-extrabold text-slate-900">
      <img src="/logo.svg" alt="" width="32" height="32" class="h-8 w-8 rounded-lg" />
      <span>Delcom Courses</span>
    </a>

    <div class="ml-auto flex items-center gap-3">
      {#if $profile}
        <span class="hidden text-sm font-medium text-slate-800 sm:block">{$profile.name}</span>
      {/if}
      <button type="button" class="btn btn-secondary" onclick={handleLogout}>
        <LogOut size={18} aria-hidden="true" />
        <span>Keluar</span>
      </button>
    </div>
  </div>
</header>
