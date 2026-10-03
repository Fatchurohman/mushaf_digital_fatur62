const btnPilihSurah = document.getElementById('btn-pilih-surah');
const btnCloseModal = document.getElementById('btn-close-modal');
const modalSurah = document.getElementById('modal-surah');
const surahListContainer = document.getElementById('surah-list-container');
const quranContainer = document.getElementById('quran-container');
const currentSurahTitle = document.getElementById('current-surah-title');
const inputSearchSurah = document.getElementById('input-search-surah');
const tabBtns = document.querySelectorAll('.tab-btn');
const btnLastRead = document.getElementById('btn-last-read');
const selectQori = document.getElementById('select-qori');
const visitorCountElem = document.getElementById('visitor-count');

// ELEMEN KONTROL REGULASI TAMPILAN FONT & TERJEMAHAN
const selectArabicFont = document.getElementById('select-arabic-font');
const btnFontDecrease = document.getElementById('btn-font-decrease');
const btnFontIncrease = document.getElementById('btn-font-increase');
const fontSizeDisplay = document.getElementById('font-size-display');
const btnToggleTranslation = document.getElementById('btn-toggle-translation');
const labelToggleTranslation = document.getElementById('label-toggle-translation');

// ELEMEN MODAL DESKRIPSI MAPPING BARU
const modalMapping = document.getElementById('modal-deskripsi-mapping');
const btnCloseMapping = document.getElementById('btn-close-modal-mapping');
const modalMappingTitle = document.getElementById('modal-mapping-title');
const modalMappingContent = document.getElementById('modal-mapping-content');

let globalSurahList = [];
let currentFilter = 'all';
let currentSurahData = null;
let selectedQoriKey = '05'; // Default ke Mishary Rashid Al-Afasy

// STATE PENGATURAN TAMPILAN
let currentArabicFont = localStorage.getItem('mushaf_arabic_font') || "'Scheherazade New', serif";
let currentArabicFontSize = parseInt(localStorage.getItem('mushaf_arabic_font_size') || '28', 10);
let showTranslation = localStorage.getItem('mushaf_show_translation') !== 'false';

let currentAudio = null;
let currentPlayingBtn = null;

