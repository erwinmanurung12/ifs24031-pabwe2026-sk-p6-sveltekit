<script lang="ts">
  import { go } from "../../../helpers/navHelper";
  import { token, sessionReady, profile, loadProfile } from "../states/authStore";

  let loadingProfile = false;

  // Pindah ke beranda hanya bila token, status sesi, dan profil sama-sama siap.
  $effect(() => {
    if (!$sessionReady || !$token) return;
    if ($profile) {
      go("/", { replace: true });
      return;
    }
    if (!loadingProfile) {
      loadingProfile = true;
      loadProfile().finally(() => (loadingProfile = false));
    }
  });
</script>
