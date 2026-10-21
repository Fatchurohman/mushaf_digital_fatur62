const btnPilihSurah = document.getElementById('btn-pilih-surah');
const btnCloseModal = document.getElementById('btn-close-modal');
const modalSurah = document.getElementById('modal-surah');
const surahListContainer = document.getElementById('surah-list-container');
const quranContainer = document.getElementById('quran-container');
const currentSurahTitle = document.getElementById('current-surah-title');
const inputSearchSurah = document.getElementById('input-search-surah');
const tabBtns = document.querySelectorAll('.tab-btn:not(.muslim-tab)');
const btnLastRead = document.getElementById('btn-last-read');
const selectQori = document.getElementById('select-qori');
const visitorCountElem = document.getElementById('visitor-count');
const appHeader = document.getElementById('app-header');

// ELEMEN PENCARIAN NOMOR AYAT
const modalSearchVerse = document.getElementById('modal-search-verse');
const btnCloseSearchVerse = document.getElementById('btn-close-search-verse');
const searchVerseTitle = document.getElementById('search-verse-title');
const searchVerseDesc = document.getElementById('search-verse-desc');
const inputTargetVerse = document.getElementById('input-target-verse');
const btnSubmitSearchVerse = document.getElementById('btn-submit-search-verse');
const searchVerseError = document.getElementById('search-verse-error');

// ELEMEN MODAL FITUR MUSLIM
const btnOpenMuslimTools = document.getElementById('btn-open-muslim-tools');
const modalMuslimTools = document.getElementById('modal-muslim-tools');
const btnCloseMuslimTools = document.getElementById('btn-close-muslim-tools');
const muslimTabs = document.querySelectorAll('.muslim-tab');
const muslimPanels = document.querySelectorAll('.muslim-panel');

// ELEMEN KONTROL TAMPILAN FONT & TERJEMAHAN
const selectArabicFont = document.getElementById('select-arabic-font');
const btnFontDecrease = document.getElementById('btn-font-decrease');
const btnFontIncrease = document.getElementById('btn-font-increase');
const fontSizeDisplay = document.getElementById('font-size-display');
const btnToggleTranslation = document.getElementById('btn-toggle-translation');
const labelToggleTranslation = document.getElementById('label-toggle-translation');

// ELEMEN MODAL DESKRIPSI MAPPING
const modalMapping = document.getElementById('modal-deskripsi-mapping');
const btnCloseMapping = document.getElementById('btn-close-modal-mapping');
const modalMappingTitle = document.getElementById('modal-mapping-title');
const modalMappingContent = document.getElementById('modal-mapping-content');

// ELEMEN CATATAN DIGITAL
const btnOpenNotes = document.getElementById('btn-open-notes');
const modalNotes = document.getElementById('modal-notes');
const btnCloseNotes = document.getElementById('btn-close-notes');
const notesTextarea = document.getElementById('notes-textarea');
const notesCanvas = document.getElementById('notes-canvas');
const toolType = document.getElementById('tool-type');
const toolPen = document.getElementById('tool-pen');
const toolEraser = document.getElementById('tool-eraser');
const noteColorInput = document.getElementById('note-color');
const toolClear = document.getElementById('tool-clear');
const toolPrint = document.getElementById('tool-print');

// ELEMEN CUSTOM MODAL ALERT BOOKMARK
const modalAlertBookmark = document.getElementById('modal-alert-bookmark');
const modalAlertTitle = document.getElementById('modal-alert-title');
const modalAlertMessage = document.getElementById('modal-alert-message');
const btnAlertOk = document.getElementById('btn-alert-ok');

let globalSurahList = [];
let currentFilter = 'all';
let currentSurahData = null;
let selectedQoriKey = '05';

// STATE PENGATURAN TAMPILAN
let currentArabicFont = localStorage.getItem('mushaf_arabic_font') || "'Scheherazade New', serif";
let currentArabicFontSize = parseInt(localStorage.getItem('mushaf_arabic_font_size') || '28', 10);
let showTranslation = localStorage.getItem('mushaf_show_translation') !== 'false';

let currentAudio = null;
let currentPlayingBtn = null;

// STATE KANVAS CATATAN DIGITAL
let canvasCtx = null;
let isDrawing = false;
let currentTool = 'type';
let penColor = '#000000';
let penSize = 2.5;

// DATABASE JUZ 1 - 30
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

