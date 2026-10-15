<script lang="ts">
  import Modal from "../../common/components/Modal.svelte";
  import Field from "../../common/components/Field.svelte";
  import { useInput } from "../../../hooks/useInput";
  import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
  import { addContent, changeContent, isContentMutating, getYoutubeId } from "../states/coursesStore";

  let { courseId, content = null, onclose } = $props();
  const { value: title } = useInput(content?.title ?? "");
  const { value: youtube } = useInput(content?.youtube ?? "");
  let urlError = $state("");

  async function handleSubmit(event) {
    event.preventDefault();
    urlError = "";
    if (!getYoutubeId($youtube)) {
      urlError = "Masukkan tautan YouTube yang valid, misalnya https://www.youtube.com/watch?v=...";
      return;
    }
    const payload = { title: $title, youtube: $youtube };
    const res = content ? await changeContent(courseId, content.id, payload) : await addContent(courseId, payload);
    if (!res.success) return showErrorDialog(res.message);
    onclose();
    await showSuccessDialog(res.message);
  }
</script>

<Modal title={content ? "Ubah Konten" : "Tambah Konten"} {onclose}>
  <form class="space-y-4" onsubmit={handleSubmit}>
    <Field id="content-title" label="Judul konten" required bind:value={$title} />
    <Field id="content-youtube" label="Tautan YouTube" type="url" required autocomplete="url" placeholder="https://www.youtube.com/watch?v=..." error={urlError} bind:value={$youtube} />
    <div class="flex justify-end gap-3 pt-2">
      <button type="button" class="btn btn-secondary" onclick={() => onclose()}>Batal</button>
      <button type="submit" class="btn btn-primary" disabled={$isContentMutating}>{$isContentMutating ? "Menyimpan..." : "Simpan"}</button>
    </div>
  </form>
</Modal>
