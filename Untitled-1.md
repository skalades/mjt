Rencana Implementasi: Sistem Mandiri Jaya Teknik (MJT)
Rencana pengembangan platform digital terintegrasi untuk MJT yang mencakup Branding (Front-end) dan MRP (Back-end).

Tinjauan Pengguna Diperlukan
IMPORTANT

Konfirmasi Tech Stack: Saya akan menggunakan Laravel 11, React, Tailwind CSS, dan Inertia.js. Ini memberikan performa aplikasi satu halaman (SPA) yang cepat dengan backend Laravel yang kokoh.

Pendekatan Estetika: Saya akan menerapkan desain industri modern dengan kontras tinggi, menggunakan skema warna gelap (dark mode), gradien halus, dan Framer Motion untuk mikro-animasi agar memberikan kesan premium.

Rencana Perubahan
Fase 1: Inisialisasi Proyek & Arsitektur Dasar (Skalabel)
Fokus pada fase ini adalah membangun fondasi yang kokoh, mudah di-maintenance, dan siap berkembang (scalable) tanpa refactoring besar-besaran di masa depan:

Instalasi Framework & Tipe Data Ketat:
Inisialisasi Laravel 11 terbaru.
Setup Laravel Breeze dengan React + TypeScript + Inertia.js. Penggunaan TypeScript sangat krusial untuk skala enterprise (seperti MRP) karena mencegah bug sejak awal dan membuat kode lebih prediktif (mudah dikembangkan tim).
Arsitektur Frontend Berbasis Komponen Modular:
Menyusun struktur di resources/js:
Components/: UI kecil yang reusable (Tombol, Input, Modal, Kartu, BottomNavigation khusus mobile).
Layouts/: Pemisahan tata letak antara Landing Page (Publik) dan Panel Admin (Privat). Layout ini akan responsif, memuat Sidebar untuk Desktop dan Bottom Navigation Bar untuk kemudahan kontrol di layar Mobile.
Pages/: Tampilan halaman Inertia.
Lib/ atau Utils/: Kumpulan fungsi pembantu (format uang, tanggal).
Hooks/: Custom React hooks agar komponen tetap rapi tanpa logika yang menumpuk.
Fondasi Desain & Tema Dinamis (Tailwind CSS):
Setup tailwind.config.ts dengan variabel CSS khusus. Ini memungkinkan kita membuat sistem warna sentral (Deep Slate, Industrial Orange) yang konsisten dan langsung beradaptasi dengan Dark Mode.
Standarisasi ukuran spacing dan tipografi.
Tooling & Kualitas Kode:
Integrasi eslint dan prettier (ditambah plugin auto-sort Tailwind) agar standar kerapian kode otomatis terjaga.
Konfigurasi Lingkungan Terstandar:
Pengaturan variabel environment (.env) yang terstruktur.
Konfigurasi Database MySQL/PostgreSQL dasar yang disiapkan untuk implementasi UUID atau Indexing performa tinggi pada fase database berikutnya.
Fase 2: Arsitektur Database & Relasi (Skalabel)
Merancang skema database yang tangguh, mendukung audit yang ketat, dan menjamin kinerja tinggi (High Performance) ketika data telah mencapai ratusan ribu baris di masa depan:

[BARU] Perancangan Tabel Utama & Migrasi Optimal
Penerapan Soft Deletes & Indexing:
Semua tabel kritikal akan dilengkapi Soft Deletes agar data tidak benar-benar hilang saat terhapus (menjaga integritas historis).
Menambahkan Index performa pada kolom yang sering di-query, seperti (status, created_at) pada tabel Order, guna memastikan pencarian tetap instan.
Manajemen Stok Akurat (inventory & inventory_transactions):
Skalabilitas: Kita tidak hanya menggunakan kolom statis yang mudah korup. Kita menerapkan sistem Ledger (Buku Besar Transaksi).
inventory_items mencatat master barang.
inventory_transactions mencatat riwayat Mutasi (IN/OUT/PRODUKSI) yang bersifat immutable (tidak bisa diedit sepihak, sangat penting untuk audit stok dan akuntansi perusahaan).
Manajemen Aset Cetakan (molds):
Mencakup pelacakan siklus hidup: client_id (jika milik klien), total_shots (jumlah tembakan, siap diskalakan ke fitur Predictive Maintenance), dan status (Aktif, Perbaikan, Rusak).
Relasi Pesanan yang Kompleks (orders, order_items, & production_logs):
Pisahkan struktur antara Header pesanan (orders) dan detail produk yang dipesan (order_items). Ini mendukung banyak varian produk dalam satu Surat Jalan/Faktur.
Tabel logika waktu nyata (production_logs) untuk mendata setiap perpindahan (contoh: Barang X dipindah dari Produksi ke QC oleh Admin A pada waktu Y).
Penyimpanan Dokumen (Polymorphic Relations):
Menggunakan relasi (polymorphic) pada database agar satu tabel documents dapat mengaitkan file PDF tidak hanya ke Orders (Quotation/Surat Jalan), tetapi juga siap dikaitkan ke Molds (File Desain Cetakan) atau entitas lain di masa depan tanpa membuat tabel duplikat.
Fase 3: Core Admin Panel & Otomasi Logika Bisnis (Skalabel)
Fase ini membangun 'mesin' utama dashboard MRP. Pendekatan ini difokuskan agar aplikasi tidak melambat (laggy) saat menangani puluhan pengguna dan jutaan baris data secara bersamaan.

[BARU] Modul Manajemen Skala Enterprise
Sistem Autentikasi & Keamanan Dasar (Single-Admin, Skalabel):
Sistem saat ini dirancang terpusat untuk 1 User Tunggal (Admin / Owner) agar pengelolaannya efisien.
Skalabilitas: Walaupun hanya single user, fondasi Authentication (menggunakan dasar Laravel Breeze) akan di-setup melalui Middleware. Artinya, jika bisnis berkembang dan Owner butuh membuat akun terpisah untuk karyawan (Mandor / QC), struktur sistem siap dibuka tanpa harus mengganti framework dari awal.
Optimasi Cerdas Pengambilan Data (Menghindari N+1 Queries):
Pengembangan Query tabel pesanan dan gudang dijamin menyertakan relasi secara eksplisit (Strict Eager Loading). Ini krusial di Laravel untuk mencegah satu halaman memicu ribuan akses database terpisah dan mengakibatkan crash.
Wajib menerapkan Server-side Pagination untuk mencegah payload berlebih ke respons React.
Virtualisasi UI pada Tabel Big Data (React Virtualization):
Logika Frontend untuk modul seperti OrderWorkflow dan riwayat inventaris akan menggunakan Virtual Scrolling. Ini artinya, meskipun tabel mengembalikan info 200 data dalam satu halaman, React hanya merender 15 baris yang terlihat di mata pengguna. Efeknya, penggunaan memori RAM browser ponsel/desktop menjadi super ringan.
State Management Ringan (Zustand / React Context):
Menghindari pembuatan Redux yang sangat kompleks. Kita menggunakan React Context atau Zustand murni untuk menyimpan status global yang ringan (seperti status Dark Theme, pop-up Bottom Nav, peringatan Low Stock Threshold) tanpa tumpang-tindih dengan logika backend Inertia.js.
Sistem Form & Validasi Ganda (Anti-Lag & Aman):
Menggunakan React Hook Form di sisi UI agar pengetikan di kotak input tidak menyebabkan seluruh halaman diproses berulang-ulang (trigger re-render).
Melapisi form dengan Form Request Validation tangguh di sisi backend untuk menolak entri salah dari celah manapun tanpa merusak isi database.
Fase 4: PDF Document Engine & Background Jobs (Skalabel)
Sub-sistem otomasi pembuatan dokumen PDF (Surat Jalan, Quotation, QC Pass). Karena pemrosesan PDF memakan daya komputasi (CPU-intensive), arsitekturnya dirancang agar tidak membebani server web utama.

