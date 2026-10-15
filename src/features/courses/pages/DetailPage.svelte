<script lang="ts">
  import { ArrowLeft, Pencil, Image as ImageIcon, Trash2, Plus, Video, CircleCheck } from "lucide-svelte";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import ChangeCoverModal from "../modals/ChangeCoverModal.svelte";
  import ContentModal from "../modals/ContentModal.svelte";
  import { link, go } from "../../../helpers/navHelper";
  import { showConfirmDialog, showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
  import { profile } from "../../auth/states/authStore";
  import {
    course,
    isLoading,
    isDeleting,
    isJoining,
    isRating,
    isContentMutating,
    fetchCourse,
    removeCourse,
    joinCourse,
    leaveCourse,
    rateCourse,
    removeContent,
    isOwnerOf,
    isStudentOf,
    isLearned,
  } from "../states/coursesStore";

  let { courseId } = $props();
  let showChange = $state(false);
  let showCover = $state(false);
  let showContent = $state(false);
  let editingContent = $state(null);
  let rating = $state(0);

  const owner = $derived(isOwnerOf($course, $profile?.id));
  const student = $derived(isStudentOf($course, $profile?.id));

  $effect(() => {
    fetchCourse(courseId);
  });

  function openAddContent() {
    editingContent = null;
    showContent = true;
  }

  function openEditContent(item) {
    editingContent = item;
    showContent = true;
  }

  async function report(res) {
    if (res.success) await showSuccessDialog(res.message);
    else await showErrorDialog(res.message);
  }

  async function handleDelete() {
    const ok = await showConfirmDialog(`Hapus kursus "${$course.title}"? Tindakan ini tidak dapat dibatalkan.`, {
      title: "Hapus Kursus",
      confirmText: "Hapus",
    });
    if (!ok) return;
    const res = await removeCourse($course.id);
    if (!res.success) return showErrorDialog(res.message);
    await go("/");
    await showSuccessDialog(res.message);
  }

  async function handleLeave() {
    const ok = await showConfirmDialog("Kamu yakin ingin keluar dari kursus ini?", { title: "Keluar Kursus", confirmText: "Keluar" });
    if (ok) await report(await leaveCourse($course.id));
  }

  async function handleRate(event) {
    event.preventDefault();
    if (rating < 1) return showErrorDialog("Pilih rating 1 sampai 5 terlebih dahulu.");
    await report(await rateCourse($course.id, rating));
  }

  async function handleDeleteContent(item) {
    const ok = await showConfirmDialog(`Hapus konten "${item.title}"?`, { title: "Hapus Konten", confirmText: "Hapus" });
    if (ok) await report(await removeContent($course.id, item.id));
  }
</script>

<svelte:head>
  <title>{$course ? `${$course.title} - Delcom Courses` : "Detail Kursus - Delcom Courses"}</title>
</svelte:head>

<a href="/" use:link class="inline-flex min-h-11 items-center gap-2 font-semibold text-blue-800 underline">
  <ArrowLeft size={18} aria-hidden="true" />
  <span>Semua Kursus</span>
</a>

{#if $isLoading}
  <p role="status" class="mt-4 text-slate-700">Memuat detail kursus...</p>
{:else if !$course}
  <section class="mt-6 rounded-xl border border-dashed border-slate-400 bg-white p-8 text-center">
    <h1 class="text-2xl font-bold text-slate-900">Kursus tidak ditemukan</h1>
    <p class="mt-2 text-slate-700">Kursus ini mungkin sudah dihapus atau tidak tersedia.</p>
  </section>
{:else}
  <article class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
    {#if $course.cover}
      <img src={$course.cover} alt="" width="1200" height="400" class="aspect-[3/1] w-full object-cover" />
    {/if}
    <div class="space-y-4 p-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900">{$course.title}</h1>
          {#if Array.isArray($course.students)}
            <p class="mt-2 text-sm font-medium text-slate-700">{$course.students.length} peserta</p>
          {/if}
        </div>

        <!-- Antarmuka pemilik didahulukan bila pengguna sekaligus pemilik dan peserta. -->
        {#if owner}
          <div class="flex flex-wrap gap-2">
            <button type="button" class="btn btn-secondary" onclick={() => (showChange = true)}><Pencil size={18} aria-hidden="true" /><span>Ubah data</span></button>
            <button type="button" class="btn btn-secondary" onclick={() => (showCover = true)}><ImageIcon size={18} aria-hidden="true" /><span>Ubah sampul</span></button>
            <button type="button" class="btn btn-danger" onclick={handleDelete} disabled={$isDeleting}><Trash2 size={18} aria-hidden="true" /><span>Hapus</span></button>
          </div>
        {:else if student}
          <button type="button" class="btn btn-secondary" onclick={handleLeave} disabled={$isJoining}>Keluar dari kursus</button>
        {:else}
          <button type="button" class="btn btn-primary" onclick={async () => report(await joinCourse($course.id))} disabled={$isJoining}>
            {$isJoining ? "Memproses..." : "Gabung kursus"}
          </button>
        {/if}
      </div>

      {#if $course.description}
        <p class="whitespace-pre-line text-slate-800">{$course.description}</p>
      {/if}
    </div>
  </article>

  {#if student && !owner}
    <section class="mt-6 rounded-2xl border border-slate-200 bg-white p-6" aria-labelledby="rating-heading">
      <h2 id="rating-heading" class="text-xl font-bold text-slate-900">Beri rating</h2>
      <form class="mt-3 space-y-3" onsubmit={handleRate}>
        <fieldset>
          <legend class="text-sm font-semibold text-slate-800">Seberapa puas kamu dengan kursus ini? (1 sampai 5)</legend>
          <div class="mt-2 flex flex-wrap gap-2">
            {#each [1, 2, 3, 4, 5] as value (value)}
              <label class="cursor-pointer">
                <input type="radio" name="rating" {value} checked={rating === value} onchange={() => (rating = value)} class="peer sr-only" />
                <span class="grid min-h-11 min-w-11 place-items-center rounded-lg border border-slate-500 bg-white px-3 font-bold text-slate-900 peer-checked:border-blue-700 peer-checked:bg-blue-700 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-blue-300">
                  {value}<span class="sr-only"> dari 5</span>
                </span>
              </label>
            {/each}
          </div>
        </fieldset>
        <button type="submit" class="btn btn-primary" disabled={$isRating}>{$isRating ? "Mengirim..." : "Kirim rating"}</button>
      </form>
    </section>
  {/if}

  <section class="mt-6" aria-labelledby="contents-heading">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 id="contents-heading" class="text-xl font-bold text-slate-900">Daftar Konten</h2>
      {#if owner}
        <button type="button" class="btn btn-primary" onclick={openAddContent}><Plus size={18} aria-hidden="true" /><span>Tambah konten</span></button>
      {/if}
    </div>

    {#if !$course.contents || $course.contents.length === 0}
      <p class="mt-4 rounded-xl border border-dashed border-slate-400 bg-white p-6 text-slate-700">Belum ada konten pada kursus ini.</p>
    {:else}
      <ol class="mt-4 space-y-3">
        {#each $course.contents as item (item.id)}
          <li class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <div class="flex min-w-0 items-center gap-3">
              <Video size={22} aria-hidden="true" class="shrink-0 text-blue-800" />
              <a href={`/courses/${$course.id}/contents/${item.id}`} use:link class="font-semibold text-blue-800 underline">{item.title}</a>
              {#if isLearned(item)}
                <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
                  <CircleCheck size={14} aria-hidden="true" />Selesai
                </span>
              {/if}
            </div>
            {#if owner}
              <div class="flex gap-2">
                <button type="button" class="btn btn-secondary" onclick={() => openEditContent(item)} aria-label={`Ubah konten ${item.title}`}><Pencil size={18} aria-hidden="true" /><span>Ubah</span></button>
                <button type="button" class="btn btn-secondary" onclick={() => handleDeleteContent(item)} disabled={$isContentMutating} aria-label={`Hapus konten ${item.title}`}><Trash2 size={18} aria-hidden="true" /><span>Hapus</span></button>
              </div>
            {/if}
          </li>
        {/each}
      </ol>
    {/if}
  </section>

  {#if showChange}<ChangeModal course={$course} onclose={() => (showChange = false)} />{/if}
  {#if showCover}<ChangeCoverModal course={$course} onclose={() => (showCover = false)} />{/if}
  {#if showContent}<ContentModal courseId={$course.id} content={editingContent} onclose={() => (showContent = false)} />{/if}
{/if}
