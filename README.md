# SakuSantri

Sistem demo pengelolaan SPP dan kas pondok/sekolah untuk tiga peran:

- Administrator
- Petugas Tata Usaha
- Wali Santri

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite, lalu pilih salah satu peran pada halaman masuk. Semua akun menggunakan mode demo sehingga tidak memerlukan kredensial khusus.

## Fitur utama

- Dashboard keuangan, progres SPP, dan grafik arus kas
- Data santri dan wali santri
- Pembuatan tagihan SPP massal
- Pencatatan dan verifikasi pembayaran
- Iuran non-SPP seperti haul, imtihan, kegiatan, sarana, dan sosial
- Pembuatan iuran massal beserta status pembayaran per santri
- Tabungan santri dengan saldo, setoran, penarikan, dan riwayat transaksi
- Integrasi otomatis pembayaran iuran dan transaksi tabungan ke Buku Kas
- Buku kas masuk/keluar
- Laporan dan ekspor CSV
- Portal wali santri dan simulasi unggah bukti bayar
- Tampilan responsif untuk desktop dan ponsel
- Penyimpanan data demo pada `localStorage`

## Pemeriksaan

```bash
npm run lint
npm run build
npm run smoke
```

Perintah `smoke` memakai Google Chrome pada lokasi standar macOS dan menguji SPP, verifikasi iuran, setoran tabungan, integrasi Buku Kas, serta portal Wali Santri di desktop dan ponsel.

## Catatan implementasi

Versi ini adalah MVP front-end yang dapat langsung didemokan. Data disimpan di browser pengguna. Untuk penggunaan produksi dengan banyak pengguna, sambungkan model data pada `src/data.ts` ke API/database, lalu tambahkan autentikasi server, otorisasi per peran, penyimpanan bukti transfer, pencadangan, dan audit log.
# saku-santri
