import { writable, derived } from "svelte/store";
import { getAccessToken, putAccessToken } from "../../../helpers/apiHelper";
import { getMe } from "../../users/api/userApi";

export const token = writable<any>(null);
export const sessionReady = writable(false);
export const profile = writable<any>(null);
export const isLoggedIn = derived(token, ($token) => Boolean($token));

/** Baca token dari localStorage. Dipanggil sekali di sisi klien. */
export function initSession() {
  token.set(getAccessToken());
  sessionReady.set(true);
}

export function startSession(newToken, user) {
  putAccessToken(newToken);
  profile.set(user);
  token.set(newToken);
}

export function logout() {
  putAccessToken(null);
  profile.set(null);
  token.set(null);
}

export async function loadProfile() {
  const res = await getMe();
  if (res.success && res.data?.user) {
    profile.set(res.data.user);
    return true;
  }
  logout();
  return false;
}