// DATABASE PEMETAAN PRESISI JUZ 1 - 30 SESUAI RALAT USER
const JUZ_MAPPING = [
  { juz: 1, surahId: 1, ayah: 1, name: "Al-Fatihah", title: "Juz 1 (Al-Fatihah 1:1 - Al-Baqarah 2:141)" },
  { juz: 2, surahId: 2, ayah: 142, name: "Al-Baqarah", title: "Juz 2 (Al-Baqarah 2:142 - Al-Baqarah 2:252)" },
  { juz: 3, surahId: 2, ayah: 253, name: "Al-Baqarah", title: "Juz 3 (Al-Baqarah 2:253 - Ali 'Imran 3:91)" },
  { juz: 4, surahId: 3, ayah: 92, name: "Ali 'Imran", title: "Juz 4 (Ali 'Imran 3:92 - An-Nisa' 4:23)" },
  { juz: 5, surahId: 4, ayah: 24, name: "An-Nisa'", title: "Juz 5 (An-Nisa' 4:24 - An-Nisa' 4:147)" },
  { juz: 6, surahId: 4, ayah: 148, name: "An-Nisa'", title: "Juz 6 (An-Nisa' 4:148 - Al-Ma'idah 5:82)" },
  { juz: 7, surahId: 5, ayah: 83, name: "Al-Ma'idah", title: "Juz 7 (Al-Ma'idah 5:83 - Al-An'am 6:110)" },
  { juz: 8, surahId: 6, ayah: 111, name: "Al-An'am", title: "Juz 8 (Al-An'am 6:111 - Al-A'raf 7:87)" },
  { juz: 9, surahId: 7, ayah: 88, name: "Al-A'raf", title: "Juz 9 (Al-A'raf 7:88 - Al-Anfal 8:40)" },
  { juz: 10, surahId: 8, ayah: 41, name: "Al-Anfal", title: "Juz 10 (Al-Anfal 8:41 - At-Taubah 9:93)" },
  { juz: 11, surahId: 9, ayah: 94, name: "At-Taubah", title: "Juz 11 (At-Taubah 9:94 - Hud 11:5)" },
  { juz: 12, surahId: 11, ayah: 6, name: "Hud", title: "Juz 12 (Hud 11:6 - Yusuf 12:52)" },
  { juz: 13, surahId: 12, ayah: 53, name: "Yusuf", title: "Juz 13 (Yusuf 12:53 - Al-Hijr 15:1)" },
  { juz: 14, surahId: 15, ayah: 2, name: "Al-Hijr", title: "Juz 14 (Al-Hijr 15:2 - An-Nahl 16:128)" },
  { juz: 15, surahId: 17, ayah: 1, name: "Al-Isra'", title: "Juz 15 (Al-Isra' 17:1 - Al-Kahf 18:74)" },
  { juz: 16, surahId: 18, ayah: 75, name: "Al-Kahf", title: "Juz 16 (Al-Kahf 18:75 - Thaha 20:135)" },
  { juz: 17, surahId: 21, ayah: 1, name: "Al-Anbiya'", title: "Juz 17 (Al-Anbiya' 21:1 - Al-Hajj 22:78)" },
  { juz: 18, surahId: 23, ayah: 1, name: "Al-Mu'minun", title: "Juz 18 (Al-Mu'minun 23:1 - Al-Furqan 25:20)" },
  { juz: 19, surahId: 25, ayah: 21, name: "Al-Furqan", title: "Juz 19 (Al-Furqan 25:21 - An-Naml 27:59)" },
  { juz: 20, surahId: 27, ayah: 60, name: "An-Naml", title: "Juz 20 (An-Naml 27:60 - Al-Ankabut 29:44)" },
  { juz: 21, surahId: 29, ayah: 45, name: "Al-Ankabut", title: "Juz 21 (Al-Ankabut 29:45 - Al-Ahzab 33:30)" },
  { juz: 22, surahId: 33, ayah: 31, name: "Al-Ahzab", title: "Juz 22 (Al-Ahzab 33:31 - Yasin 36:21)" },
  { juz: 23, surahId: 36, ayah: 22, name: "Yasin", title: "Juz 23 (Yasin 36:22 - Az-Zumar 39:31)" },
  { juz: 24, surahId: 39, ayah: 32, name: "Az-Zumar", title: "Juz 24 (Az-Zumar 39:32 - Fussilat 41:46)" },
  { juz: 25, surahId: 41, ayah: 47, name: "Fussilat", title: "Juz 25 (Fussilat 41:47 - Al-Jatsiyah 45:37)" },
  { juz: 26, surahId: 46, ayah: 1, name: "Al-Ahqaf", title: "Juz 26 (Al-Ahqaf 46:1 - Adz-Dzariyat 51:30)" },
  { juz: 27, surahId: 51, ayah: 31, name: "Adz-Dzariyat", title: "Juz 27 (Adz-Dzariyat 51:31 - Al-Hadid 57:29)" },
  { juz: 28, surahId: 58, ayah: 1, name: "Al-Mujadilah", title: "Juz 28 (Al-Mujadilah 58:1 - At-Tahrim 66:12)" },
  { juz: 29, surahId: 67, ayah: 1, name: "Al-Mulk", title: "Juz 29 (Al-Mulk 67:1 - Al-Mursalat 77:50)" },
  { juz: 30, surahId: 78, ayah: 1, name: "An-Naba'", title: "Juz 30 (An-Naba' 78:1 - An-Nas 114:6)" }
];

// EVENT LISTENER UNTUK CLOSING MODAL DESKRIPSI MAPPING
if (btnCloseMapping && modalMapping) {
  btnCloseMapping.addEventListener('click', () => {
    modalMapping.classList.add('hidden');
  });

  modalMapping.addEventListener('click', (e) => {
    if (e.target === modalMapping) {
      modalMapping.classList.add('hidden');
    }
  });
}

