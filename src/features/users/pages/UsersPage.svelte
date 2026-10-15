<script lang="ts">
  import { onMount } from "svelte";
  import { users, usersLoading, fetchUsers } from "../states/userStore";
  import { profile } from "../../auth/states/authStore";

  onMount(() => {
    fetchUsers();
  });
</script>

<svelte:head>
  <title>Pengguna - Delcom Courses</title>
</svelte:head>

<h1 class="text-3xl font-extrabold text-slate-900">Pengguna</h1>
<p class="mt-1 text-slate-700">Daftar pengguna yang terdaftar di Delcom.</p>

{#if $usersLoading}
  <p role="status" class="mt-6 text-slate-700">Memuat pengguna...</p>
{:else if $users.length === 0}
  <p class="mt-6 rounded-xl border border-dashed border-slate-400 bg-white p-6 text-slate-700">Belum ada pengguna untuk ditampilkan.</p>
{:else}
  <ul class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
    {#each $users as user (user.id)}
      <li class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        {#if user.photo}
          <img src={user.photo} alt="" width="48" height="48" class="h-12 w-12 rounded-full object-cover" loading="lazy" />
        {:else}
          <span aria-hidden="true" class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-100 text-lg font-bold text-blue-900">
            {(user.name ?? "?").charAt(0).toUpperCase()}
          </span>
        {/if}
        <div class="min-w-0">
          <p class="truncate font-semibold text-slate-900">
            {user.name}
            {#if $profile && $profile.id === user.id}<span class="text-sm font-medium text-blue-800">(Kamu)</span>{/if}
          </p>
          <p class="truncate text-sm text-slate-700">{user.email}</p>
        </div>
      </li>
    {/each}
  </ul>
{/if}
