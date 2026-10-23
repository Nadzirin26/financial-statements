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
| Testing untuk umum | testing | testing123 |

Akun disiapkan saat aplikasi pertama dibuka. Tidak ada registrasi publik. Admin dapat membuat akun, mereset kata sandi, dan menghapus pengguna beserta datanya. Admin utama dipertahankan. Kata sandi tersimpan sebagai hash SHA-256 dengan salt acak melalui Web Crypto; kata sandi akun awal tercantum di kode seed untuk keperluan demo.

## Fitur

- Dashboard bulan berjalan, tanggal Indonesia, pengingat pencatatan, lima transaksi terbaru, dan pemakaian anggaran dengan peringatan 80%/100%.
- Tambah, edit, hapus transaksi dengan konfirmasi, validasi nominal/tanggal/kategori, dan kategori pribadi.
- Catatan harian dengan total pemasukan/pengeluaran serta filter bulan, tahun, kategori, jenis, dan pencarian keterangan.
- Tabel rekap 12 bulan, total tahunan, grafik batang pemasukan/pengeluaran, donat kategori, dan garis tren. Tahun mengikuti data, termasuk tahun sebelumnya.
- PDF per bulan dengan rincian pengeluaran, pilihan menyertakan pemasukan, subtotal pengeluaran harian, ringkasan bulanan, dan total per kategori. Periode tanpa transaksi yang sesuai tidak menghasilkan PDF kosong.
- Backup JSON transaksi, kategori, dan anggaran; impor tervalidasi dan meminta konfirmasi sebelum mengganti data akun aktif. Akun dan kata sandi tidak dimasukkan ke backup.
- Tombol **Isi Data Contoh** di dashboard user1 dan testing menambahkan transaksi pada bulan berjalan. Data contoh tidak otomatis dimasukkan.
- Sidebar desktop, navigasi bawah untuk ponsel, serta notifikasi simpan/hapus. Sesi tetap aktif sampai keluar.

## Struktur

`src/components` berisi komponen UI, modal, formulir, dan grafik. `src/pages` berisi halaman. `src/services/storage.js` menjadi akses localStorage terpusat; autentikasi, transaksi, dan PDF dipisahkan ke layanan sendiri. `src/utils/aggregate.js` berisi perhitungan rekap murni, terpisah dari tampilan. `src/data` berisi akun awal dan kategori bawaan.

## Keterbatasan

- Autentikasi dan penyimpanan murni di sisi browser, sehingga keamanannya terbatas dan tidak setara sistem backend sungguhan. Pemilik perangkat dapat memodifikasi localStorage; proteksi route dan pemisahan userId bukan batas keamanan server. SHA-256 dengan salt mengikuti spesifikasi demo ini dan bukan pengganti fungsi hash kata sandi adaptif untuk sistem produksi.
- Data tersimpan per browser dan per perangkat, jadi tidak otomatis tersinkron ke perangkat lain. Gunakan fitur backup. Menghapus data situs/browser juga menghapus akun dan sesi.
- Ketersediaan localStorage dan kapasitas browser membatasi penyimpanan. Jangan menggunakan mode privat untuk catatan jangka panjang. Tab yang masih memakai data lama akan ditolak saat menyimpan agar tidak menimpa perubahan terbaru; muat ulang tab tersebut sebelum melanjutkan.
- Impor mengganti catatan akun aktif; ekspor backup terlebih dahulu jika data lama masih dibutuhkan. Anggaran bernilai nol dianggap belum diatur. Saldo ringkasan merupakan selisih pada periode yang ditampilkan, bukan saldo kumulatif rekening.
- Aplikasi tidak mengirim data ke server dan tidak menyediakan pemulihan kata sandi melalui email. Admin lokal dapat melakukan reset, dan setiap pengguna dapat mengganti kata sandinya sendiri melalui Pengaturan dengan memasukkan kata sandi saat ini.

## Tampilan responsif

- Laptop / desktop (mulai 1024 px): sidebar tetap, kartu ringkasan tiga kolom, dan panel grafik menyesuaikan ruang.
- Tablet (641–1023 px): konten memakai lebar layar, menu geser dapat ditutup dengan tombol, backdrop, atau Escape, serta navigasi bawah.
- HP (sampai 640 px): transaksi menjadi kartu yang mudah dibaca, formulir satu kolom, tombol sentuh minimal 44 px, dan kolom input 16 px untuk menghindari zoom otomatis pada iOS.
- Tabel rekap dapat digeser di dalam panel tanpa menggeser seluruh halaman. Dialog dan navigasi memperhitungkan tinggi viewport serta safe area perangkat.

Validasi responsif dilakukan di browser pada lebar 320, 390, 768, 1024, dan 1366 px untuk Dashboard, Catatan Harian, Rekap, Cetak Laporan, dan Pengaturan. Tidak ditemukan overflow horizontal halaman; formulir transaksi HP dan buka/tutup menu juga diperiksa. Pengujian menggunakan emulasi ukuran viewport, bukan perangkat fisik.

## Deploy ke Vercel

1. Impor repository `Nadzirin26/financial-statements` ke Vercel dan pilih branch `main`.
2. Root Directory: akar repository (`./`). Framework Preset: **Vite**.
3. Install Command: `npm ci`. Build Command: `npm run build`. Output Directory: `dist`.
4. Tidak memerlukan environment variable, database, atau backend. Gunakan HTTPS bawaan Vercel untuk Web Crypto.
5. Deploy, lalu gunakan URL **Production** yang tetap untuk pemakaian sehari-hari.

