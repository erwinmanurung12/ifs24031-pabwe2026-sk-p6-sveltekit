import { writable } from "svelte/store";
import * as api from "../api/courseApi";

export const courses = writable<any[]>([]);
export const course = writable<any>(null);
export const content = writable<any>(null);
export const isLoading = writable(false);

// Bendera mutasi
export const isAdding = writable(false);
export const isChanging = writable(false);
export const isChangingCover = writable(false);
export const isDeleting = writable(false);
export const isDeletingAll = writable(false);
export const isJoining = writable(false);
export const isRating = writable(false);
export const isContentMutating = writable(false);

// Pemilik: user_id kursus sama dengan id profil.
export const isOwnerOf = (item, userId) => Boolean(item && userId) && item.user_id === userId;

// Peserta: id pengguna ada di students (mendukung larik id maupun larik objek).
export const isStudentOf = (item, userId) =>
  Boolean(userId) &&
  Array.isArray(item?.students) &&
  item.students.some((student) => (typeof student === "object" && student !== null ? (student.user_id ?? student.id) : student) === userId);

// CEK DOCS: nama field status belajar pada konten.
export const isLearned = (item) => Number(item?.status ?? item?.learn_status ?? 0) === 1;

export function getYoutubeId(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1) || null;
    if (parsed.hostname.endsWith("youtube.com") || parsed.hostname.endsWith("youtube-nocookie.com")) {
      const v = parsed.searchParams.get("v");
      if (v) return v;
      const match = parsed.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{6,})/);
      return match ? match[1] : null;
    }
  } catch {
    // URL tidak valid
  }
  return null;
}

async function run(flag, task) {
  flag.set(true);
  try {
    return await task();
  } finally {
    flag.set(false);
  }
}

async function refreshList() {
  const res = await api.getCourses();
  if (res.success) courses.set(res.data?.courses ?? []);
}

async function refreshDetail(id) {
  const res = await api.getCourse(id);
  if (res.success) course.set(res.data?.course ?? null);
}

export async function fetchCourses() {
  isLoading.set(true);
  const res = await api.getCourses();
  if (res.success) courses.set(res.data?.courses ?? []);
  isLoading.set(false);
  return res;
}

export async function fetchCourse(id) {
  isLoading.set(true);
  course.set(null);
  const res = await api.getCourse(id);
  course.set(res.success ? (res.data?.course ?? null) : null);
  isLoading.set(false);
  return res;
}

export async function fetchContent(contentId) {
  isLoading.set(true);
  content.set(null);
  const res = await api.getContent(contentId);
  content.set(res.success ? (res.data?.course_content ?? null) : null);
  isLoading.set(false);
  return res;
}

export const addCourse = (payload, cover) =>
  run(isAdding, async () => {
    const res = await api.postCourse(payload);
    if (res.success) {
      // CEK DOCS: nama field id pada respons POST /courses.
      const id = res.data?.course_id ?? res.data?.id;
      if (cover && id) await api.postCourseCover(id, cover);
      await refreshList();
    }
    return res;
  });

export const changeCourse = (id, payload) =>
  run(isChanging, async () => {
    const res = await api.putCourse(id, payload);
    if (res.success) await refreshDetail(id);
    return res;
  });

export const changeCourseCover = (id, file) =>
  run(isChangingCover, async () => {
    const res = await api.postCourseCover(id, file);
    if (res.success) await refreshDetail(id);
    return res;
  });

export const removeCourse = (id) =>
  run(isDeleting, async () => {
    const res = await api.deleteCourse(id);
    if (res.success) courses.update((list) => list.filter((item) => item.id !== id));
    return res;
  });

export const removeAllCourses = () =>
  run(isDeletingAll, async () => {
    const res = await api.deleteAllCourses();
    if (res.success) await refreshList();
    return res;
  });

export const joinCourse = (id) =>
  run(isJoining, async () => {
    const res = await api.postJoin(id);
    if (res.success) await refreshDetail(id);
    return res;
  });

export const leaveCourse = (id) =>
  run(isJoining, async () => {
    const res = await api.deleteLeave(id);
    if (res.success) await refreshDetail(id);
    return res;
  });

export const rateCourse = (id, rating) =>
  run(isRating, async () => {
    const res = await api.postRating(id, rating);
    if (res.success) await refreshDetail(id);
    return res;
  });

export const addContent = (courseId, payload) =>
  run(isContentMutating, async () => {
    const res = await api.postContent(courseId, payload);
    if (res.success) await refreshDetail(courseId);
    return res;
  });

export const changeContent = (courseId, contentId, payload) =>
  run(isContentMutating, async () => {
    const res = await api.putContent(contentId, payload);
    if (res.success) await refreshDetail(courseId);
    return res;
  });

export const removeContent = (courseId, contentId) =>
  run(isContentMutating, async () => {
    const res = await api.deleteContent(contentId);
    if (res.success) await refreshDetail(courseId);
    return res;
  });

export const setLearned = (contentId, status) =>
  run(isContentMutating, async () => {
    const res = await api.putLearn(contentId, status);
    if (res.success) {
      const fresh = await api.getContent(contentId);
      if (fresh.success) content.set(fresh.data?.course_content ?? null);
    }
    return res;
  });
