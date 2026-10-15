// SweetAlert2 dimuat saat dibutuhkan agar bundel awal tetap kecil (skor Performance).
async function getSwal() {
  return (await import("sweetalert2")).default;
}

const BUTTON_COLOR = "#1d4ed8";

export async function showSuccessDialog(message, title = "Berhasil") {
  const Swal = await getSwal();
  return Swal.fire({ icon: "success", title, text: message, confirmButtonText: "Oke", confirmButtonColor: BUTTON_COLOR });
}

export async function showErrorDialog(message, title = "Gagal") {
  const Swal = await getSwal();
  return Swal.fire({ icon: "error", title, text: message, confirmButtonText: "Tutup", confirmButtonColor: BUTTON_COLOR });
}

export async function showWarningDialog(message, title = "Perhatian") {
  const Swal = await getSwal();
  return Swal.fire({ icon: "warning", title, text: message, confirmButtonText: "Mengerti", confirmButtonColor: BUTTON_COLOR });
}

export async function showConfirmDialog(message, { title = "Konfirmasi", confirmText = "Ya", cancelText = "Batal" } = {}) {
  const Swal = await getSwal();
  const result = await Swal.fire({
    icon: "question",
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: BUTTON_COLOR,
    cancelButtonColor: "#475569",
    reverseButtons: true,
  });
  return Boolean(result.isConfirmed);
}

export function formatDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
}
