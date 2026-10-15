<script lang="ts">
  import Field from "../../common/components/Field.svelte";
  import FileInput from "../../common/components/FileInput.svelte";
  import { useInput } from "../../../hooks/useInput";
  import { showSuccessDialog, showErrorDialog, formatDate } from "../../../helpers/toolsHelper";
  import { profile, loadProfile } from "../../auth/states/authStore";
  import { putMe, postPhoto, putPassword } from "../api/userApi";

  const { value: name } = useInput("");
  const { value: email } = useInput("");
  const { value: currentPassword, reset: resetCurrent } = useInput("");
  const { value: newPassword, reset: resetNew } = useInput("");
  const { value: confirmPassword, reset: resetConfirm } = useInput("");

  let photo = $state(null);
  let savingProfile = $state(false);
  let savingPhoto = $state(false);
  let savingPassword = $state(false);
  let passwordError = $state("");

  $effect(() => {
    if ($profile) {
      name.set($profile.name ?? "");
      email.set($profile.email ?? "");
    }
  });

  async function saveProfile(event) {
    event.preventDefault();
    savingProfile = true;
    const res = await putMe({ name: $name, email: $email });
    savingProfile = false;
    if (!res.success) return showErrorDialog(res.message);
    await loadProfile();
    await showSuccessDialog(res.message);
  }

  async function savePhoto(event) {
    event.preventDefault();
    if (!photo) return showErrorDialog("Pilih berkas foto terlebih dahulu.");
    savingPhoto = true;
    const res = await postPhoto(photo);
    savingPhoto = false;
    if (!res.success) return showErrorDialog(res.message);
    await loadProfile();
    await showSuccessDialog(res.message);
  }

  async function savePassword(event) {
    event.preventDefault();
    passwordError = "";
    if ($newPassword !== $confirmPassword) {
      passwordError = "Konfirmasi kata sandi tidak sama dengan kata sandi baru.";
      return;
    }
    savingPassword = true;
    const res = await putPassword({ password: $currentPassword, newPassword: $newPassword });
    savingPassword = false;
    if (!res.success) return showErrorDialog(res.message);
    resetCurrent();
    resetNew();
    resetConfirm();
    await showSuccessDialog(res.message);
  }
</script>

<svelte:head>
  <title>Profil - Delcom Courses</title>
</svelte:head>

<h1 class="text-3xl font-extrabold text-slate-900">Profil</h1>
<p class="mt-1 text-slate-700">Kelola data diri, foto, dan kata sandi akunmu.</p>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
  <section aria-labelledby="profile-data" class="rounded-2xl border border-slate-200 bg-white p-6">
    <h2 id="profile-data" class="text-xl font-bold text-slate-900">Data diri</h2>
    {#if $profile}
      <p class="mt-1 text-sm text-slate-700">Bergabung sejak {formatDate($profile.created_at)}</p>
    {/if}
    <form class="mt-4 space-y-4" onsubmit={saveProfile}>
      <Field id="profile-name" label="Nama lengkap" required autocomplete="name" bind:value={$name} />
      <Field id="profile-email" label="Email" type="email" required autocomplete="email" bind:value={$email} />
      <button type="submit" class="btn btn-primary" disabled={savingProfile}>{savingProfile ? "Menyimpan..." : "Simpan perubahan"}</button>
    </form>
  </section>

  <section aria-labelledby="profile-photo" class="rounded-2xl border border-slate-200 bg-white p-6">
    <h2 id="profile-photo" class="text-xl font-bold text-slate-900">Foto profil</h2>
    <div class="mt-4 flex items-center gap-4">
      {#if $profile?.photo}
        <img src={$profile.photo} alt={`Foto profil ${$profile.name}`} width="80" height="80" class="h-20 w-20 rounded-full object-cover" />
      {:else}
        <span aria-hidden="true" class="grid h-20 w-20 place-items-center rounded-full bg-blue-100 text-3xl font-bold text-blue-900">
          {($profile?.name ?? "?").charAt(0).toUpperCase()}
        </span>
        <p class="text-sm text-slate-700">Belum ada foto profil.</p>
      {/if}
    </div>
    <form class="mt-4 space-y-4" onsubmit={savePhoto}>
      <FileInput id="profile-photo-file" label="Pilih foto baru" required hint="Format gambar, misalnya JPG atau PNG." onchange={(file) => (photo = file)} />
      <button type="submit" class="btn btn-primary" disabled={savingPhoto}>{savingPhoto ? "Mengunggah..." : "Unggah foto"}</button>
    </form>
  </section>

  <section aria-labelledby="profile-password" class="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
    <h2 id="profile-password" class="text-xl font-bold text-slate-900">Ubah kata sandi</h2>
    <form class="mt-4 grid max-w-xl gap-4" onsubmit={savePassword}>
      <Field id="password-current" label="Kata sandi saat ini" type="password" required autocomplete="current-password" bind:value={$currentPassword} />
      <Field id="password-new" label="Kata sandi baru" type="password" required autocomplete="new-password" bind:value={$newPassword} />
      <Field id="password-confirm" label="Konfirmasi kata sandi baru" type="password" required autocomplete="new-password" bind:value={$confirmPassword} />
      {#if passwordError}
        <p role="alert" class="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">{passwordError}</p>
      {/if}
      <div>
        <button type="submit" class="btn btn-primary" disabled={savingPassword}>{savingPassword ? "Menyimpan..." : "Ubah kata sandi"}</button>
      </div>
    </form>
  </section>
</div>