[BARU] Arsitektur Ekstraksi Dokumen Terdistribusi
Pemrosesan Asinkron (Queue & Worker):
Pemrosesan PDF tidak terjadi di thread utama pengguna. Akan di-dispatch ke tabel antrean (jobs table/Redis). Ketika Admin klik "Cetak Ratusan Surat Jalan", UI langsung merespons "Sedang Diproses", sementara Background Worker mencetaknya satu per satu di belakang layar tanpa membuat website error/timeout.
Kesiapan Penyimpanan Skala Besar (Cloud / S3 Storage Ready):
File PDF yang dihasilkan tidak sembarangan dibuang ke folder lokal yang bisa membuat hardisk VPS penuh seketika. Sistem di-setup menggunakan Storage::disk Laravel yang modular. Di awal bisa disimpan di lokal, namun sangat mudah digeser ke AWS S3 / Cloudflare R2 saat file mencapai ratusan Gigabyte.
Queue Batching untuk Produksi Massal:
Menerapkan fitur Laravel Job Batching. Jika Owner butuh mencetak laporan 50 pesanan di akhir bulan, sistem akan memecahnya menjadi 50 micro-jobs terpisah yang dieksekusi paralel (mendukung multi-core CPU) agar selesai lebih cepat.
Library Rendering Teroptimasi (Browsershot/DomPDF):
Menggunakan dompdf untuk teks standar, atau mendelegasikan ke Node.js (Puppeteer/Browsershot) khusus untuk tata letak modern (Tailwind CSS) yang kompleks. Jika trafic tinggi membludak, server Puppeteer dapat dipisah (dijadikan Micro-service sendiri).
Keamanan Anti-Pemalsuan Skalabel (QR Hash):
Setiap "Surat Jalan" atau "Sertifikat QC" akan dibubuhi QR Code berisi kriptografi hash. Saat disecan, akan tembus divalidasi ke Endpoint API kita. Hasil tracking QR akan di-cache di Redis agar ribuan scan per detik (dari kurir/pabrik tujuan) tidak menghancurkan database utama.
Fase 5: Front-end Landing Page, SEO & Web Funnel (Skalabel)
Berfungsi sebagai etalase publik dan corong penjualan. Dirancang untuk tahan banting terhadap lonjakan pengunjung mendadak tanpa membuat server backend utama melambat.

[BARU] Optimasi Pemasaran Digital Berperforma Tinggi
Sistem Media & Gambar Kelas Dunia (CDN & WebP/AVIF):
Gambar mesin cetak dan hasil produksi pabrik (Portfolio) biasanya beresolusi HD dan berat. Kita akan menerapkan fungsi Lazy Loading (gambar tidak diproses sebelum layar di-scroll) dan menyajikannya via arsitektur CDN (Content Delivery Network). Ini menjamin website tetap memuat di bawah 2 detik bagi pengguna di seluruh internet dunia.
Optimalisasi Mesin Pencari Tingkat Lanjut (Inertia SSR):
Google kesulitan membaca website yang dirender murni pakai client-side React. Oleh karena itu disiapkan Server-Side Rendering (SSR) untuk Landing Page. Ini membuat meta-data, judul, dan katalog material cetak (silikon/karet) langsung masuk index pencarian Google tanpa masalah kompabilitas (Sangat scalable secara SEO).
Penyatuan Sistem Komponen (Tree Shaking & Reusability):
Landing Page akan menggunakan UI Library (tombol, formulir) yang persis sama dengan yang diciptakan untuk Admin Panel di Fase 1 & 3. Sistem Vite akan melakukan Tree-Shaking untuk membuang kode CSS & JS yang tidak terpakai sehingga Bundle Size (ukuran paket download web) tetap sangat ramping (ringan).
Alur RFQ (Formulir Pengajuan) dengan Queue & Rate Limiting:
Formulir khusus pemesanan (Leads) tidak langsung membentur database utama secara kaku. Prosesnya diarahkan melalui API Endpoint ekstra terlindungi.
Menggunakan Rate Limiting tingkat lanjut (membatasi 3 pengiriman form per alamat IP dalam semenit) demi menghindari kelebihan bobot Botnet / Spam.
Saat pengguna mengirim Form, proses pengiriman Email Auto-Responder ("Pesan Anda telah kami terima...") dipindahkan ke Background Queue, agar halaman merespons "Berhasil!" secara sekejap mat.
Fase 6: Optimasi Ekstrem, Search Engine, & Deployment Level (Skalabel)
Langkah pemolesan pamungkas. Di sinilah letak perbedaan aplikasi standar dengan aplikasi enterprise sejati. Fase ini menjamin sistem tidak meledak saat data membesar bertahun-tahun.

