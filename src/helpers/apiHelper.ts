const TOKEN_KEY = "delcom_courses_token";

export function getAccessToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function putAccessToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // penyimpanan tidak tersedia
  }
}

/**
 * Pembungkus fetch ke Delcom Open API.
 * Respons dianggap berhasil bila field "status" bernilai "success".
 */
export async function apiRequest(path, { method = "GET", body = undefined, auth = true } = {}) {
  const headers = {};
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  if (body && !isForm) headers["Content-Type"] = "application/json";
  const token = auth ? getAccessToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${DELCOM_BASEURL}${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
    const json = await res.json().catch(() => null);
    const success = json?.status === "success";
    return {
      success,
      status: res.status,
      message: json?.message || (success ? "Berhasil" : "Terjadi kesalahan pada server"),
      data: json?.data ?? null,
    };
  } catch {
    return { success: false, status: 0, message: "Tidak dapat terhubung ke server", data: null };
  }
}
