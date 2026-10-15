<script lang="ts">
  import { ArrowLeft, CircleCheck } from "lucide-svelte";
  import { link } from "../../../helpers/navHelper";
  import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
  import { content, isLoading, isContentMutating, fetchContent, setLearned, isLearned, getYoutubeId } from "../states/coursesStore";

  let { courseId, contentId } = $props();

  const videoId = $derived(getYoutubeId($content?.youtube));
  const learned = $derived(isLearned($content));

  $effect(() => {
    fetchContent(contentId);
  });

  async function toggleLearned() {
    const res = await setLearned($content.id, learned ? 0 : 1);
    if (res.success) await showSuccessDialog(learned ? "Materi ditandai belum selesai." : "Materi ditandai selesai. Kerja bagus!");
    else await showErrorDialog(res.message);
  }
</script>

<svelte:head>
  <title>{$content ? `${$content.title} - Delcom Courses` : "Materi - Delcom Courses"}</title>
</svelte:head>

<a href={`/courses/${courseId}`} use:link class="inline-flex min-h-11 items-center gap-2 font-semibold text-blue-800 underline">
  <ArrowLeft size={18} aria-hidden="true" />
  <span>Kembali ke kursus</span>
</a>

{#if $isLoading}
  <p role="status" class="mt-4 text-slate-700">Memuat materi...</p>
{:else if !$content}
  <section class="mt-6 rounded-xl border border-dashed border-slate-400 bg-white p-8 text-center">
    <h1 class="text-2xl font-bold text-slate-900">Materi tidak ditemukan</h1>
    <p class="mt-2 text-slate-700">Materi ini mungkin sudah dihapus.</p>
  </section>
{:else}
  <article class="mt-4 space-y-4">
    <h1 class="text-3xl font-extrabold text-slate-900">{$content.title}</h1>

    {#if videoId}
      <div class="aspect-video overflow-hidden rounded-2xl bg-slate-900">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={`Video materi: ${$content.title}`}
          loading="lazy"
          allow="encrypted-media; picture-in-picture; fullscreen"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
          class="h-full w-full border-0"
        ></iframe>
      </div>
    {:else}
      <p class="rounded-xl border border-dashed border-slate-400 bg-white p-6 text-slate-700">
        Tautan video tidak dapat diputar di sini.
        {#if $content.youtube}
          <a href={$content.youtube} target="_blank" rel="noopener noreferrer" class="font-semibold text-blue-800 underline">Buka tautan<span class="sr-only"> (tab baru)</span></a>
        {/if}
      </p>
    {/if}

    <div class="flex flex-wrap items-center gap-3">
      <button type="button" class={learned ? "btn btn-secondary" : "btn btn-primary"} onclick={toggleLearned} disabled={$isContentMutating}>
        <CircleCheck size={18} aria-hidden="true" />
        <span>{learned ? "Tandai belum selesai" : "Tandai selesai"}</span>
      </button>
      <p role="status" class="text-sm font-medium text-slate-700">{learned ? "Status: selesai" : "Status: belum selesai"}</p>
    </div>
  </article>
{/if}