`vercel.json` sudah mengatur fallback SPA ke `index.html`, sehingga URL seperti `/harian`, `/rekap`, `/pengaturan`, dan `/laporan` dapat diakses langsung atau di-refresh. Berkas aset hasil Vite dilayani Vercel sebagai aset statis. Perubahan yang di-push ke `main` akan menjadi deployment baru jika integrasi Git Vercel sudah aktif. Aplikasi siap dibangun untuk Vercel; deployment di akun Vercel pengguna perlu dilakukan dari dashboard Vercel.

## Pemakaian pribadi dan ketahanan data

- Masuk sebagai admin, ganti kata sandi awal di **Pengaturan**, lalu buat akun pribadi di **Kelola Akun**. Akun contoh hanya untuk mencoba. Akun dan perubahan kata sandi berlaku di browser/perangkat tersebut, bukan akun server yang tersinkron.
- Saat membeli sesuatu, pilih **Pengeluaran**, masukkan tanggal, nominal, kategori, dan keterangan barang/jasa (contoh: “Beli beras 5 kg”). Rincian ini tersimpan dan tersedia di catatan harian, rekap, backup, dan PDF pengeluaran.
- Transaksi tidak memiliki masa kedaluwarsa. Tidak ada pembersihan otomatis oleh aplikasi, reset saat ganti bulan/tahun, atau penghapusan transaksi saat logout, refresh, maupun redeploy pada domain produksi yang sama. Hapus transaksi dan hapus akun melalui UI membutuhkan konfirmasi. Impor yang mengganti catatan juga membutuhkan konfirmasi.
- **Lindungi penyimpanan lokal** di Pengaturan meminta persistent storage jika didukung browser. Izin dapat ditolak browser; fitur ini membantu mengurangi risiko pembersihan otomatis dan bukan jaminan data permanen.
- Simpan **Export Backup (JSON)** secara berkala di folder aman, terutama sebelum impor, pindah domain, mengganti perangkat, atau membersihkan browser. Backup tidak dienkripsi, jadi simpan sebagai dokumen pribadi. PDF membantu membaca laporan; gunakan JSON untuk pemulihan ke aplikasi.
- Data terikat pada origin (protokol + domain + port) dan profil browser. Data dari `localhost` tidak langsung muncul pada `*.vercel.app`. Pindahkan dengan ekspor JSON dari alamat lama dan impor pada alamat produksi. URL preview deployment dan custom domain juga memiliki penyimpanan terpisah. Redeploy pada URL produksi yang sama tidak mengubah origin.
- Penghapusan **data situs/cookies dan site data**, uninstall browser, mode privat, kebijakan pembersihan browser, kerusakan perangkat, atau modifikasi melalui DevTools tetap dapat menghapus/mengubah data. Aplikasi web lokal tidak dapat menjamin “hanya user/admin melalui tombol aplikasi yang bisa menghapus data”. Jaminan terhadap kejadian tersebut memerlukan salinan backup di luar penyimpanan situs.
- Data versi awal tetap dibaca tanpa reset. Penulisan baru menyimpan transaksi dan pengaturan dalam satu dokumen lokal per akun agar impor tidak berhenti dalam keadaan setengah terganti. Jika ruang penyimpanan penuh atau format rusak, aplikasi menampilkan kesalahan dan tidak mengosongkan data otomatis.

## Pemeriksaan sebelum penggunaan

`npm test` memverifikasi perhitungan, rincian pembelian setelah logout/login, pemisahan akun, kompatibilitas data lama, penolakan penimpaan dari tab lama, impor atomik saat kuota penuh, validasi backup, perlindungan data rusak, dan inisialisasi yang mempertahankan kata sandi pribadi. Jalankan `npm run build` untuk pemeriksaan produksi, lalu `npm run preview` untuk mencoba hasil build. Konfirmasi deployment Vercel yang sesungguhnya melalui URL produksi setelah Deploy selesai.

## Akun testing untuk umum

Bagikan username **testing** dan kata sandi **testing123** untuk mencoba aplikasi. Akun ini memiliki peran pengguna biasa dan tidak dapat membuka Kelola Akun. Tombol **Isi Data Contoh** tersedia di dashboard. Halaman login hanya menampilkan kredensial testing; kredensial admin/pengguna pribadi tidak ditampilkan di sana.

Akun testing otomatis ditambahkan satu kali pada browser yang sudah memakai versi lama, tanpa mengubah akun, kata sandi pribadi, sesi, atau transaksi yang ada. Jika username testing sudah dibuat manual, akun tersebut dipertahankan. Jika admin menghapus akun testing setelah pembaruan ini, aplikasi tidak membuatnya ulang saat refresh.

Karena tidak ada backend, orang yang memakai akun testing dari browser/perangkat berbeda memiliki data percobaan masing-masing. Ini bukan akun bersama dengan data yang tersinkron. Orang lain yang memakai browser/profil dan akun testing yang sama dapat membaca catatan testing di browser tersebut. Gunakan akun pribadi untuk data keuangan asli. Perubahan kata sandi dan akun admin juga berlaku lokal pada browser masing-masing; kode frontend bukan batas keamanan server.