// FUNGSI UNTUK MEMBUKA DESKRIPSI MAPPING LENGKAP
function openMappingModal(title, fullText) {
  if (!modalMapping || !modalMappingContent) return;
  if (modalMappingTitle) {
    modalMappingTitle.textContent = title || "Peta Kandungan (Mapping Tematik)";
  }
  modalMappingContent.textContent = fullText || "Deskripsi tidak tersedia.";
  modalMapping.classList.remove('hidden');
}

// 1. DATABASE MAPPING TEMATIK SPESIFIK & LENGKAP
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
  12: { theme: "Kisah Terbaik Penuh Hikmah & Kesabaran", desc: "Perjalanan hidup Nabi Yusuf AS: saka pengkhianatan, godaan, penjara, nganti dadi pimpinan mawa kesabaran." },
  18: { theme: "Penyelamatan Fitnah Akhir Zaman", desc: "4 Benteng perlindungan saka fitnah: Agama (Pemuda Kahfi), Harta (Pemilik Kebun), Ilmu (Musa & Khidir), lan Kekuasaan (Zulkarnain)." },
  20: { theme: "Panggilan Dakwah & Pertolongan Allah", desc: "Kisah Nabi Musa ngadhepi Fir'aun, pentingnya shalat, lan peringatan saka kelalaian marang Al-Qur'an." },
  24: { theme: "Kehormatan Diri & Keagungan Cahaya Allah", desc: "Hukum menjaga kehormatan, aturan hijab, pergaulan rumah tangga, lan perumpamaan Cahaya Allah (Ayat An-Nur)." },
  36: { theme: "Jantung Al-Qur'an & Hari Kebangkitan", desc: "Penegasan risalah kenabian, bukti kekuasaan Allah ing alam semesta, lan kepastian dina kebangkitan." },
  40: { theme: "Ampunan Allah & Peringatan Tuntunan Dakwah", desc: "Membahas seruan tauhid, kisah Mukmin keluarga Fir'aun sing membela kebenaran, lan ancaman bagi kesombongan." },
  55: { theme: "Nikmat Allah & Teguran Kufur Nikmat", desc: "Pengulangan peringatan atas segala nikmat penciptaan alam semesta, surga, lan neraka." },
  56: { theme: "Golongan Manusia ing Dina Kiamat", desc: "Pembagian manusia dadi 3 golongan: As-Sabiqun (paling awal), Ashabul Yamin (golongan tengen), lan Ashabul Syimal (golongan kiwa)." },
  67: { theme: "Kerajaan Allah & Benteng Siksa Kubur", desc: "Tafakur atas kesempurnaan ciptaan alam semesta lan pentingnya beramal terbaik ing ndonya." },
  112: { theme: "Pemurnian Akidah & Tauhid Hakiki", desc: "Penegasan sifat Allah Yang Maha Esa, tempat bergantung segala sesuatu, lan ora ana sing setara karo Panjenengane." },
  113: { theme: "Perlindungan saka Kejahatan Fisik & Gaib", desc: "Permohonan perlindungan marang Allah saka kejahatan makhluk, kegelapan malam, sihir, lan dengki." },
  114: { theme: "Perlindungan saka Bisikan Syaitan", desc: "Benteng diri saka bisikan tersembunyi syaitan ing njero dada manusia, saka golongan jin lan manusia." }
};

// 2. GENERATOR MAPPING RINCI SAKA DATA API
function getSurahMappingInfo(surah) {
  const number = surah?.nomor ?? 1;
  const nameLatin = surah?.namaLatin ?? '';
  const meaning = surah?.arti ?? '';
  const placeRaw = (surah?.tempatTurun ?? '').toLowerCase().trim();
  const place = (placeRaw === 'makkah' || placeRaw === 'mekah') ? 'Makkiyah' : 'Madaniyah';
  const totalVerses = surah?.jumlahAyat ?? 0;

  if (mappingDatabase[number]) {
    return mappingDatabase[number];
  }

  if (surah?.deskripsi) {
    let cleanDesc = surah.deskripsi.replace(/<\/?[^>]+(>|$)/g, "").trim();
    return {
      theme: `Peta Tematik Surah ${nameLatin} (${meaning})`,
      desc: cleanDesc
    };
  }

  return {
    theme: `Peta Kandungan Surah ${nameLatin}`,
    desc: `Surah ${nameLatin} tergolong fase ${place} kanthi ${totalVerses} ayat. Mengandung petunjuk akidah ngenani "${meaning}", panduan hukum kehidupan, serta landasan moral bagi umat.`
  };
}

