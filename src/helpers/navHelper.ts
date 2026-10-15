import { goto } from "$app/navigation";

export const go = (path, options = undefined) => goto(path, options?.replace ? { replaceState: true } : {});

// SvelteKit sudah menangani <a href="/..."> sendiri, jadi action ini sengaja kosong
// supaya komponen yang sama bisa dipakai di proyek Svelte (yang memakai router kustom).
export function link(_node) {
  return {};
}
