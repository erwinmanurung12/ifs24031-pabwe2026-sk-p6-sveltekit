<script lang="ts">
  import Modal from "../../common/components/Modal.svelte";
  import FileInput from "../../common/components/FileInput.svelte";
  import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
  import { changeCourseCover, isChangingCover } from "../states/coursesStore";

  let { course, onclose } = $props();
  let cover = $state(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!cover) return showErrorDialog("Pilih berkas gambar terlebih dahulu.");
    const res = await changeCourseCover(course.id, cover);
    if (!res.success) return showErrorDialog(res.message);
    onclose();
    await showSuccessDialog(res.message);
  }
</script>

<Modal title="Ubah Sampul" {onclose}>
  <form class="space-y-4" onsubmit={handleSubmit}>
    <FileInput id="cover-file" label="Gambar sampul baru" required onchange={(file) => (cover = file)} />
    <div class="flex justify-end gap-3 pt-2">
      <button type="button" class="btn btn-secondary" onclick={() => onclose()}>Batal</button>
      <button type="submit" class="btn btn-primary" disabled={$isChangingCover}>{$isChangingCover ? "Mengunggah..." : "Unggah"}</button>
    </div>
  </form>
</Modal>
