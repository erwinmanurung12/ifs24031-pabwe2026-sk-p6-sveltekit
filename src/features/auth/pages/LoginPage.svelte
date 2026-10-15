<script lang="ts">
  import Field from "../../common/components/Field.svelte";
  import { useInput } from "../../../hooks/useInput";
  import { link, go } from "../../../helpers/navHelper";
  import { putAccessToken } from "../../../helpers/apiHelper";
  import { postLogin } from "../api/authApi";
  import { getMe } from "../../users/api/userApi";
  import { startSession } from "../states/authStore";

  const { value: email } = useInput("");
  const { value: password } = useInput("");
  let error = $state("");
  let loading = $state(false);

  async function handleSubmit(event) {
    event.preventDefault();
    error = "";
    loading = true;

    const res = await postLogin({ email: $email, password: $password });
    const accessToken = res.data?.token;
    if (!res.success || !accessToken) {
      error = res.message;
      loading = false;
      return;
    }

    // Token disimpan lebih dulu agar permintaan profil membawa header Authorization.
    putAccessToken(accessToken);
    const me = await getMe();
    if (!me.success || !me.data?.user) {
      putAccessToken(null);
      error = me.message;
      loading = false;
      return;
    }

    // Token, status login, dan profil siap bersamaan, baru pindah ke beranda.
    startSession(accessToken, me.data.user);
    await go("/", { replace: true });
  }
</script>

<svelte:head>
  <title>Masuk - Delcom Courses</title>
</svelte:head>

<h1 class="text-2xl font-extrabold text-slate-900">Masuk</h1>
<p class="mt-1 text-slate-700">Gunakan akun Delcom kamu untuk melanjutkan.</p>

<form class="mt-6 space-y-4" onsubmit={handleSubmit}>
  <Field id="login-email" label="Email" type="email" required autocomplete="email" bind:value={$email} />
  <Field id="login-password" label="Kata sandi" type="password" required autocomplete="current-password" bind:value={$password} />

  {#if error}
    <p role="alert" class="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">{error}</p>
  {/if}

  <button type="submit" class="btn btn-primary w-full" disabled={loading}>
    {loading ? "Memproses..." : "Masuk"}
  </button>
</form>

<p class="mt-6 text-center text-slate-700">
  Belum punya akun?
  <a href="/auth/register" use:link class="font-semibold text-blue-800 underline">Daftar sekarang</a>
</p>