function getJuzNumber(surahId, ayahNum) {
  let matchedJuz = 1;
  for (let i = JUZ_MAPPING.length - 1; i >= 0; i--) {
    const item = JUZ_MAPPING[i];
    if (surahId > item.surahId || (surahId === item.surahId && ayahNum >= item.ayah)) {
      matchedJuz = item.juz;
      break;
    }
  }
  return matchedJuz;
}

// AUTO-HIDE HEADER SAAT BACA
let lastScrollY = window.scrollY;
const scrollTolerance = 8;

window.addEventListener('scroll', () => {
  if (!appHeader) return;
  const currentScrollY = window.scrollY;

  if (currentScrollY <= 80) {
    appHeader.classList.remove('header-hidden');
    lastScrollY = currentScrollY;
    return;
  }

  if (currentScrollY > lastScrollY + scrollTolerance) {
    appHeader.classList.add('header-hidden');
  } else if (currentScrollY < lastScrollY - scrollTolerance) {
    appHeader.classList.remove('header-hidden');
  }

  lastScrollY = currentScrollY;
}, { passive: true });

// PENCARIAN NOMOR AYAT SAAT NAMA SURAH DIKLIK
function initSearchVerseModal() {
  if (!currentSurahTitle) return;

  currentSurahTitle.addEventListener('click', () => {
    if (!currentSurahData) return;
    const sName = currentSurahData?.namaLatin || 'Surah';
    const totalAyah = currentSurahData?.jumlahAyat || 1;

    if (searchVerseTitle) searchVerseTitle.textContent = `Lompat ke Ayat: ${sName}`;
    if (searchVerseDesc) searchVerseDesc.textContent = `Masukkan nomor ayat (1 - ${totalAyah}):`;
    if (inputTargetVerse) {
      inputTargetVerse.value = '';
      inputTargetVerse.max = totalAyah;
    }
    if (searchVerseError) searchVerseError.style.display = 'none';

    modalSearchVerse.classList.remove('hidden');
    setTimeout(() => {
      if (inputTargetVerse) inputTargetVerse.focus();
    }, 100);
  });

  if (btnCloseSearchVerse) {
    btnCloseSearchVerse.addEventListener('click', () => {
      modalSearchVerse.classList.add('hidden');
    });
  }

  if (modalSearchVerse) {
    modalSearchVerse.addEventListener('click', (e) => {
      if (e.target === modalSearchVerse) {
        modalSearchVerse.classList.add('hidden');
      }
    });
  }

  function executeSearchVerse() {
    if (!currentSurahData || !inputTargetVerse) return;
    const target = parseInt(inputTargetVerse.value, 10);
    const maxAyah = currentSurahData?.jumlahAyat || 1;

    if (isNaN(target) || target < 1 || target > maxAyah) {
      if (searchVerseError) {
        searchVerseError.textContent = `Nomor ayat harus antara 1 sampai ${maxAyah}.`;
        searchVerseError.style.display = 'block';
      }
      return;
    }

    modalSearchVerse.classList.add('hidden');
    setTimeout(() => {
      scrollToTargetVerse(target);
    }, 150);
  }

  if (btnSubmitSearchVerse) {
    btnSubmitSearchVerse.addEventListener('click', executeSearchVerse);
  }

  if (inputTargetVerse) {
    inputTargetVerse.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeSearchVerse();
    });
  }
}

// LOGIKA FITUR-FITUR MUSLIM (JADWAL, KIBLAT, DOA, KALENDER)
let userLatitude = -7.7693; // Default Sleman & Yogyakarta
let userLongitude = 110.3777;
let qiblaBearing = 295;
let compassActive = false;
let currentMaghribTimeStr = '17:45';

const HIJRI_MONTH_NAMES_ID = [
  "Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir",
  "Jumadil Awwal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawwal", "Dzulqa'dah", "Dzulhijjah"
];

