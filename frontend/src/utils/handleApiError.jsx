export default function handleApiError(error) {
  
  if (!error.response) {
    return 'Tidak dapat terhubung ke server.';
  }

  const { status, data } = error.response;

  if (status === 401) return 'Anda belum login. Silakan login terlebih dahulu.';
  if (status === 403) return 'Akses ditolak. Hanya admin yang dapat mengakses halaman ini.';
  if (status === 422) {
    if (data.errors) {
      const messages = Object.values(data.errors).flat();
      return messages.join(' ');
    }
    return 'Validasi gagal.';
  }
  if (status === 404) return 'Data tidak ditemukan.';
  if (status === 500) return 'Terjadi kesalahan pada server.';

  return data?.message || 'Terjadi kesalahan tidak dikenal.';
}