// LOGIKA PENGATURAN FONT & TERJEMAHAN
function applyDisplaySettings() {
  document.documentElement.style.setProperty('--arabic-font-family', currentArabicFont);
  document.documentElement.style.setProperty('--arabic-font-size', `${currentArabicFontSize}px`);

  if (fontSizeDisplay) {
    fontSizeDisplay.textContent = `${currentArabicFontSize}px`;
  }

  if (selectArabicFont) {
    selectArabicFont.value = currentArabicFont;
  }

  if (labelToggleTranslation) {
    labelToggleTranslation.textContent = showTranslation ? 'Sembunyikan Terjemahan' : 'Tampilkan Terjemahan';
  }

  if (quranContainer) {
    if (showTranslation) {
      quranContainer.classList.remove('hide-translation');
    } else {
      quranContainer.classList.add('hide-translation');
    }
  }
}

function initDisplaySettingsListeners() {
  if (selectArabicFont) {
    selectArabicFont.addEventListener('change', (e) => {
      currentArabicFont = e.target.value;
      localStorage.setItem('mushaf_arabic_font', currentArabicFont);
      applyDisplaySettings();
    });
  }

  if (btnFontIncrease) {
    btnFontIncrease.addEventListener('click', () => {
      if (currentArabicFontSize < 60) {
        currentArabicFontSize += 2;
        localStorage.setItem('mushaf_arabic_font_size', currentArabicFontSize);
        applyDisplaySettings();
      }
    });
  }

  if (btnFontDecrease) {
    btnFontDecrease.addEventListener('click', () => {
      if (currentArabicFontSize > 18) {
        currentArabicFontSize -= 2;
        localStorage.setItem('mushaf_arabic_font_size', currentArabicFontSize);
        applyDisplaySettings();
      }
    });
  }

  if (btnToggleTranslation) {
    btnToggleTranslation.addEventListener('click', () => {
      showTranslation = !showTranslation;
      localStorage.setItem('mushaf_show_translation', showTranslation);
      applyDisplaySettings();
    });
  }
}

// FUNGSI COUNTER PENGUNJUNG HYBRID
function updateVisitorCount() {
  if (!visitorCountElem) return;

  let localCount = parseInt(localStorage.getItem('mushaf_visitor_count') || '128', 10);
  
  const hasVisited = sessionStorage.getItem('mushaf_visited_session');
  if (!hasVisited) {
    localCount += 1;
    localStorage.setItem('mushaf_visitor_count', localCount);
    sessionStorage.setItem('mushaf_visited_session', 'true');
  }

  visitorCountElem.innerText = localCount.toLocaleString('id-ID');

  fetch('https://api.counterapi.dev/v1/fatur62_mushaf_digital/visits/up')
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (data && data.count) {
        const finalCount = Math.max(data.count, localCount);
        visitorCountElem.innerText = finalCount.toLocaleString('id-ID');
        localStorage.setItem('mushaf_visitor_count', finalCount);
      }
    })
    .catch(() => {
      console.log('CounterAPI offline, menggunakan counter lokal.');
    });
}

if (selectQori) {
  selectQori.addEventListener('change', (e) => {
    selectedQoriKey = e.target.value;
    stopCurrentAudio();
    if (currentSurahData) {
      renderSurahContent(currentSurahData);
    }
  });
}

if (btnPilihSurah) {
  btnPilihSurah.addEventListener('click', () => {
    modalSurah.classList.remove('hidden');
    if (globalSurahList.length === 0) {
      loadSurahList();
    } else {
      filterAndRenderSurah();
    }
  });
}

