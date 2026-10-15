<script lang="ts">
  import Field from "../../common/components/Field.svelte";
  import { useInput } from "../../../hooks/useInput";
  import { link, go } from "../../../helpers/navHelper";
  import { showSuccessDialog } from "../../../helpers/toolsHelper";
  import { postRegister } from "../api/authApi";

  const { value: name } = useInput("");
  const { value: email } = useInput("");
  const { value: password } = useInput("");
  let error = $state("");
  let loading = $state(false);

  async function handleSubmit(event) {
    event.preventDefault();
    error = "";
    loading = true;
    const res = await postRegister({ name: $name, email: $email, password: $password });
    loading = false;
    if (!res.success) {
      error = res.message;
      return;
    }
    await go("/auth/login");
    await showSuccessDialog("Akun berhasil dibuat. Silakan masuk dengan akun barumu.");
  }
</script>

<svelte:head>
  <title>Daftar - Delcom Courses</title>
</svelte:head>

<h1 class="text-2xl font-extrabold text-slate-900">Buat akun</h1>
<p class="mt-1 text-slate-700">Daftar gratis dan mulai gunakan Delcom Courses.</p>

<form class="mt-6 space-y-4" onsubmit={handleSubmit}>
  <Field id="register-name" label="Nama lengkap" required autocomplete="name" bind:value={$name} />
  <Field id="register-email" label="Email" type="email" required autocomplete="email" bind:value={$email} />
  <Field
    id="register-password"
    label="Kata sandi"
    type="password"
    required
    autocomplete="new-password"
    hint="Gunakan minimal 6 karakter."
    bind:value={$password}
  />

  {#if error}
    <p role="alert" class="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">{error}</p>
  {/if}

  <button type="submit" class="btn btn-primary w-full" disabled={loading}>
    {loading ? "Memproses..." : "Daftar"}
  </button>
</form>

<p class="mt-6 text-center text-slate-700">
  Sudah punya akun?
  <a href="/auth/login" use:link class="font-semibold text-blue-800 underline">Masuk</a>
</p>
