import { writable } from "svelte/store";

/** Hook input formulir: store nilai + fungsi reset. Dipakai dengan bind:value={$nama}. */
export function useInput(initial = "") {
  const value = writable(initial);
  const reset = () => value.set(initial);
  return { value, reset };
}