if (btnCloseModal) {
  btnCloseModal.addEventListener('click', () => {
    modalSurah.classList.add('hidden');
  });
}

if (btnLastRead) {
  btnLastRead.addEventListener('click', () => {
    const saved = localStorage.getItem('quran_last_read');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const surahNum = parseInt(parsed.surahNumber, 10);
        const verseNum = parseInt(parsed.verseNumber, 10);
        if (!isNaN(surahNum) && !isNaN(verseNum)) {
          loadSurahDetail(surahNum, verseNum);
        } else {
          alert('Data penanda tidak valid.');
        }
      } catch (e) {
        alert('Belum ada penanda terakhir dibaca.');
      }
    } else {
      alert('Belum ada penanda terakhir dibaca.');
    }
  });
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    tabBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.getAttribute('data-filter');
    filterAndRenderSurah();
  });
});

if (inputSearchSurah) {
  inputSearchSurah.addEventListener('input', () => {
    filterAndRenderSurah();
  });
}

async function loadSurahList() {
  if (!surahListContainer) return;
  surahListContainer.innerHTML = '<p style="text-align:center; color:#8a9e8f; padding: 20px;">Memuat 114 surah...</p>';

  try {
    const response = await fetch('https://equran.id/api/v2/surat');
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const result = await response.json();
    globalSurahList = result?.data ?? [];
    filterAndRenderSurah();
  } catch (error) {
    console.error('Gagal memuat surah list:', error);
    surahListContainer.innerHTML = `<p style="color:#ff6b6b; text-align:center; padding: 20px;">Gagal memuat daftar surah.</p>`;
  }
}

// PERBAIKAN LOGIKA FILTER MAKKIYAH (MENGAKOMODASI "MEKAH" DAN "MAKKAH")
function filterAndRenderSurah() {
  const keyword = (inputSearchSurah?.value ?? '').toLowerCase().trim();

  if (currentFilter === 'juz') {
    renderJuzGrid(keyword);
    return;
  }

  const filtered = globalSurahList.filter(surah => {
    const number = surah?.nomor ?? 0;
    const place = (surah?.tempatTurun ?? '').toLowerCase().trim();
    const latin = (surah?.namaLatin ?? '').toLowerCase().trim();
    const numStr = String(number);

    let passTab = true;
    if (currentFilter === 'makkiyah') {
      passTab = (place === 'makkah' || place === 'mekah');
    } else if (currentFilter === 'madaniyah') {
      passTab = (place === 'madinah');
    } else if (currentFilter === 'juz30') {
      passTab = (number >= 78 && number <= 114);
    }

    let passSearch = latin.includes(keyword) || numStr.includes(keyword);
    return passTab && passSearch;
  });

  renderSurahList(filtered);
}

// RENDER DAFTAR 30 JUZ
function renderJuzGrid(keyword = '') {
  if (!surahListContainer) return;

  const filteredJuz = JUZ_MAPPING.filter(item => {
    const juzStr = String(item.juz);
    const titleStr = item.title.toLowerCase();
    const nameStr = item.name.toLowerCase();
    return juzStr.includes(keyword) || titleStr.includes(keyword) || nameStr.includes(keyword);
  });

  if (filteredJuz.length === 0) {
    surahListContainer.innerHTML = '<p style="text-align:center; color:#8a9e8f; padding: 20px;">Juz tidak ditemukan.</p>';
    return;
  }

  let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; padding: 10px 0;">';

  filteredJuz.forEach(item => {
    html += `
      <div class="juz-card-item" onclick="selectJuzTarget(${item.surahId}, ${item.ayah})" style="background: rgba(22, 27, 34, 0.8); border: 1px solid var(--border-color, #30363d); border-radius: 8px; padding: 12px 14px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-weight: 700; color: var(--gold-light, #f0e6d2); font-size: 0.95rem;">Juz ${item.juz}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted, #8b949e); margin-top: 3px;">${item.title}</div>
        </div>
        <span style="font-size: 1.1rem; color: var(--gold-primary, #d4a373);">➔</span>
      </div>
    `;
  });

  html += '</div>';
  surahListContainer.innerHTML = html;
}

