<script lang="ts">
  import Modal from "../../common/components/Modal.svelte";
  import Field from "../../common/components/Field.svelte";
  import { useInput } from "../../../hooks/useInput";
  import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
  import { changeCourse, isChanging } from "../states/coursesStore";

  let { course, onclose } = $props();
  const { value: title } = useInput(course.title ?? "");
  const { value: description } = useInput(course.description ?? "");

  async function handleSubmit(event) {
    event.preventDefault();
    const res = await changeCourse(course.id, { title: $title, description: $description });
    if (!res.success) return showErrorDialog(res.message);
    onclose();
    await showSuccessDialog(res.message);
  }
</script>

<Modal title="Ubah Kursus" {onclose}>
  <form class="space-y-4" onsubmit={handleSubmit}>
    <Field id="change-title" label="Judul kursus" required bind:value={$title} />
    <Field id="change-description" label="Deskripsi" multiline required bind:value={$description} />
    <div class="flex justify-end gap-3 pt-2">
      <button type="button" class="btn btn-secondary" onclick={() => onclose()}>Batal</button>
      <button type="submit" class="btn btn-primary" disabled={$isChanging}>{$isChanging ? "Menyimpan..." : "Simpan"}</button>
    </div>
  </form>
</Modal>
