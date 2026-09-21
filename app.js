// --- ELEMEN DOM ---
const btnPilihSurah = document.getElementById('btn-pilih-surah');
const btnCloseModal = document.getElementById('btn-close-modal');
const modalSurah = document.getElementById('modal-surah');
const surahListContainer = document.getElementById('surah-list-container');

// --- EVENT LISTENERS (MODAL) ---
if (btnPilihSurah) {
  btnPilihSurah.addEventListener('click', () => {
    modalSurah.classList.remove('hidden');
    loadSurahList(); // Load data daftar surah saat modal dibuka
  });
}

if (btnCloseModal) {
  btnCloseModal.addEventListener('click', () => {
    modalSurah.classList.add('hidden');
  });
}

// --- FUNGSI FETCH DAFTAR SURAH (SOLUSI ERROR GAMBAR) ---
async function loadSurahList() {
  if (!surahListContainer) return;

  // Tampilkan indikator loading
  surahListContainer.innerHTML = '<p class="loading">Memuat daftar surah...</p>';

  try {
    // Relative path dipastikan mengarah ke folder data/
    const response = await fetch('./data/surah-mapping.json');

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Validasi aman parsing JSON (Mencegah null/undefined/non-array)
    if (!data || !Array.isArray(data)) {
      throw new Error('Format data JSON tidak valid.');
    }

    renderSurahList(data);

  } catch (error) {
    console.error('Gagal memuat daftar surah:', error);
    
    // Tampilkan pesan error jika file tidak ada / path salah
    surahListContainer.innerHTML = `
      <div class="error-box">
        <p>Gagal memuat daftar surah. Pastikan <code>data/surah-mapping.json</code> ada.</p>
      </div>
    `;
  }
}

// --- FUNGSI RENDER LIST SURAH KE MODAL ---
function renderSurahList(surahArray) {
  if (!surahListContainer) return;

  const htmlContent = surahArray.map(surah => {
    const number = surah?.number ?? '-';
    const nameLatin = surah?.nameLatin ?? 'Surah Tidak Diketahui';
    const nameArabic = surah?.nameArabic ?? '';

    return `
      <div class="surah-item" data-id="${number}">
        <span class="surah-num">${number}</span>
        <span class="surah-latin">${nameLatin}</span>
        <span class="surah-arabic">${nameArabic}</span>
      </div>
    `;
  }).join('');

  surahListContainer.innerHTML = htmlContent;
}
