# King · Courtside Player Stats V1.0.4

Website statis satu tim, file flat di root. Tidak memerlukan npm/build.

## Memasang pembaruan

1. Ekspor backup JSON dari menu Riwayat pada versi lama.
2. Ekstrak ZIP, unggah SEMUA isinya langsung ke root repository king-player-stats, mengganti file lama. Sertakan file baru scoreboard.js.
3. GitHub Settings → Pages → main → /(root).
4. Buka https://michaelsalim63-blip.github.io/king-player-stats/ dan muat ulang. Header versi harus V1.0.4.
5. Roster/statistik/urutan sebelumnya memakai penyimpanan browser yang sama. Jangan clear site data. Pindah browser/perangkat/domain tidak memindahkan data otomatis.

## Koneksi scoreboard otomatis

Config dan skema sudah diperiksa dari courtside_scoreboard_live_v1.1.4_balanced_display.zip yang diberikan pengguna. Database URL sudah terpasang dan Match ID default main. Tidak perlu menempel config atau mencentang verifikasi manual.

1. Buka controller scoreboard, login di sana dan pastikan online.
2. Buka menu Firebase Player Stats. Match ID main sesuai ZIP. Jika sempat diputuskan, klik Hubungkan.
3. Cocokkan clock, quarter, Start dan Pause kedua website. Status Terhubung muncul hanya setelah respons Firebase valid diterima. Status tidak sinkron membekukan MIN.
4. Siapkan pertandingan dan lima starter di Player Stats SEBELUM Start scoreboard. Pilih HOME/AWAY sesuai posisi King. Nama tim/lawan diisi sendiri.
5. Periksa MIN bertambah untuk lima pemain sesuai countdown. Saat pause/timeout/break harus berhenti. Lakukan SUB saat clock berhenti untuk hasil terbaik.

Player Stats membaca setiap 1 detik dengan REST GET, tidak pernah menulis ke Firebase. apiKey/authDomain tidak diperlukan oleh pembaca REST ini. Tidak perlu login di Player Stats. Rules dalam ZIP mengizinkan baca state pertandingan; jika rules produksi berubah, pembacaan bisa ditolak. Tidak perlu mengubah write rules.

Scoreboard menggunakan main berulang dan tidak mengirim ID unik untuk setiap pertandingan. Selesaikan pertandingan lama di Player Stats lalu buat yang baru sebelum pertandingan berikutnya. Aplikasi tidak menebak pergantian pertandingan.

## Roster dan statistik

- Roster 28+, tambah/edit/hapus, aktif/nonaktif dengan centang. Peserta pertandingan tanpa batas maksimum, minimal lima.
- Urutan nomor jersey (2 sebelum 10) atau nama A–Z. Pemain aktif selalu di atas. Urutan tersimpan; tidak mengubah susunan pertandingan yang sudah dibuat.
- Lima peserta pertama menjadi starter; gunakan SUB sebelum Start untuk mengubahnya.
- Pilih kartu pemain lalu catat 2PT/3PT/FT Made/Miss, OREB, DREB, AST, STL, BLK, TO, PF. PTS, attempts, REB, FGM/FGA dan persentase otomatis.
- SUB memilih tepat lima pemain berikutnya, dapat mengganti satu sampai lima pemain sekaligus.
- Undo membatalkan aksi statistik/SUB terakhir. Undo SUB mengalihkan menit sejak pergantian ke susunan sebelumnya. Untuk pergantian saat ini gunakan SUB.
- Box score per pemain/total tim, CSV, riwayat dan log. Selesaikan mengunci pertandingan. Ringkasan menjumlahkan pertandingan selesai dan PPG; GP menghitung semua peserta termasuk DNP.
- Backup JSON rutin. Impor mengganti data lokal setelah konfirmasi dan memutus koneksi sampai Hubungkan ditekan.

## MIN dan keterbatasan

MIN memakai perubahan gameSec yang diterima, bukan jam perangkat atau timer timeout/break. Tidak mengekstrapolasi syncedAt; tampilan dapat sedikit tertinggal dari scoreboard akibat polling dan latensi.

Sampel pertama membuat baseline. Selisih hanya dihitung jika sampel sebelumnya berjalan, quarter sama, jeda penerimaan ≤5 detik, timestamp sumber tidak mundur, dan penurunan clock masuk akal. Timestamp sama tidak boleh mengandung perubahan clock. Timestamp sumber lompat lebih dari 5 detik tidak diisi sebagai menit.

Pause tidak menambah menit; sampel pause pertama dapat memuat penurunan terakhir sejak sampel running. timeoutTeam, breakActive dan breakPending juga menghentikan hitungan. State running yang tidak diperbarui lebih dari 5 detik dianggap macet dan MIN dibekukan.

Reset/kenaikan clock, quarter berubah, reconnect, reload dan SUB membuat baseline baru. Detik yang hilang tidak diisi ulang. Pergantian quarter yang tidak tertangkap pada 00:00 dapat kehilangan detik terakhir. Koreksi clock mundur kecil dapat menyerupai waktu berjalan.

Gunakan satu tab operator statistik dan satu perangkat. Biarkan tab terlihat dan layar menyala. Tidak ada sinkronisasi statistik antarperangkat atau perlindungan multi-tab. Browser yang menangguhkan tab bisa membuat MIN kurang hitung. localStorage bisa hilang karena clear data, mode privat atau kuota habis; gunakan backup.

## Verifikasi

Skema/config diperiksa terhadap ZIP asli. Sintaks serta simulasi state/GET mencakup countdown, pause, timeout, break, overtime, reset, koneksi gagal/reconnect, state macet, multi-sub dan undo. Ini belum membuktikan rules/server produksi atau akurasi pada perangkat pertandingan; percobaan koneksi Firebase langsung diblokir aturan izin jaringan lingkungan pembuatan, dan uji pertandingan penuh belum dilakukan. Tidak ada kesimpulan bahwa Firebase online Anda menolak akses.

Bukti sumber: SHA256 ZIP 8CE36980DDEA3113DC3AD01836AB19C2C4EAFEC294EDE42622C734386DB92A51.
- firebase-config.js: databaseURL courtside-scoreboard-live-default-rtdb.asia-southeast1.firebasedatabase.app, COURTSIDE_MATCH_ID main.
- sync.js: ref matches/{id}/state; liveState() menambahkan syncedAt (waktu server dalam milidetik).
- app.js: gameSec detik, period 1–4 quarter dan 5+ overtime, gameRunning boolean. Timer break/timeout terpisah.
- firebase-rules.json: matches/$matchId/state/.read true; write dibatasi operator.
- index.html: judul V1.1.4 Sync. SETUP.txt masih berjudul V1.1.1; pemetaan berdasarkan kode aktual ZIP.

## Tampilan V1.0.4
Panel input statistik diperkecil dan dipasang tetap di bawah layar pada halaman Live saat pertandingan aktif. Nama/nomor pemain tetap terlihat, dengan SUB dan Undo di panel yang sama. ✓ berarti Made dan ✕ berarti Miss. Area bawah halaman menyesuaikan tinggi panel agar isi tetap dapat digulir sampai terlihat. Pada layar pendek panel dapat digulir sendiri. Dialog SUB tetap tampil di depan panel. Roster, Firebase dan data sebelumnya tidak berubah.
