<script lang="ts">
  import { onMount } from "svelte";
  import { Plus, Trash2, Users as UsersIcon } from "lucide-svelte";
  import Field from "../../common/components/Field.svelte";
  import AddModal from "../modals/AddModal.svelte";
  import { link } from "../../../helpers/navHelper";
  import { showConfirmDialog, showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
  import { profile } from "../../auth/states/authStore";
  import { courses, isLoading, isDeleting, isDeletingAll, fetchCourses, removeCourse, removeAllCourses, isOwnerOf } from "../states/coursesStore";

  let search = $state("");
  let onlyMine = $state(false);
  let showAdd = $state(false);

  const isMine = (item) => isOwnerOf(item, $profile?.id);

  const visible = $derived(
    $courses.filter((item) => {
      const keyword = search.trim().toLowerCase();
      const matches =
        !keyword || item.title?.toLowerCase().includes(keyword) || item.description?.toLowerCase().includes(keyword);
      return matches && (!onlyMine || isMine(item));
    })
  );

  onMount(() => {
    fetchCourses();
  });

  async function handleDelete(item) {
    const ok = await showConfirmDialog(`Hapus kursus "${item.title}"? Tindakan ini tidak dapat dibatalkan.`, {
      title: "Hapus Kursus",
      confirmText: "Hapus",
    });
    if (!ok) return;
    const res = await removeCourse(item.id);
    if (res.success) await showSuccessDialog(res.message);
    else await showErrorDialog(res.message);
  }

  async function handleDeleteAll() {
    const ok = await showConfirmDialog("Semua kursus milikmu akan dihapus. Lanjutkan?", {
      title: "Hapus Semua",
      confirmText: "Hapus semua",
    });
    if (!ok) return;
    const res = await removeAllCourses();
    if (res.success) await showSuccessDialog(res.message);
    else await showErrorDialog(res.message);
  }
</script>

<svelte:head>
  <title>Semua Kursus - Delcom Courses</title>
</svelte:head>

<div class="flex flex-wrap items-start justify-between gap-4">
  <div>
    <h1 class="text-3xl font-extrabold text-slate-900">Semua Kursus</h1>
    <p class="mt-1 text-slate-700">Temukan kursus baru atau kelola kursus milikmu.</p>
  </div>
  <div class="flex flex-wrap gap-3">
    {#if $courses.some(isMine)}
      <button type="button" class="btn btn-secondary" onclick={handleDeleteAll} disabled={$isDeletingAll}>
        <Trash2 size={18} aria-hidden="true" />
        <span>{$isDeletingAll ? "Menghapus..." : "Hapus semua"}</span>
      </button>
    {/if}
    <button type="button" class="btn btn-primary" onclick={() => (showAdd = true)}>
      <Plus size={18} aria-hidden="true" />
      <span>Tambah Kursus</span>
    </button>
  </div>
</div>

<div class="mt-6 flex flex-wrap items-end gap-4">
  <div class="w-full sm:max-w-sm">
    <Field id="search-course" label="Cari kursus" type="search" autocomplete="off" placeholder="Ketik judul atau deskripsi" bind:value={search} />
  </div>
  <label class="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-800">
    <input type="checkbox" bind:checked={onlyMine} class="h-5 w-5 accent-blue-700" />
    Hanya milik saya
  </label>
</div>

<section class="mt-6" aria-labelledby="list-heading">
  <h2 id="list-heading" class="text-xl font-bold text-slate-900">Daftar Kursus</h2>

  {#if $isLoading}
    <p role="status" class="mt-4 text-slate-700">Memuat kursus...</p>
  {:else if visible.length === 0}
    <p class="mt-4 rounded-xl border border-dashed border-slate-400 bg-white p-6 text-slate-700">
      Belum ada kursus yang cocok. Coba ubah pencarian atau tambahkan kursus baru.
    </p>
  {:else}
    <ul class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {#each visible as item (item.id)}
        <li class="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
          {#if item.cover}
            <img src={item.cover} alt="" width="640" height="360" loading="lazy" class="aspect-video w-full object-cover" />
          {/if}
          <div class="flex flex-1 flex-col gap-2 p-4">
            <h3 class="text-lg font-bold text-slate-900">
              <a href={`/courses/${item.id}`} use:link class="underline decoration-slate-400 underline-offset-2 hover:text-blue-800">{item.title}</a>
            </h3>
            {#if item.description}
              <p class="line-clamp-3 text-sm text-slate-700">{item.description}</p>
            {/if}
            {#if Array.isArray(item.students)}
              <p class="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <UsersIcon size={16} aria-hidden="true" />
                <span>{item.students.length} peserta</span>
              </p>
            {/if}
          </div>
          {#if isMine(item)}
            <div class="border-t border-slate-200 p-3">
              <button type="button" class="btn btn-secondary" onclick={() => handleDelete(item)} disabled={$isDeleting} aria-label={`Hapus kursus ${item.title}`}>
                <Trash2 size={18} aria-hidden="true" />
                <span>Hapus</span>
              </button>
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</section>

{#if showAdd}
  <AddModal onclose={() => (showAdd = false)} />
{/if}