[BARU] Infrastruktur Pemeliharaan Kinerja Puncak
Mesin Pencari Terpisah (Laravel Scout + Meilisearch/Typesense):
Jika kita menggunakan fitur bawaan pencarian database standar (LIKE %...%), saat data pesanan menembus jutaan baris, server akan membaca setiap baris secara paksa dan berujung Crash.
Oleh karenanya digunakan Scout yang terhubung dengan mesin indeks eksternal super-cepat (seperti Meilisearch). Ini memungkinkan pencarian nama klien/nomor resi salah ketik (Typos) dengan hasil kurang dari 50 milidetik, sama sekali nol beban ke database MySQL utama!
Kesiapan Pemisahan Baca/Tulis Database (Read/Write Splitting):
Arsitektur koneksi database disiapkan untuk menerima pengaturan replikasi. Kelak jika sangat berat, semua proses INSERT (mencatat Surat Jalan, mengurai stok) dialihkan ke Master DB, sementara perintah Dashboard untuk sekedar SELECT (melihat data) dilempar ke server Replica.
Penyimpanan Cache Terdistribusi (Distributed Redis Caching):
Penghitungan statistik Dashboard Admin (Tren penjualan bulanan, sisa stok akhir) memakan banyak perulangan kueri. Hasil hitungan ini akan dibekukan ke dalam memori Redis.
Artinya, ribuan staf yang me-refresh Dashboard secara brutal bersamaan hanya me-ping Redis Memory, MySQL tidak tersentuh.
Log Sentinel & Pemantauan Performa (Error Tracking & Telemetry):
File log standar (laravel.log) lama-lama akan mencapai hitungan Gigabyte dan merusak sistem. Kami menanamkan sistem rotasi log otomatis (Daily Rotation).
Di sisi performa, penyiapan integrasi pelacakan anomali modern seperti Laravel Pulse, atau Sentry, agar Spike (tekanan tiba-tiba) dari CPU server bisa dicek status sumbatannya secara langsung.
Pertanyaan Terbuka
Logo/Warna: Apakah Anda memiliki logo atau kode warna brand khusus (misal: Oranye Industri, Kuning Safety, atau Biru Navy)?
Server: Apakah ada rencana untuk menggunakan VPS tertentu? (Ini berpengaruh pada pemilihan library PDF).
QR Code: Data apa yang ingin ditampilkan saat QR Code pada Surat Jalan di-scan? (Contoh: URL validasi atau riwayat pesanan).
Rencana Verifikasi
Pengujian Otomatis
php artisan test: Menguji logika pengurangan stok dan alur status pesanan.
Unit testing komponen React untuk validasi form RFQ.
Verifikasi Manual
Mengecek layout PDF agar presisi saat dicetak.
Menguji responsivitas pencarian pada Admin Panel.
Menjalankan skenario scan QR Code untuk memastikan validasi berjalan.