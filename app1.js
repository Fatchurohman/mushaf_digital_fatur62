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

let globalSurahList = [];
let currentFilter = 'all';
let currentSurahData = null;
let selectedQoriKey = '01';

let currentAudio = null;
let currentPlayingBtn = null;

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

// 2. GENERATOR MAPPING RINCI SAKA DATA API (PARSER MAPPING)
function getSurahMappingInfo(surah) {
  const number = surah?.nomor ?? 1;
  const nameLatin = surah?.namaLatin ?? '';
  const meaning = surah?.arti ?? '';
  const place = surah?.tempatTurun === 'makkah' ? 'Makkiyah' : 'Madaniyah';
  const totalVerses = surah?.jumlahAyat ?? 0;

  // Yen wis ana ing database khusus, utamakake
  if (mappingDatabase[number]) {
    return mappingDatabase[number];
  }

  // Yen deskripsi saka API ana, resiki lan gunakake minangka mapping rinci
  if (surah?.deskripsi) {
    // Menghapus tag HTML yen ana saka API
    let cleanDesc = surah.deskripsi.replace(/<\/?[^>]+(>|$)/g, "");
    if (cleanDesc.length > 250) {
      cleanDesc = cleanDesc.substring(0, 250) + "...";
    }
    return {
      theme: `Peta Tematik Surah ${nameLatin} (${meaning})`,
      desc: cleanDesc
    };
  }

  // Fallback cadangan
  return {
    theme: `Peta Kandungan Surah ${nameLatin}`,
    desc: `Surah ${nameLatin} tergolong fase ${place} kanthi ${totalVerses} ayat. Mengandung petunjuk akidah ngenani "${meaning}", panduan hukum kehidupan, serta landasan moral bagi umat.`
  };
}

// FUNGSI COUNTER PENGUNJUNG HYBRID (AUTO-INCREMENT & ANTI-STUCK)
function updateVisitorCount() {
  if (!visitorCountElem) return;

  // 1. Ambil hitungan lokal saiki (default 128 yen durung ana)
  let localCount = parseInt(localStorage.getItem('mushaf_visitor_count') || '128', 10);
  
  // 2. Chek apakah sesi kunjungan iki wis dihitung (supaya ora nambah terus mung amarga refresh terus-terusan)
  const hasVisited = sessionStorage.getItem('mushaf_visited_session');
  if (!hasVisited) {
    localCount += 1;
    localStorage.setItem('mushaf_visitor_count', localCount);
    sessionStorage.setItem('mushaf_visited_session', 'true');
  }

  // Tampilake hitungan lokal dhisik (langsung metu tanpa ngenteni API)
  visitorCountElem.innerText = localCount.toLocaleString('id-ID');

  // 3. Coba kirim hitungan menyang API global (background sync)
  fetch('https://api.counterapi.dev/v1/fatur62_mushaf_digital/visits/up')
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (data && data.count) {
        // Yen API sukses lan angkane luwih gedhe saka lokal, update nganggo angka API
        const finalCount = Math.max(data.count, localCount);
        visitorCountElem.innerText = finalCount.toLocaleString('id-ID');
        localStorage.setItem('mushaf_visitor_count', finalCount);
      }
    })
    .catch(() => {
      // Yen API gagal/error, tetep tampilkan hitungan lokal sing wis nambah mau
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
        loadSurahDetail(parsed.surahNumber, parsed.verseNumber);
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
  const data = { surahNumber, verseNumber, surahName };
  localStorage.setItem('quran_last_read', JSON.stringify(data));
  alert(`Berhasil ditandai: Surah ${surahName} ayat ${verseNumber}`);
}

document.addEventListener('DOMContentLoaded', () => {
  loadSurahDetail(1);
  updateVisitorCount();
});
