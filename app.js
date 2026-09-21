// 1. DATABASE MAPPING SPESIFIK SURAH PILIHAN
const mappingDatabase = {
  1: { theme: "Ummul Kitab & Induk Al-Qur'an", desc: "Prinsip dasar akidah, ibadah, permohonan petunjuk hidayah, lan peta jalan kehidupan manusia." },
  2: { theme: "Fondasi Hukum & Kurikulum Umat", desc: "Panduan pembentukan masyarakat, hukum muamalah, kisah Bani Israil, lan pembeda kebenaran vs kebatilan." },
  3: { theme: "Keteguhan Akidah & Pertahanan Iman", desc: "Penegasan tauhid, bantahan penyimpangan akidah, lan pelajaran berharga saka Perang Uhud." },
  4: { theme: "Keadilan Sosial & Hak Wanita", desc: "Pengaturan hak wanita, anak yatim, pembagian waris, lan tata kelola masyarakat sing adil." },
  5: { theme: "Penyempurnaan Syariat & Perjanjian", desc: "Hukum makanan halal-haram, penyempurnaan agama Islam, lan ketegasan dalam menjaga janji marang Allah." },
  6: { theme: "Tauhid Hakiki & Pembuktian Kekuasaan", desc: "Bantahan marang kesyirikan, bukti keagungan Allah ing alam semesta, lan penegasan akidah murni." },
  7: { theme: "Sejarah Perjuangan Para Nabi", desc: "Kisah dialog Nabi Musa karo Fir'aun, peringatan kanggo penentang kebenaran, lan proses penciptaan manusia." },
  8: { theme: "Strategi Perang & Hukum Rampasan Harta", desc: "Pelajaran saka Perang Badar, pertolongan Allah marang wong beriman, lan aturan pembagian ghanimah." },
  9: { theme: "Pemutusan Hubungan Karo Wong Munafik", desc: "Ketegasan marang kaum musyrikin lan munafik, serta panggilan taubat kanggo wong sing beriman." },
  10: { theme: "Kebenaran Wahyu & Rahmat Allah", desc: "Penegasan kebenaran Al-Qur'an, kisah Nabi Yunus, lan hiburan kanggo Rasulullah nalika didustakan." },
  18: { theme: "Penyelamatan Fitnah Akhir Zaman", desc: "4 Benteng perlindungan saka fitnah: Agama (Pemuda Kahfi), Harta (Pemilik Kebun), Ilmu (Musa & Khidir), lan Kekuasaan (Zulkarnain)." },
  36: { theme: "Jantung Al-Qur'an & Hari Kebangkitan", desc: "Penegasan risalah kenabian, bukti kekuasaan Allah ing alam semesta, lan kepastian dina kebangkitan." },
  40: { theme: "Ampunan Allah & Peringatan Tuntunan Dakwah", desc: "Dikenal minangka Surah Al-Mu'min. Membahas seruan tauhid, kisah Mukmin keluarga Fir'aun, lan ancaman kesombongan." },
  55: { theme: "Nikmat Allah & Teguran Kufur Nikmat", desc: "Pengulangan ayat 'Fabi-ayyi ala-i Rabbikuma tukazziban' minangka peringatan atas segala nikmat penciptaan." },
  56: { theme: "Golongan Manusia ing Dina Kiamat", desc: "Pembagian manusia dadi 3 golongan: As-Sabiqun (paling awal), Ashabul Yamin (golongan tengen), lan Ashabul Syimal (golongan kiwa)." },
  67: { theme: "Kerajaan Allah & Benteng Siksa Kubur", desc: "Tafakur atas kesempurnaan ciptaan alam semesta lan pentingnya beramal terbaik ing ndonya." },
  112: { theme: "Pemurnian Akidah & Tauhid Hakiki", desc: "Penegasan sifat Allah Yang Maha Esa, tempat bergantung segala sesuatu, lan ora ana sing setara karo Panjenengane." },
  113: { theme: "Perlindungan saka Kejahatan Fisik & Gaib", desc: "Permohonan perlindungan marang Allah saka kejahatan makhluk, kegelapan malam, sihir, lan dengki." },
  114: { theme: "Perlindungan saka Bisikan Syaitan", desc: "Benteng diri saka bisikan tersembunyi syaitan ing njero dada manusia, saka golongan jin lan manusia." }
};