const DOA_DATABASE = {
  wirid: [
    {
      title: "Istighfar Selepas Salam",
      arabic: "أَسْتَغْفِرُ اللَّهَ (3x) ، اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ",
      trans: "Aku memohon ampun kepada Allah (3x). Ya Allah, Engkau Mahasejahtera dan dari-Mu kesejahteraan, Mahasuci Engkau wahai Tuhan pemilik keagungan dan kemuliaan."
    },
    {
      title: "Tahlil & Pengagungan",
      arabic: "لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرٌ",
      trans: "Tiada Ilah yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan pujian, dan Dia Mahakuasa atas segala sesuatu."
    },
    {
      title: "Ayat Kursi (Benteng Perlindungan)",
      arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ...",
      trans: "Membaca Ayat Kursi setiap selesai salat fardhu dijanjikan tidak ada yang menghalanginya masuk surga melainkan kematian."
    },
    {
      title: "Tasbih, Tahmid, Takbir (33x)",
      arabic: "سُبْحَانَ اللهِ (33x) ، اَلْحَمْدُ لِلَّهِ (33x) ، اَللهُ أَكْبَرُ (33x)",
      trans: "Maha Suci Allah (33x), Segala puji bagi Allah (33x), Allah Maha Besar (33x)."
    }
  ],
  harian: [
    {
      title: "Doa Kedua Orang Tua",
      arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
      trans: "Wahai Tuhanku, ampunilah aku dan kedua orang tuaku, serta sayangilah mereka berdua sebagaimana mereka telah mendidikku di waktu kecil."
    },
    {
      title: "Doa Kebaikan Dunia & Akhirat",
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      trans: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa api neraka."
    },
    {
      title: "Doa Keteguhan Iman & Hati",
      arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
      trans: "Wahai Dzat yang membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu."
    }
  ]
};

function initMuslimTools() {
  if (btnOpenMuslimTools) {
    btnOpenMuslimTools.addEventListener('click', () => {
      modalMuslimTools.classList.remove('hidden');
      loadPrayerTimes();
      renderDoaList('wirid');
    });
  }

  if (btnCloseMuslimTools) {
    btnCloseMuslimTools.addEventListener('click', () => {
      modalMuslimTools.classList.add('hidden');
    });
  }

  if (modalMuslimTools) {
    modalMuslimTools.addEventListener('click', (e) => {
      if (e.target === modalMuslimTools) modalMuslimTools.classList.add('hidden');
    });
  }

  muslimTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      muslimTabs.forEach(b => b.classList.remove('active'));
      muslimPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      const panel = document.getElementById(`panel-${targetTab}`);
      if (panel) panel.classList.add('active');

      if (targetTab === 'kiblat') {
        startQiblaCompass();
      }
    });
  });

  const btnRefreshLoc = document.getElementById('btn-refresh-location');
  if (btnRefreshLoc) {
    btnRefreshLoc.addEventListener('click', () => {
      fetchUserGeolocation();
    });
  }

  const doaBtns = document.querySelectorAll('.doa-filter-btn');
  doaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      doaBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDoaList(btn.getAttribute('data-category'));
    });
  });
}

