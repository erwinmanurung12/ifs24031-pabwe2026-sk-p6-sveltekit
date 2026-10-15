<script lang="ts">
  let { id, label, accept = "image/*", required = false, hint = "", onchange } = $props();
</script>

<div class="space-y-1.5">
  <label for={id} class="block text-sm font-semibold text-slate-800">
    {label}{#if required}<span aria-hidden="true"> *</span>{/if}
  </label>
  <input
    {id}
    type="file"
    {accept}
    {required}
    aria-describedby={hint ? `${id}-hint` : undefined}
    class="block w-full text-sm text-slate-800 file:mr-4 file:min-h-11 file:rounded-lg file:border-0 file:bg-blue-700 file:px-4 file:font-semibold file:text-white"
    onchange={(event) => onchange(event.currentTarget.files?.[0] ?? null)}
  />
  {#if hint}<p id={`${id}-hint`} class="text-sm text-slate-700">{hint}</p>{/if}
</div>