function selectJuzTarget(surahId, ayahNumber) {
  modalSurah.classList.add('hidden');
  loadSurahDetail(surahId, ayahNumber);
}

function renderSurahList(surahArray) {
  if (surahArray.length === 0) {
    surahListContainer.innerHTML = '<p style="text-align:center; color:#8a9e8f; padding: 20px;">Surah tidak ditemukan.</p>';
    return;
  }

  const html = surahArray.map(surah => {
    const number = surah?.nomor ?? '-';
    const nameLatin = surah?.namaLatin ?? 'Surah';
    const nameArabic = surah?.nama ?? '';
    const placeRaw = (surah?.tempatTurun ?? '').toLowerCase().trim();
    const place = (placeRaw === 'makkah' || placeRaw === 'mekah') ? 'Makkiyah' : 'Madaniyah';

    return `
      <div class="surah-item" onclick="selectSurah(${number})">
        <div class="surah-info-left">
          <span class="surah-num-badge">${number}.</span>
          <div>
            <span class="surah-name-latin">${nameLatin}</span>
            <span class="surah-type-sub">${place} - ${surah?.jumlahAyat ?? 0} Ayat</span>
          </div>
        </div>
        <div class="surah-name-arabic">${nameArabic}</div>
      </div>
    `;
  }).join('');

  surahListContainer.innerHTML = html;
}

function selectSurah(surahNumber) {
  modalSurah.classList.add('hidden');
  loadSurahDetail(surahNumber);
}

async function loadSurahDetail(surahNumber = 1, targetVerse = null) {
  if (!quranContainer) return;
  stopCurrentAudio();
  
  quranContainer.innerHTML = '<p style="text-align:center; color:#8a9e8f; padding: 40px;">Memuat ayat dan audio...</p>';

  try {
    const response = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
    if (!response.ok) throw new Error(`Gagal mengambil surah nomor ${surahNumber}`);

    const result = await response.json();
    currentSurahData = result?.data;

    if (!currentSurahData || !Array.isArray(currentSurahData.ayat)) throw new Error('Format data salah.');

    if (currentSurahTitle) {
      currentSurahTitle.innerText = currentSurahData?.namaLatin ?? 'Surah';
    }

    renderSurahContent(currentSurahData);

    if (targetVerse) {
      scrollToTargetVerse(targetVerse);
    }
  } catch (error) {
    console.error('Error loading surah detail:', error);
    quranContainer.innerHTML = `<p style="color:#ff6b6b; text-align:center; padding:20px;">Gagal memuat ayat.</p>`;
  }
}

function scrollToTargetVerse(targetVerse, attempts = 0) {
  const targetElem = document.getElementById(`verse-${targetVerse}`);
  if (targetElem) {
    targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetElem.style.borderColor = 'var(--gold-primary)';
    targetElem.style.boxShadow = '0 0 12px rgba(212, 175, 55, 0.6)';
    targetElem.style.backgroundColor = 'rgba(212, 175, 55, 0.15)';
    setTimeout(() => {
      targetElem.style.boxShadow = 'none';
      targetElem.style.backgroundColor = 'transparent';
    }, 3000);
  } else if (attempts < 15) {
    setTimeout(() => {
      scrollToTargetVerse(targetVerse, attempts + 1);
    }, 100);
  }
}