// 1. Logika Waktu Salat
async function loadPrayerTimes() {
  const cityLabel = document.getElementById('prayer-city-label');
  const dateLabel = document.getElementById('prayer-date-label');
  
  if (cityLabel) cityLabel.textContent = "Mengambil Jadwal Salat...";

  try {
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${userLatitude}&longitude=${userLongitude}&method=11`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error("Gagal mengambil API jadwal");
    const json = await res.json();
    const timings = json?.data?.timings;

    if (timings) {
      document.getElementById('time-imsak').textContent = timings.Imsak || '--:--';
      document.getElementById('time-subuh').textContent = timings.Fajr || '--:--';
      document.getElementById('time-sunrise').textContent = timings.Sunrise || '--:--';
      document.getElementById('time-dzuhur').textContent = timings.Dhuhr || '--:--';
      document.getElementById('time-ashar').textContent = timings.Asr || '--:--';
      document.getElementById('time-maghrib').textContent = timings.Maghrib || '--:--';
      document.getElementById('time-isya').textContent = timings.Isha || '--:--';

      currentMaghribTimeStr = timings.Maghrib || '17:45';

      if (cityLabel) cityLabel.textContent = `Koordinat: ${userLatitude.toFixed(2)}°, ${userLongitude.toFixed(2)}°`;
      if (dateLabel) {
        const gregorian = json?.data?.date?.readable || today.toLocaleDateString('id-ID');
        dateLabel.textContent = `${gregorian}`;
      }

      calculateQiblaBearing(userLatitude, userLongitude);
      loadHijriCalendar(json?.data);
    }
  } catch (err) {
    if (cityLabel) cityLabel.textContent = "Jadwal Salat (Default Waktu Indonesia)";
    loadHijriCalendar(null);
  }
}

function fetchUserGeolocation() {
  const cityLabel = document.getElementById('prayer-city-label');
  if (navigator.geolocation) {
    if (cityLabel) cityLabel.textContent = "Mencari koordinat GPS...";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLatitude = pos.coords.latitude;
        userLongitude = pos.coords.longitude;
        loadPrayerTimes();
      },
      (err) => {
        if (cityLabel) cityLabel.textContent = "GPS tidak aktif / default";
        loadPrayerTimes();
      },
      { timeout: 7000 }
    );
  } else {
    loadPrayerTimes();
  }
}

// 2. Logika Arah Kiblat
function calculateQiblaBearing(lat, lng) {
  const kaabaLat = 21.422487 * (Math.PI / 180);
  const kaabaLng = 39.826206 * (Math.PI / 180);
  const myLat = lat * (Math.PI / 180);
  const myLng = lng * (Math.PI / 180);

  const dLng = kaabaLng - myLng;
  const y = Math.sin(dLng);
  const x = Math.cos(myLat) * Math.tan(kaabaLat) - Math.sin(myLat) * Math.cos(dLng);
  let qibla = Math.atan2(y, x) * (180 / Math.PI);
  qibla = (qibla + 360) % 360;

  qiblaBearing = Math.round(qibla);
  const angleText = document.getElementById('qibla-angle-text');
  if (angleText) angleText.textContent = `Sudut Kiblat: ${qiblaBearing}° dari Utara`;

  const pointer = document.getElementById('kaaba-pointer');
  if (pointer) {
    pointer.style.transform = `translateX(-50%) rotate(${qiblaBearing}deg)`;
  }
}

function startQiblaCompass() {
  const statusText = document.getElementById('compass-status-text');
  const btnReq = document.getElementById('btn-request-compass');
  const dial = document.getElementById('compass-dial');

  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    if (btnReq) {
      btnReq.style.display = 'inline-block';
      btnReq.onclick = () => {
        DeviceOrientationEvent.requestPermission().then(state => {
          if (state === 'granted') {
            btnReq.style.display = 'none';
            bindCompassListener();
          } else {
            if (statusText) statusText.textContent = "Izin sensor kompas ditolak.";
          }
        });
      };
    }
  } else if ('ondeviceorientationabsolute' in window || 'ondeviceorientation' in window) {
    bindCompassListener();
  } else {
    if (statusText) statusText.textContent = "Sensor kompas tidak didukung di perangkat ini.";
  }

  function bindCompassListener() {
    if (compassActive) return;
    compassActive = true;
    if (statusText) statusText.textContent = "Kompas aktif. Sejajarkan ikon Ka'bah ke arah atas.";

    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
  }

  function handleOrientation(e) {
    let compassHeading = null;
    if (e.webkitCompassHeading) {
      compassHeading = e.webkitCompassHeading;
    } else if (e.alpha !== null) {
      compassHeading = 360 - e.alpha;
    }

    if (compassHeading !== null && dial) {
      dial.style.transform = `rotate(${-compassHeading}deg)`;
      const pointer = document.getElementById('kaaba-pointer');
      if (pointer) {
        pointer.style.transform = `translateX(-50%) rotate(${qiblaBearing}deg)`;
      }
    }
  }
}

// 3. Logika Render Doa & Wirid
function renderDoaList(category) {
  const container = document.getElementById('doa-list-container');
  if (!container) return;
  const list = DOA_DATABASE[category] || [];

  container.innerHTML = list.map(item => `
    <div class="doa-card">
      <div class="doa-title">${item.title}</div>
      <div class="doa-arabic">${item.arabic}</div>
      <div class="doa-trans">${item.trans}</div>
    </div>
  `).join('');
}

// 4. Logika Kalender Hijriah & Otomatis Berganti Selepas Maghrib
function checkIsAfterMaghrib() {
  const now = new Date();
  const [maghribHour, maghribMinute] = currentMaghribTimeStr.split(':').map(n => parseInt(n, 10));
  if (isNaN(maghribHour) || isNaN(maghribMinute)) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const maghribMinutes = maghribHour * 60 + maghribMinute;
  return currentMinutes >= maghribMinutes;
}

function loadHijriCalendar(apiData = null) {
  const hijriDisplay = document.getElementById('hijri-current-display');
  const masehiDisplay = document.getElementById('masehi-current-display');
  const fastingList = document.getElementById('fasting-reminders-list');

  const now = new Date();
  const isAfterMaghrib = checkIsAfterMaghrib();

  let hDay = null;
  let hMonthName = '';
  let hYear = null;

  if (apiData?.date?.hijri) {
    const rawHijri = apiData.date.hijri;
    hDay = parseInt(rawHijri.day, 10);
    const monthNum = parseInt(rawHijri.month?.number, 10);
    hMonthName = HIJRI_MONTH_NAMES_ID[monthNum - 1] || rawHijri.month?.en || "Hijriah";
    hYear = parseInt(rawHijri.year, 10);

    // Pergantian hari saat waktu Maghrib telah tiba
    if (isAfterMaghrib) {
      hDay += 1;
      if (hDay > 30) {
        hDay = 1;
        const nextMonthIndex = monthNum % 12;
        hMonthName = HIJRI_MONTH_NAMES_ID[nextMonthIndex];
        if (nextMonthIndex === 0) hYear += 1;
      }
    }
  } else {
    // Fallback hisab akurat Ummul Qura
    const targetDate = new Date();
    if (isAfterMaghrib) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    try {
      const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      }).formatToParts(targetDate);

      let mNum = 1;
      parts.forEach(p => {
        if (p.type === 'day') hDay = parseInt(p.value, 10);
        if (p.type === 'month') mNum = parseInt(p.value, 10);
        if (p.type === 'year') hYear = parseInt(p.value, 10);
      });
      hMonthName = HIJRI_MONTH_NAMES_ID[mNum - 1] || "Hijriah";
    } catch (e) {
      hDay = 11;
      hMonthName = "Jumadil Awwal";
      hYear = 1448;
    }
  }

  if (hijriDisplay) {
    hijriDisplay.textContent = `${hDay} ${hMonthName} ${hYear} H`;
  }

  if (masehiDisplay) {
    const masehiStr = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const maghribInfo = isAfterMaghrib ? " • Masuk Malam (Ba'da Maghrib)" : "";
    masehiDisplay.textContent = `${masehiStr}${maghribInfo}`;
  }

  // Hitung jadwal puasa sunnah terdekat
  if (fastingList) {
    const fastingItems = [];

    for (let i = 0; i < 7; i++) {
      const checkDate = new Date();
      checkDate.setDate(now.getDate() + i);
      const dayNum = checkDate.getDay(); // 1 = Senin, 4 = Kamis
      const dateName = checkDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });

      if (dayNum === 1) {
        fastingItems.push({ 
          name: "Puasa Sunnah Senin", 
          date: dateName, 
          badge: (i === 0 && !isAfterMaghrib) ? "Hari Ini" : "Akan Datang" 
        });
      } else if (dayNum === 4) {
        fastingItems.push({ 
          name: "Puasa Sunnah Kamis", 
          date: dateName, 
          badge: (i === 0 && !isAfterMaghrib) ? "Hari Ini" : "Akan Datang" 
        });
      }
    }

    fastingItems.push({
      name: "Puasa Ayyamul Bidh",
      date: "Tiap tanggal 13, 14, 15 Hijriah",
      badge: "Bulanan"
    });

    fastingList.innerHTML = fastingItems.map(f => `
      <div class="fasting-item">
        <div>
          <div class="fasting-title">${f.name}</div>
          <div class="fasting-date">${f.date}</div>
        </div>
        <span class="fasting-badge">${f.badge}</span>
      </div>
    `).join('');
  }
}

// CUSTOM ALERT MODAL
function showCustomAlert(message, title = 'FATUR MUSHAF DIGITAL') {
  if (!modalAlertBookmark || !modalAlertMessage) return;
  if (modalAlertTitle) modalAlertTitle.textContent = title;
  modalAlertMessage.textContent = message;
  modalAlertBookmark.classList.remove('hidden');
}

if (btnAlertOk && modalAlertBookmark) {
  btnAlertOk.addEventListener('click', () => {
    modalAlertBookmark.classList.add('hidden');
  });

  modalAlertBookmark.addEventListener('click', (e) => {
    if (e.target === modalAlertBookmark) modalAlertBookmark.classList.add('hidden');
  });
}

// KANVAS CATATAN DIGITAL
function initDigitalNotes() {
  if (!modalNotes || !notesCanvas) return;
  canvasCtx = notesCanvas.getContext('2d');

  function resizeCanvas() {
    const paper = document.querySelector('.notes-paper');
    if (!paper) return;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = notesCanvas.width;
    tempCanvas.height = notesCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(notesCanvas, 0, 0);

    notesCanvas.width = paper.clientWidth;
    notesCanvas.height = paper.clientHeight;
    canvasCtx.drawImage(tempCanvas, 0, 0);
  }

  if (btnOpenNotes) {
    btnOpenNotes.addEventListener('click', () => {
      modalNotes.classList.remove('hidden');
      setTimeout(() => {
        resizeCanvas();
        loadSavedNotes();
      }, 50);
    });
  }

  if (btnCloseNotes) {
    btnCloseNotes.addEventListener('click', () => {
      modalNotes.classList.add('hidden');
    });
  }

  function setActiveTool(tool) {
    currentTool = tool;
    toolType.classList.toggle('active', tool === 'type');
    toolPen.classList.toggle('active', tool === 'pen');
    toolEraser.classList.toggle('active', tool === 'eraser');
    notesCanvas.style.pointerEvents = (tool === 'type') ? 'none' : 'auto';
  }

  if (toolType) toolType.addEventListener('click', () => setActiveTool('type'));
  if (toolPen) toolPen.addEventListener('click', () => setActiveTool('pen'));
  if (toolEraser) toolEraser.addEventListener('click', () => setActiveTool('eraser'));

  if (noteColorInput) {
    noteColorInput.addEventListener('input', (e) => {
      penColor = e.target.value;
      if (currentTool === 'eraser') setActiveTool('pen');
    });
  }

  if (toolClear) {
    toolClear.addEventListener('click', () => {
      if (confirm('Bersihkan seluruh tulisan tangan dan ketikan?')) {
        canvasCtx.clearRect(0, 0, notesCanvas.width, notesCanvas.height);
        if (notesTextarea) notesTextarea.value = '';
        saveNotesData();
      }
    });
  }

  if (toolPrint) {
    toolPrint.addEventListener('click', () => {
      window.print();
    });
  }

  function getPos(e) {
    const rect = notesCanvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  notesCanvas.addEventListener('pointerdown', (e) => {
    if (currentTool === 'type') return;
    isDrawing = true;
    const pos = getPos(e);
    canvasCtx.beginPath();
    canvasCtx.moveTo(pos.x, pos.y);

    if (currentTool === 'eraser') {
      canvasCtx.globalCompositeOperation = 'destination-out';
      canvasCtx.lineWidth = 18;
    } else {
      canvasCtx.globalCompositeOperation = 'source-over';
      canvasCtx.strokeStyle = penColor;
      canvasCtx.lineWidth = penSize;
      canvasCtx.lineCap = 'round';
      canvasCtx.lineJoin = 'round';
    }
  });

  notesCanvas.addEventListener('pointermove', (e) => {
    if (!isDrawing || currentTool === 'type') return;
    const pos = getPos(e);
    canvasCtx.lineTo(pos.x, pos.y);
    canvasCtx.stroke();
  });

  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      canvasCtx.closePath();
      saveNotesData();
    }
  }

  notesCanvas.addEventListener('pointerup', stopDrawing);
  notesCanvas.addEventListener('pointerleave', stopDrawing);

  if (notesTextarea) {
    notesTextarea.addEventListener('input', () => saveNotesData());
  }

  function saveNotesData() {
    if (notesTextarea) localStorage.setItem('mushaf_notes_text', notesTextarea.value);
    if (notesCanvas) localStorage.setItem('mushaf_notes_canvas', notesCanvas.toDataURL());
  }

  function loadSavedNotes() {
    const savedText = localStorage.getItem('mushaf_notes_text');
    if (savedText && notesTextarea) notesTextarea.value = savedText;

    const savedCanvas = localStorage.getItem('mushaf_notes_canvas');
    if (savedCanvas && canvasCtx) {
      const img = new Image();
      img.onload = () => {
        canvasCtx.clearRect(0, 0, notesCanvas.width, notesCanvas.height);
        canvasCtx.drawImage(img, 0, 0);
      };
      img.src = savedCanvas;
    }
  }
}

// MODAL DESKRIPSI MAPPING
if (btnCloseMapping && modalMapping) {
  btnCloseMapping.addEventListener('click', () => modalMapping.classList.add('hidden'));
  modalMapping.addEventListener('click', (e) => {
    if (e.target === modalMapping) modalMapping.classList.add('hidden');
  });
}

function openMappingModal(title, fullText) {
  if (!modalMapping || !modalMappingContent) return;
  if (modalMappingTitle) modalMappingTitle.textContent = title || "Peta Kandungan (Mapping Tematik)";
  modalMappingContent.textContent = fullText || "Deskripsi tidak tersedia.";
  modalMapping.classList.remove('hidden');
}

// DATABASE MAPPING TEMATIK
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

function getSurahMappingInfo(surah) {
  const number = surah?.nomor ?? 1;
  const nameLatin = surah?.namaLatin ?? '';
  const meaning = surah?.arti ?? '';
  const placeRaw = (surah?.tempatTurun ?? '').toLowerCase().trim();
  const place = (placeRaw === 'makkah' || placeRaw === 'mekah') ? 'Makkiyah' : 'Madaniyah';
  const totalVerses = surah?.jumlahAyat ?? 0;

  if (mappingDatabase[number]) return mappingDatabase[number];

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

// LOGIKA TAMPILAN FONT & TERJEMAHAN
function applyDisplaySettings() {
  document.documentElement.style.setProperty('--arabic-font-family', currentArabicFont);
  document.documentElement.style.setProperty('--arabic-font-size', `${currentArabicFontSize}px`);

  if (fontSizeDisplay) fontSizeDisplay.textContent = `${currentArabicFontSize}px`;
  if (selectArabicFont) selectArabicFont.value = currentArabicFont;
  if (labelToggleTranslation) labelToggleTranslation.textContent = showTranslation ? 'Sembunyikan Terjemahan' : 'Tampilkan Terjemahan';

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

// COUNTER PENGUNJUNG
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
    .catch(() => {});
}

if (selectQori) {
  selectQori.addEventListener('change', (e) => {
    selectedQoriKey = e.target.value;
    stopCurrentAudio();
    if (currentSurahData) renderSurahContent(currentSurahData);
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
  btnCloseModal.addEventListener('click', () => modalSurah.classList.add('hidden'));
}

if (btnLastRead) {
  btnLastRead.addEventListener('click', () => {
    const saved = localStorage.getItem('quran_last_read');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const surahNum = parseInt(parsed?.surahNumber, 10);
        const verseNum = parseInt(parsed?.verseNumber, 10);
        const surahName = parsed?.surahName || 'Surah';
        const juzNum = parsed?.juzNumber || (parsed?.surahNumber && parsed?.verseNumber ? getJuzNumber(surahNum, verseNum) : null);

        if (!isNaN(surahNum) && !isNaN(verseNum)) {
          const textJuz = juzNum ? ` (Masuk Juz ${juzNum})` : '';
          showCustomAlert(`Melanjutkan bacaan terakhir: Surah ${surahName} Ayat ${verseNum}${textJuz}.`);
          loadSurahDetail(surahNum, verseNum);
        } else {
          showCustomAlert('Data penanda baca tidak valid. Silakan tandai ulang ayat.');
        }
      } catch (e) {
        showCustomAlert('Belum ada penanda terakhir dibaca.');
      }
    } else {
      showCustomAlert('Belum ada penanda terakhir dibaca.');
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
  inputSearchSurah.addEventListener('input', () => filterAndRenderSurah());
}

async function loadSurahList() {
  if (!surahListContainer) return;
  surahListContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 20px;">Memuat 114 surah...</p>';

  try {
    const response = await fetch('https://equran.id/api/v2/surat');
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const result = await response.json();
    globalSurahList = result?.data ?? [];
    filterAndRenderSurah();
  } catch (error) {
    surahListContainer.innerHTML = `<p style="color:#ff6b6b; text-align:center; padding: 20px;">Gagal memuat daftar surah.</p>`;
  }
}

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

function renderJuzGrid(keyword = '') {
  if (!surahListContainer) return;
  const filteredJuz = JUZ_MAPPING.filter(item => {
    const juzStr = String(item.juz);
    const titleStr = item.title.toLowerCase();
    const nameStr = item.name.toLowerCase();
    return juzStr.includes(keyword) || titleStr.includes(keyword) || nameStr.includes(keyword);
  });

  if (filteredJuz.length === 0) {
    surahListContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 20px;">Juz tidak ditemukan.</p>';
    return;
  }

  let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; padding: 10px 0;">';
  filteredJuz.forEach(item => {
    html += `
      <div class="juz-card-item" onclick="selectJuzTarget(${item.surahId}, ${item.ayah})" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 14px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-weight: 700; color: var(--gold-light); font-size: 0.95rem;">Juz ${item.juz}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 3px;">${item.title}</div>
        </div>
        <span style="font-size: 1.1rem; color: var(--gold-primary);">➔</span>
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
    surahListContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 20px;">Surah tidak ditemukan.</p>';
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
  quranContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding: 40px;">Memuat ayat dan audio...</p>';

  try {
    const response = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
    if (!response.ok) throw new Error(`Gagal mengambil surah nomor ${surahNumber}`);
    const result = await response.json();
    currentSurahData = result?.data;

    if (!currentSurahData || !Array.isArray(currentSurahData.ayat)) throw new Error('Format data salah.');

    if (currentSurahTitle) {
      currentSurahTitle.innerHTML = `${currentSurahData?.namaLatin ?? 'Surah'} 🔍`;
    }

    renderSurahContent(currentSurahData);

    if (targetVerse) scrollToTargetVerse(targetVerse);
  } catch (error) {
    quranContainer.innerHTML = `<p style="color:#ff6b6b; text-align:center; padding:20px;">Gagal memuat ayat.</p>`;
  }
}

function scrollToTargetVerse(targetVerse, attempts = 0) {
  const targetElem = document.getElementById(`verse-${targetVerse}`);
  if (targetElem) {
    targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetElem.style.borderColor = 'var(--gold-primary)';
    targetElem.style.boxShadow = '0 0 16px rgba(255, 215, 0, 0.6)';
    targetElem.style.backgroundColor = 'rgba(212, 175, 55, 0.18)';
    setTimeout(() => {
      targetElem.style.boxShadow = 'none';
      targetElem.style.backgroundColor = 'var(--bg-card)';
      targetElem.style.borderColor = 'var(--border-color)';
    }, 3000);
  } else if (attempts < 15) {
    setTimeout(() => scrollToTargetVerse(targetVerse, attempts + 1), 100);
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
      <h2 class="arabic-title surah-clickable" onclick="document.getElementById('current-surah-title').click()" title="Klik untuk cari nomor ayat">${nameArabic}</h2>
      <p class="surah-meta surah-clickable" onclick="document.getElementById('current-surah-title').click()" title="Klik untuk cari nomor ayat">${nameLatin} (${meaning}) 🔍</p>

      <div class="mapping-theme-box">
        <div class="mapping-theme-title">Peta Kandungan (Mapping Tematik)</div>
        <div class="mapping-theme-desc">
          <strong>${mappingInfo.theme}:</strong> ${shortDesc}
        </div>
        ${isLong ? `
          <button id="btn-read-full-mapping" class="btn-read-more" style="background:none; border:none; color:var(--gold-light); font-size:0.8rem; font-weight:bold; cursor:pointer; padding:6px 0 0 0; margin-top:4px; display:inline-flex; align-items:center; gap:4px;">
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
      btnReadMore.addEventListener('click', () => openMappingModal(`${mappingInfo.theme}`, fullDesc));
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
    console.error('Gagal putar audio:', err);
    stopCurrentAudio();
  });

  currentAudio.onended = () => stopCurrentAudio();
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

// DOA SYAFAAT BOOKMARK
function markLastRead(surahNumber, verseNumber, surahName) {
  try {
    const sNum = parseInt(surahNumber, 10) || 1;
    const vNum = parseInt(verseNumber, 10) || 1;
    const validSurahName = String(surahName || 'Surah');
    const juzNum = getJuzNumber(sNum, vNum);

    const data = { 
      surahNumber: sNum, 
      verseNumber: vNum, 
      surahName: validSurahName,
      juzNumber: juzNum
    };

    localStorage.setItem('quran_last_read', JSON.stringify(data));
    const pesan = `Berhasil ditandai: Surah ${validSurahName} Ayat ${vNum} (Masuk Juz ${juzNum}).\n\n"Semoga Al-Qur'an ini menjadi pembela dan syafaat bagimu di yaumil akhir."`;
    showCustomAlert(pesan);
  } catch (error) {
    showCustomAlert('Gagal menyimpan penanda baca ke perangkat.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initDisplaySettingsListeners();
  initSearchVerseModal();
  initMuslimTools();
  applyDisplaySettings();
  loadSurahDetail(1);
  updateVisitorCount();
  initDigitalNotes();
});
