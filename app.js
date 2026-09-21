const btnPilihSurah = document.getElementById('btn-pilih-surah');
const btnCloseModal = document.getElementById('btn-close-modal');
const modalSurah = document.getElementById('modal-surah');
const surahListContainer = document.getElementById('surah-list-container');
const quranContainer = document.getElementById('quran-container');
const currentSurahTitle = document.getElementById('current-surah-title');

// Event Listener Modal
if (btnPilihSurah) {
  btnPilihSurah.addEventListener('click', () => {
    modalSurah.classList.remove('hidden');
    loadSurahList();
  });
}

if (btnCloseModal) {
  btnCloseModal.addEventListener('click', () => {
    modalSurah.classList.add('hidden');
  });
}

// 1. Fetch 114 Daftar Surah Otomatis dari API Public
async function loadSurahList() {
  if (!surahListContainer) return;
  surahListContainer.innerHTML = '<p style="text-align:center; color:#8a9e8f; padding: 20px;">Memuat 114 daftar surah...</p>';

  try {
    // Memakai API Quran publik Kemenag/Equran.id (Gratis & Lengkap)
    const response = await fetch('https://equran.id/api/v2/surat');
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const result = await response.json();
    const data = result?.data ?? [];

    renderSurahList(data);
  } catch (error) {
    console.error('Gagal memuat surah list:', error);
    surahListContainer.innerHTML = `
      <div style="color:#ff6b6b; text-align:center; padding: 20px;">
        <p>Gagal memuat daftar surah. Periksa koneksi internetmu.</p>
      </div>
    `;
  }
}

function renderSurahList(surahArray) {
  const html = surahArray.map(surah => {
    const number = surah?.nomor ?? '-';
    const nameLatin = surah?.namaLatin ?? 'Surah';
    const nameArabic = surah?.nama ?? '';

    return `
      <div class="surah-item" onclick="selectSurah(${number})">
        <div>
          <strong>${number}. ${nameLatin}</strong>
        </div>
        <div style="font-family:'Amiri', serif; color:#d4af37;">${nameArabic}</div>
      </div>
    `;
  }).join('');

  surahListContainer.innerHTML = html;
}

function selectSurah(surahNumber) {
  modalSurah.classList.add('hidden');
  loadSurahDetail(surahNumber);
}

// 2. Fetch Detail Ayat Surah Otomatis dari API Public
async function loadSurahDetail(surahNumber = 1) {
  if (!quranContainer) return;
  quranContainer.innerHTML = '<p style="text-align:center; color:#8a9e8f; padding: 40px;">Memuat ayat...</p>';

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
  } catch (error) {
    console.error('Error loading surah detail:', error);
    quranContainer.innerHTML = `
      <div style="color:#ff6b6b; text-align:center; padding:20px;">
        <p>Gagal memuat ayat surah. Pastikan terhubung ke internet.</p>
      </div>
    `;
  }
}

function renderSurahContent(surah) {
  const nameArabic = surah?.nama ?? '';
  const nameLatin = surah?.namaLatin ?? '';
  const totalVerses = surah?.jumlahAyat ?? 0;
  const verses = surah?.ayat ?? [];

  let html = `
    <div class="surah-header">
      <h2 class="arabic-title">${nameArabic}</h2>
      <p class="surah-meta">${nameLatin} - ${totalVerses} Ayat</p>
    </div>
    <div class="bismillah-box">
      <p class="arabic-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
      <p class="translation-text">Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.</p>
    </div>
  `;

  verses.forEach(v => {
    html += `
      <div class="verse-card">
        <div class="verse-number">${v?.nomorAyat ?? ''}</div>
        <div class="verse-content">
          <p class="arabic-text">${v?.teksArab ?? ''}</p>
          <p class="translation-text">${v?.teksIndonesia ?? ''}</p>
        </div>
      </div>
    `;
  });

  quranContainer.innerHTML = html;
}

// Load Surah Al-Fatihah saat pertama buka
document.addEventListener('DOMContentLoaded', () => {
  loadSurahDetail(1);
});
