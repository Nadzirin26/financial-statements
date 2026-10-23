# Catatan Keuangan

Aplikasi keuangan pribadi berbahasa Indonesia menggunakan React, Vite, Tailwind CSS, React Router, Recharts, jsPDF, dan jspdf-autotable. Seluruh data berjalan di browser tanpa backend.

## Menjalankan

Gunakan Node.js 20.19+ atau 22+.

```sh
npm install
npm run dev
```

Buka alamat localhost yang ditampilkan Vite. Untuk produksi jalankan `npm run build`; hasilnya ada di `dist`. Hosting harus mengarahkan URL aplikasi ke `index.html` untuk mendukung React Router. Web Crypto membutuhkan localhost atau HTTPS.

```sh
npm test
```

## Akun awal

| Peran | Username | Kata sandi |
|---|---|---|
| Admin | admin | admin123 |
| Pengguna contoh | user1 | user123 |

Akun disiapkan saat aplikasi pertama dibuka. Tidak ada registrasi publik. Admin dapat membuat akun, mereset kata sandi, dan menghapus pengguna beserta datanya. Admin utama dipertahankan. Kata sandi tersimpan sebagai hash SHA-256 dengan salt acak melalui Web Crypto; kata sandi akun awal tercantum di kode seed untuk keperluan demo.

## Fitur

- Dashboard bulan berjalan, tanggal Indonesia, pengingat pencatatan, lima transaksi terbaru, dan pemakaian anggaran dengan peringatan 80%/100%.
- Tambah, edit, hapus transaksi dengan konfirmasi, validasi nominal/tanggal/kategori, dan kategori pribadi.
- Catatan harian dengan total pemasukan/pengeluaran serta filter bulan, tahun, kategori, jenis, dan pencarian keterangan.
- Tabel rekap 12 bulan, total tahunan, grafik batang pemasukan/pengeluaran, donat kategori, dan garis tren. Tahun mengikuti data, termasuk tahun sebelumnya.
- PDF per bulan dengan rincian pengeluaran, pilihan menyertakan pemasukan, subtotal pengeluaran harian, ringkasan bulanan, dan total per kategori. Periode tanpa transaksi yang sesuai tidak menghasilkan PDF kosong.
- Backup JSON transaksi, kategori, dan anggaran; impor tervalidasi dan meminta konfirmasi sebelum mengganti data akun aktif. Akun dan kata sandi tidak dimasukkan ke backup.
- Tombol **Isi Data Contoh** di dashboard user1 menambahkan transaksi pada bulan berjalan. Data contoh tidak otomatis dimasukkan.
- Sidebar desktop, navigasi bawah untuk ponsel, serta notifikasi simpan/hapus. Sesi tetap aktif sampai keluar.

## Struktur

`src/components` berisi komponen UI, modal, formulir, dan grafik. `src/pages` berisi halaman. `src/services/storage.js` menjadi akses localStorage terpusat; autentikasi, transaksi, dan PDF dipisahkan ke layanan sendiri. `src/utils/aggregate.js` berisi perhitungan rekap murni, terpisah dari tampilan. `src/data` berisi akun awal dan kategori bawaan.

## Keterbatasan

- Autentikasi dan penyimpanan murni di sisi browser, sehingga keamanannya terbatas dan tidak setara sistem backend sungguhan. Pemilik perangkat dapat memodifikasi localStorage; proteksi route dan pemisahan userId bukan batas keamanan server. SHA-256 dengan salt mengikuti spesifikasi demo ini dan bukan pengganti fungsi hash kata sandi adaptif untuk sistem produksi.
- Data tersimpan per browser dan per perangkat, jadi tidak otomatis tersinkron ke perangkat lain. Gunakan fitur backup. Menghapus data situs/browser juga menghapus akun dan sesi.
- Ketersediaan localStorage dan kapasitas browser membatasi penyimpanan. Jangan menggunakan mode privat untuk catatan jangka panjang. Tidak ada sinkronisasi perubahan langsung antartab.
- Impor mengganti catatan akun aktif; ekspor backup terlebih dahulu jika data lama masih dibutuhkan. Anggaran bernilai nol dianggap belum diatur. Saldo ringkasan merupakan selisih pada periode yang ditampilkan, bukan saldo kumulatif rekening.
- Aplikasi tidak mengirim data ke server dan tidak menyediakan pemulihan kata sandi melalui email. Admin lokal dapat melakukan reset.

## Tampilan responsif

- Laptop / desktop (mulai 1024 px): sidebar tetap, kartu ringkasan tiga kolom, dan panel grafik menyesuaikan ruang.
- Tablet (641–1023 px): konten memakai lebar layar, menu geser dapat ditutup dengan tombol, backdrop, atau Escape, serta navigasi bawah.
- HP (sampai 640 px): transaksi menjadi kartu yang mudah dibaca, formulir satu kolom, tombol sentuh minimal 44 px, dan kolom input 16 px untuk menghindari zoom otomatis pada iOS.
- Tabel rekap dapat digeser di dalam panel tanpa menggeser seluruh halaman. Dialog dan navigasi memperhitungkan tinggi viewport serta safe area perangkat.

Validasi responsif dilakukan di browser pada lebar 320, 390, 768, 1024, dan 1366 px untuk Dashboard, Catatan Harian, Rekap, Cetak Laporan, dan Pengaturan. Tidak ditemukan overflow horizontal halaman; formulir transaksi HP dan buka/tutup menu juga diperiksa. Pengujian menggunakan emulasi ukuran viewport, bukan perangkat fisik.
