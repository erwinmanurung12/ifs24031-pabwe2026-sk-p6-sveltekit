<script lang="ts">
  import Modal from "../../common/components/Modal.svelte";
  import Field from "../../common/components/Field.svelte";
  import FileInput from "../../common/components/FileInput.svelte";
  import { useInput } from "../../../hooks/useInput";
  import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
  import { addCourse, isAdding } from "../states/coursesStore";

  let { onclose } = $props();
  const { value: title } = useInput("");
  const { value: description } = useInput("");
  let cover = $state(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const res = await addCourse({ title: $title, description: $description }, cover);
    if (!res.success) return showErrorDialog(res.message);
    onclose();
    await showSuccessDialog(res.message);
  }
</script>

<Modal title="Tambah Kursus" {onclose}>
  <form class="space-y-4" onsubmit={handleSubmit}>
    <Field id="add-title" label="Judul kursus" required bind:value={$title} />
    <Field id="add-description" label="Deskripsi" multiline required bind:value={$description} />
    <FileInput id="add-cover" label="Sampul (opsional)" onchange={(file) => (cover = file)} />
    <div class="flex justify-end gap-3 pt-2">
      <button type="button" class="btn btn-secondary" onclick={() => onclose()}>Batal</button>
      <button type="submit" class="btn btn-primary" disabled={$isAdding}>{$isAdding ? "Menyimpan..." : "Simpan"}</button>
    </div>
  </form>
</Modal>
