// Halaman login/register dirender di sisi klien saja.
// Dengan SSR, form sudah tampil sebelum JavaScript ter-hydrate; jika form dikirim pada saat itu,
// browser melakukan submit bawaan (reload ke /auth/login?) dan token tidak pernah tersimpan.
export const ssr = false;
