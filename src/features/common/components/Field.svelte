<script lang="ts">
  let {
    id,
    label,
    type = "text",
    value = $bindable(""),
    required = false,
    autocomplete = undefined,
    placeholder = "",
    multiline = false,
    rows = 4,
    options = null,
    error = "",
    hint = "",
  } = $props();

  const describedBy = $derived(
    [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined
  );
  const fieldClass =
    "block min-h-11 w-full rounded-lg border border-slate-500 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-500 aria-[invalid=true]:border-red-700";
</script>

<div class="space-y-1.5">
  <label for={id} class="block text-sm font-semibold text-slate-800">
    {label}{#if required}<span aria-hidden="true"> *</span>{/if}
  </label>

  {#if multiline}
    <textarea
      {id}
      {rows}
      {required}
      {placeholder}
      class={fieldClass}
      value={value}
      oninput={(event) => (value = event.currentTarget.value)}
      aria-describedby={describedBy}
      aria-invalid={error ? "true" : undefined}
    ></textarea>
  {:else if options}
    <select
      {id}
      {required}
      class={fieldClass}
      value={value}
      onchange={(event) => (value = event.currentTarget.value)}
      aria-describedby={describedBy}
      aria-invalid={error ? "true" : undefined}
    >
      {#each options as option (option.value)}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  {:else}
    <input
      {id}
      {type}
      {required}
      {autocomplete}
      {placeholder}
      class={fieldClass}
      value={value}
      oninput={(event) => (value = event.currentTarget.value)}
      aria-describedby={describedBy}
      aria-invalid={error ? "true" : undefined}
    />
  {/if}

  {#if hint}<p id={`${id}-hint`} class="text-sm text-slate-700">{hint}</p>{/if}
  {#if error}<p id={`${id}-error`} class="text-sm font-medium text-red-700">{error}</p>{/if}
</div>
