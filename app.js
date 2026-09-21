const btnPilihSurah = document.getElementById('btn-pilih-surah');
const btnCloseModal = document.getElementById('btn-close-modal');
const modalSurah = document.getElementById('modal-surah');
const surahListContainer = document.getElementById('surah-list-container');
const quranContainer = document.getElementById('quran-container');
const currentSurahTitle = document.getElementById('current-surah-title');
const inputSearchSurah = document.getElementById('input-search-surah');
const tabBtns = document.querySelectorAll('.tab-btn');
const btnLastRead = document.getElementById('btn-last-read');

let globalSurahList = [];
let currentFilter = 'all';
let currentAudio = null;

// Database Mapping Tematik
const mappingDatabase = {
  1: { theme: "Ummul Kitab & Induk Al-Qur'an", desc: "Prinsip dasar akidah, ibadah, permohonan hidayah, lan peta jalan kehidupan manungsa." },
  2: { theme: "Fondasi Hukum & Kurikulum Kehidupan", desc: "Panduan pembentukan umat, hukum muamalah, lan pembeda antara kebenaran vs kebatilan." },
  18: { theme: "Penyelamatan Fitnah Akhir Zaman", desc: "4 Benteng perlindungan fitnah: Agama, Harta, Ilmu, & Kekuasaan." },
  36: { theme: "Jantung Al-Qur'an & Tauhid Rububiyah", desc: "Penegasan risalah kenabian, bukti kebangkitan sawise mati, lan peringatan alam semesta." },
  67: { theme: "Kerajaan Allah & Benteng Siksa Kubur", desc: "Tafakur atas kesempurnaan ciptaan langit/bumi lan pentingnya amal terbaik." },
  112: { theme: "Murni Akidah & Pembersihan Tauhid", desc: "Penegasan sifat Esa Allah, tempat bergantung segala sesuatu." }
};

// Event Listener Modal
if (btnPilihSurah) {
  btnPilihSurah.addEventListener('click', () => {
    modalSurah.classList.remove('hidden');
    if (globalSurahList.length === 0) {
      loadSurahList();
    }
  });
}

if (btnCloseModal) {
  btnCloseModal.addEventListener('click', () => {
    modalSurah.classList.add('hidden');
  });
}

// Fitur Bookmark Terakhir Dibaca
if (btnLastRead) {
  btnLastRead.addEventListener('click', () => {
    const saved = localStorage.getItem('quran_last_read');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        loadSurahDetail(parsed.surahNumber, parsed.verseNumber);
      } catch (e) {
        alert('Belum ada penanda terakhir dibaca.');
      }
    } else {
      alert('Belum ada penanda terakhir dibaca.');
    }
  });
}

// Tab Filter
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
  surahListContainer.innerHTML = '<p style="text-align:center; color:#8a9e8f; padding: 20px;">Memuat mapping 114 surah...</p>';

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

function filterAndRenderSurah() {
  const keyword = (inputSearchSurah?.value ?? '').toLowerCase().trim();

  const filtered = globalSurahList.filter(surah => {
    const number = surah?.nomor ?? 0;
    const place = (surah?.tempatTurun ?? '').toLowerCase();
    const latin = (surah?.namaLatin ?? '').toLowerCase();
    const numStr = String(number);

    let passTab = true;
    if (currentFilter === 'makkiyah') passTab = place === 'makkah';
    else if (currentFilter === 'madaniyah') passTab = place === 'madinah';
    else if (currentFilter === 'juz30') passTab = number >= 78 && number <= 114;

    let passSearch = latin.includes(keyword) || numStr.includes(keyword);

    return passTab && passSearch;
  });

  renderSurahList(filtered);
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
    const place = surah?.tempatTurun === 'makkah' ? 'Makkiyah' : 'Madaniyah';

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
  quranContainer.innerHTML = '<p style="text-align:center; color:#8a9e8f; padding: 40px;">Memuat ayat dan audio...</p>';

  try {
    const response = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
    if (!response.ok) throw new Error(`Gagal mengambil surah nomor ${surahNumber}`);

    const result = await response.json();
    const surahData = result?.data;

    if (!surahData || !Array.isArray(surahData.ayat)) throw new Error('Format data salah.');

    if (currentSurahTitle) {
      currentSurahTitle.innerText = surahData?.namaLatin ?? 'Surah';
    }

    renderSurahContent(surahData);

    // Scroll otomatis jika membuka dari penanda terakhir dibaca
    if (targetVerse) {
      setTimeout(() => {
        const targetElem = document.getElementById(`verse-${targetVerse}`);
        if (targetElem) {
          targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetElem.style.borderColor = 'var(--gold-primary)';
        }
      }, 300);
    }
  } catch (error) {
    console.error('Error loading surah detail:', error);
    quranContainer.innerHTML = `<p style="color:#ff6b6b; text-align:center; padding:20px;">Gagal memuat ayat.</p>`;
  }
}

function renderSurahContent(surah) {
  const number = surah?.nomor ?? 1;
  const nameArabic = surah?.nama ?? '';
  const nameLatin = surah?.namaLatin ?? '';
  const totalVerses = surah?.jumlahAyat ?? 0;
  const place = surah?.tempatTurun === 'makkah' ? 'Makkiyah' : 'Madaniyah';
  const meaning = surah?.arti ?? '';
  const verses = surah?.ayat ?? [];

  const mappingInfo = mappingDatabase[number] || {
    theme: `Pokok Tematik Surah ${nameLatin}`,
    desc: `Surah iki kalebu ${place} kanthi ${totalVerses} ayat sing ngemot piwulang urip lan akidah.`
  };

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
    const audioUrl = v?.audio?.['01'] ?? '';

    html += `
      <div class="verse-card" id="verse-${vNum}">
        <div class="verse-left-controls">
          <div class="verse-number">${vNum}</div>
          ${audioUrl ? `<button class="btn-audio-play" onclick="playAudio('${audioUrl}')" title="Putar Audio">▶</button>` : ''}
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

// Fungsi Audio Murattal per Ayat
function playAudio(url) {
  if (currentAudio) {
    currentAudio.pause();
  }
  currentAudio = new Audio(url);
  currentAudio.play();
}

// Fungsi Simpen Penanda Terakhir Dibaca
function markLastRead(surahNumber, verseNumber, surahName) {
  const data = { surahNumber, verseNumber, surahName };
  localStorage.setItem('quran_last_read', JSON.stringify(data));
  alert(`Berhasil ditandai: Surah ${surahName} ayat ${verseNumber}`);
}

// Load Surah Pertama saat Buka
document.addEventListener('DOMContentLoaded', () => {
  loadSurahDetail(1);
});