// 2. GENERATOR MAPPING DYNAMIC KANGGO KABEH SURAH (114 SURAH FULL)
function getSurahMappingInfo(surah) {
  const number = surah?.nomor ?? 1;
  const nameLatin = surah?.namaLatin ?? '';
  const meaning = surah?.arti ?? '';
  const place = surah?.tempatTurun === 'makkah' ? 'Makkiyah' : 'Madaniyah';
  const totalVerses = surah?.jumlahAyat ?? 0;

  // Yen wis ana ing database khusus, langsung gunakake
  if (mappingDatabase[number]) {
    return mappingDatabase[number];
  }

  // Yen durung ana, buat deskripsi tematik otomatis adhedhasar Makkiyah/Madaniyah & Arti Surah
  let themeTitle = `Hakikat & Kandungan Surah ${nameLatin}`;
  let themeDesc = '';

  if (place === 'Makkiyah') {
    themeTitle = `Peta Akidah & Tauhid Surah ${nameLatin}`;
    themeDesc = `Ngarahake pemahaman babagan makna "${meaning}". Fokus ing penguatan akidah, pemurnian tauhid, peringatan dina kiamat, lan tazkiyatun nufus (penyucian jiwa) ing periode Makkah (${totalVerses} ayat).`;
  } else {
    themeTitle = `Peta Hukum & Syariat Surah ${nameLatin}`;
    themeDesc = `Mengandung petunjuk praktis adhedhasar makna "${meaning}". Fokus ing tatanan hukum syariat, tata kelola sosial umat, persatuan masyarakat, lan pembentukan karakter muslim ing periode Madinah (${totalVerses} ayat).`;
  }

  return {
    theme: themeTitle,
    desc: themeDesc
  };
}

// 3. FUNGSI RENDER SURAH CONTENT (UPDATED)
function renderSurahContent(surah) {
  const number = surah?.nomor ?? 1;
  const nameArabic = surah?.nama ?? '';
  const nameLatin = surah?.namaLatin ?? '';
  const totalVerses = surah?.jumlahAyat ?? 0;
  const place = surah?.tempatTurun === 'makkah' ? 'Makkiyah' : 'Madaniyah';
  const meaning = surah?.arti ?? '';
  const verses = surah?.ayat ?? [];

  // Ambil mapping info dinamis (pasti 100% terisi kabeh 114 surah)
  const mappingInfo = getSurahMappingInfo(surah);

  let html = `
    <div class="mapping-banner">
      <div class="mapping-banner-header">
        <span class="mapping-tag">Surah ke-${number}</span>
        <span class="mapping-place">${place} • ${totalVerses} Ayat</span>
      </div>
      <h2 class="arabic-title">${nameArabic}</h2>
      <p class="surah-meta">${nameLatin} (${meaning})</p>

      <div class="mapping-theme-box">
        <div class="mapping-theme-title">Peta Kandungan (Mapping Tematik)</div>
        <div class="mapping-theme-desc"><strong>${mappingInfo.theme}:</strong> ${mappingInfo.desc}</div>
      </div>
    </div>

    ${number !== 9 ? `
      <div class="bismillah-box">
        <p class="arabic-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p class="translation-text">Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.</p>
      </div>
    ` : ''}
  `;

  verses.forEach(v => {
    const vNum = v?.nomorAyat ?? '';
    const audioUrl = v?.audio?.[selectedQoriKey] || v?.audio?.['01'] || '';

    html += `
      <div class="verse-card" id="verse-${vNum}">
        <div class="verse-left-controls">
          <div class="verse-number">${vNum}</div>
          ${audioUrl ? `<button class="btn-audio-play" onclick="toggleAudio(this, '${audioUrl}')" title="Putar/Hentikan Audio">▶</button>` : ''}
          <button class="btn-mark-verse" onclick="markLastRead(${number}, ${vNum}, '${nameLatin}')" title="Tandai Terakhir Dibaca">🔖</button>
        </div>
        <div class="verse-content">
          <p class="arabic-text">${v?.teksArab ?? ''}</p>
          <p class="translation-text">${v?.teksIndonesia ?? ''}</p>
        </div>
      </div>
    `;
  });

  quranContainer.innerHTML = html;
}
