import { apiRequest } from "../../../helpers/apiHelper";

const BASE = "/courses";

// ============================================================================
// CEK DOCS (https://open-api.delcom.org/docs/1.0/api-courses):
// Endpoint kursus (CRUD, cover, konten detail) mengikuti soal. Endpoint peserta,
// rating, dan status belajar di bawah ini adalah dugaan pola; cukup ubah di sini
// bila di docs berbeda. Komponen lain tidak perlu disentuh.
// ============================================================================
const PATH = {
  students: (id) => `${BASE}/${id}/students`, // POST = gabung, DELETE = keluar
  ratings: (id) => `${BASE}/${id}/ratings`, // POST { rating }
  contents: (id) => `${BASE}/${id}/contents`, // POST { title, youtube }
  content: (contentId) => `${BASE}/-/contents/${contentId}`, // GET, PUT, DELETE
  learn: (contentId) => `${BASE}/-/contents/${contentId}/learns`, // PUT { status: 0 | 1 }
};

const toBody = ({ title, description }) => ({ title, description });
const toContentBody = ({ title, youtube }) => ({ title, youtube });

export const postCourse = (payload) => apiRequest(BASE, { method: "POST", body: toBody(payload) });

export const postCourseCover = (id, file) => {
  const form = new FormData();
  form.append("cover", file);
  return apiRequest(`${BASE}/${id}/cover`, { method: "POST", body: form });
};

export const putCourse = (id, payload) => apiRequest(`${BASE}/${id}`, { method: "PUT", body: toBody(payload) });
export const getCourses = () => apiRequest(BASE);
export const getCourse = (id) => apiRequest(`${BASE}/${id}`);
export const deleteCourse = (id) => apiRequest(`${BASE}/${id}`, { method: "DELETE" });
export const deleteAllCourses = () => apiRequest(BASE, { method: "DELETE" });

export const postJoin = (id) => apiRequest(PATH.students(id), { method: "POST" });
export const deleteLeave = (id) => apiRequest(PATH.students(id), { method: "DELETE" });
export const postRating = (id, rating) => apiRequest(PATH.ratings(id), { method: "POST", body: { rating } });

export const postContent = (id, payload) =>
  apiRequest(PATH.contents(id), { method: "POST", body: toContentBody(payload) });
export const getContent = (contentId) => apiRequest(PATH.content(contentId));
export const putContent = (contentId, payload) =>
  apiRequest(PATH.content(contentId), { method: "PUT", body: toContentBody(payload) });
export const deleteContent = (contentId) => apiRequest(PATH.content(contentId), { method: "DELETE" });
export const putLearn = (contentId, status) => apiRequest(PATH.learn(contentId), { method: "PUT", body: { status } });
