import { writable } from "svelte/store";
import { getUsers } from "../api/userApi";

export const users = writable<any>([]);
export const usersLoading = writable(false);

export async function fetchUsers() {
  usersLoading.set(true);
  const res = await getUsers();
  if (res.success) users.set(res.data?.users ?? []);
  usersLoading.set(false);
  return res;
}