function renderSurahContent(surah) {
  const number = surah?.nomor ?? 1;
  const nameArabic = surah?.nama ?? '';
  const nameLatin = surah?.namaLatin ?? '';
  const totalVerses = surah?.jumlahAyat ?? 0;
  const placeRaw = (surah?.tempatTurun ?? '').toLowerCase().trim();
  const place = (placeRaw === 'makkah' || placeRaw === 'mekah') ? 'Makkiyah' : 'Madaniyah';
  const meaning = surah?.arti ?? '';
  const verses = surah?.ayat ?? [];

  const mappingInfo = getSurahMappingInfo(surah);

  const maxChars = 200;
  const fullDesc = mappingInfo.desc || '';
  const isLong = fullDesc.length > maxChars;
  const shortDesc = isLong ? fullDesc.substring(0, maxChars) + "..." : fullDesc;

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
        <div class="mapping-theme-desc">
          <strong>${mappingInfo.theme}:</strong> ${shortDesc}
        </div>
        ${isLong ? `
          <button id="btn-read-full-mapping" class="btn-read-more" style="background:none; border:none; color:var(--gold-light, #d4a373); font-size:0.8rem; font-weight:bold; cursor:pointer; padding:6px 0 0 0; margin-top:4px; display:inline-flex; align-items:center; gap:4px;">
            Baca Selengkapnya &#10140;
          </button>
        ` : ''}
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
    const audioUrl = v?.audio?.[selectedQoriKey] || v?.audio?.['05'] || v?.audio?.['01'] || '';

    html += `
      <div class="verse-card" id="verse-${vNum}">
        <div class="verse-left-controls">
          <div class="verse-number">${vNum}</div>
          ${audioUrl ? `<button class="btn-audio-play" onclick="toggleAudio(this, '${audioUrl}')" title="Putar/Hentikan Audio">▶</button>` : ''}
          <button class="btn-mark-verse" onclick="markLastRead(${number}, ${vNum}, '${nameLatin.replace(/'/g, "\\'")}')" title="Tandai Terakhir Dibaca">🔖</button>
        </div>
        <div class="verse-content">
          <p class="arabic-text">${v?.teksArab ?? ''}</p>
          <p class="translation-text">${v?.teksIndonesia ?? ''}</p>
        </div>
      </div>
    `;
  });

  quranContainer.innerHTML = html;

  if (isLong) {
    const btnReadMore = document.getElementById('btn-read-full-mapping');
    if (btnReadMore) {
      btnReadMore.addEventListener('click', () => {
        openMappingModal(`${mappingInfo.theme}`, fullDesc);
      });
    }
  }

  applyDisplaySettings();
}

function toggleAudio(btnElement, url) {
  if (currentAudio && currentPlayingBtn === btnElement) {
    if (!currentAudio.paused) {
      currentAudio.pause();
      btnElement.innerText = '▶';
      btnElement.style.borderColor = 'var(--border-color)';
      btnElement.style.color = 'var(--text-muted)';
      return;
    } else {
      currentAudio.play();
      btnElement.innerText = '⏸';
      btnElement.style.borderColor = 'var(--gold-primary)';
      btnElement.style.color = 'var(--gold-primary)';
      return;
    }
  }

  stopCurrentAudio();

  currentAudio = new Audio(url);
  currentPlayingBtn = btnElement;

  btnElement.innerText = '⏸';
  btnElement.style.borderColor = 'var(--gold-primary)';
  btnElement.style.color = 'var(--gold-primary)';

  currentAudio.play().catch(err => {
    console.error('Gagal memutar audio:', err);
    stopCurrentAudio();
  });

  currentAudio.onended = () => {
    stopCurrentAudio();
  };
}

function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (currentPlayingBtn) {
    currentPlayingBtn.innerText = '▶';
    currentPlayingBtn.style.borderColor = 'var(--border-color)';
    currentPlayingBtn.style.color = 'var(--text-muted)';
    currentPlayingBtn = null;
  }
}

function markLastRead(surahNumber, verseNumber, surahName) {
  const data = { 
    surahNumber: parseInt(surahNumber, 10), 
    verseNumber: parseInt(verseNumber, 10), 
    surahName 
  };
  localStorage.setItem('quran_last_read', JSON.stringify(data));
  alert(`Berhasil ditandai: Surah ${surahName} ayat ${verseNumber}`);
}

document.addEventListener('DOMContentLoaded', () => {
  initDisplaySettingsListeners();
  applyDisplaySettings();
  loadSurahDetail(1);
  updateVisitorCount();
});
