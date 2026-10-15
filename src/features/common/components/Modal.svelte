<script lang="ts">
  import { onMount } from "svelte";

  let { title, onclose, children } = $props();
  const uid = $props.id();
  let dialog;

  // <dialog> asli: fokus terjebak di dalam modal, Esc menutup, latar belakang inert.
  onMount(() => {
    const opener = document.activeElement;
    dialog.showModal();
    return () => {
      if (opener && typeof opener.focus === "function") opener.focus();
    };
  });
</script>

<dialog
  bind:this={dialog}
  aria-labelledby={`${uid}-title`}
  {onclose}
  class="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-900/60"
>
  <div class="max-h-[85vh] overflow-y-auto p-6">
    <h2 id={`${uid}-title`} class="mb-4 text-xl font-bold">{title}</h2>
    {@render children()}
  </div>
</dialog>
