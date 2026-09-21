document.addEventListener('DOMContentLoaded', () => {
    const btnOpenMapping = document.getElementById('btn-open-mapping');
    const btnCloseMapping = document.getElementById('btn-close-mapping');
    const mappingModal = document.getElementById('mapping-modal');
    const surahListContainer = document.getElementById('surah-list');
    const surahContainer = document.getElementById('surah-container');
    const currentSurahName = document.getElementById('current-surah-name');

    // Event Listener Buka / Tutup Modal
    if (btnOpenMapping && mappingModal) {
        btnOpenMapping.addEventListener('click', () => {
            mappingModal.classList.remove('hidden');
            loadSurahMapping();
        });
    }

    if (btnCloseMapping && mappingModal) {
        btnCloseMapping.addEventListener('click', () => {
            mappingModal.classList.add('hidden');
        });
    }

    if (mappingModal) {
        mappingModal.addEventListener('click', (e) => {
            if (e.target === mappingModal) {
                mappingModal.classList.add('hidden');
            }
        });
    }

    // Fungsi Fetch Mapping Surah
    async function loadSurahMapping() {
        if (!surahListContainer) return;
        surahListContainer.innerHTML = '<div class="loading">Memuat daftar surah...</div>';

        try {
            const response = await fetch('./data/surah-mapping.json');
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Data mapping kosong.');
            }
            renderSurahList(data);
        } catch (error) {
            console.error('Error loadSurahMapping:', error);
            surahListContainer.innerHTML = `<div class="error">Gagal memuat daftar surah. Pastikan file data/surah-mapping.json ada.</div>`;
        }
    }

    // Render List Surah di Modal
    function renderSurahList(surahs) {
        surahListContainer.innerHTML = '';
        surahs.forEach((surah) => {
            if (!surah || !surah.number) return;

            const item = document.createElement('div');
            item.className = 'surah-item';
            item.innerHTML = `
                <div class="surah-num">${surah.number}</div>
                <div class="surah-info">
                    <div class="surah-title-id">${surah.translation || 'Tanpa Nama'}</div>
                    <div class="surah-sub">${surah.revelation || ''} • ${surah.numberOfAyahs || 0} Ayat</div>
                </div>
                <div class="surah-title-ar">${surah.name || ''}</div>
            `;

            item.addEventListener('click', () => {
                loadSurahData(surah.number);
                if (mappingModal) mappingModal.classList.add('hidden');
            });

            surahListContainer.appendChild(item);
        });
    }

    // Fungsi Fetch Isi Surah
    async function loadSurahData(surahNumber) {
        if (!surahContainer) return;
        surahContainer.innerHTML = '<div class="loading">Memuat ayat...</div>';

        try {
            const response = await fetch(`./data/surah/${surahNumber}.json`);
            if (!response.ok) throw new Error(`File ./data/surah/${surahNumber}.json tidak ditemukan.`);

            const data = await response.json();
            if (!data || !Array.isArray(data.verses)) {
                throw new Error('Format data surah tidak valid.');
            }

            if (currentSurahName) {
                currentSurahName.textContent = data.translation || `Surah ${surahNumber}`;
            }

            renderVerses(data);
        } catch (error) {
            console.error('Error loadSurahData:', error);
            surahContainer.innerHTML = `<div class="error">${error.message}</div>`;
        }
    }

    // Render Ayat ke Tampilan
    function renderVerses(surah) {
        surahContainer.innerHTML = `
            <div class="surah-header-detail">
                <h2>${surah.name || ''}</h2>
                <p>${surah.translation || ''} (${surah.revelation || ''}) - ${surah.numberOfAyahs || 0} Ayat</p>
            </div>
        `;

        surah.verses.forEach((verse) => {
            if (!verse) return;

            const verseCard = document.createElement('div');
            verseCard.className = 'verse-card';
            verseCard.innerHTML = `
                <div class="verse-header">
                    <span class="verse-badge">${verse.number || '-'}</span>
                </div>
                <div class="verse-arabic">${verse.arabic || ''}</div>
                <div class="verse-translation">${verse.translation || ''}</div>
                ${verse.asbabunNuzul ? `<div class="asbabun-nuzul"><strong>Asbabun Nuzul:</strong> ${verse.asbabunNuzul}</div>` : ''}
            `;
            surahContainer.appendChild(verseCard);
        });
    }

    // Load awal surah Al-Fatihah
    loadSurahData(1);
});
