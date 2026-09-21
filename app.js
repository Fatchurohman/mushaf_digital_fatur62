document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements Mapping Modal
    const btnOpenMapping = document.getElementById('btn-open-mapping');
    const btnCloseMapping = document.getElementById('btn-close-mapping');
    const mappingModal = document.getElementById('mapping-modal');
    const surahListContainer = document.getElementById('surah-list');

    // DOM Elements Settings Modal
    const btnOpenSettings = document.getElementById('btn-open-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const settingsModal = document.getElementById('settings-modal');
    const fontFamilySelect = document.getElementById('font-family-select');
    const fontSizeRange = document.getElementById('font-size-range');
    const fontSizeVal = document.getElementById('font-size-val');

    // Content Containers
    const surahContainer = document.getElementById('surah-container');
    const currentSurahName = document.getElementById('current-surah-name');

    // Handle Open/Close Mapping Modal
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

    // Handle Open/Close Settings Modal
    if (btnOpenSettings && settingsModal) {
        btnOpenSettings.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });
    }

    if (btnCloseSettings && settingsModal) {
        btnCloseSettings.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }

    // Close Modals on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === mappingModal) mappingModal.classList.add('hidden');
        if (e.target === settingsModal) settingsModal.classList.add('hidden');
    });

    // Font Customization Logic
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', (e) => {
            document.documentElement.style.setProperty('--arabic-font', e.target.value);
            localStorage.setItem('preferred-arabic-font', e.target.value);
        });
    }

    if (fontSizeRange && fontSizeVal) {
        fontSizeRange.addEventListener('input', (e) => {
            const sizeVal = `${e.target.value}rem`;
            document.documentElement.style.setProperty('--arabic-size', sizeVal);
            fontSizeVal.textContent = sizeVal;
            localStorage.setItem('preferred-arabic-size', sizeVal);
        });
    }

    // Load User Font Settings from LocalStorage
    function loadSavedFontSettings() {
        const savedFont = localStorage.getItem('preferred-arabic-font');
        const savedSize = localStorage.getItem('preferred-arabic-size');

        if (savedFont) {
            document.documentElement.style.setProperty('--arabic-font', savedFont);
            if (fontFamilySelect) fontFamilySelect.value = savedFont;
        }

        if (savedSize) {
            document.documentElement.style.setProperty('--arabic-size', savedSize);
            if (fontSizeRange) fontSizeRange.value = parseFloat(savedSize);
            if (fontSizeVal) fontSizeVal.textContent = savedSize;
        }
    }

    // Fetch Mapping Surah
    async function loadSurahMapping() {
        if (!surahListContainer) return;
        surahListContainer.innerHTML = '<div class="loading">Memuat daftar surah...</div>';

        try {
            const response = await fetch('./data/surah-mapping.json');
            if (!response.ok) throw new Error(`HTTP Status ${response.status}`);
            
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Data mapping kosong.');
            }
            renderSurahList(data);
        } catch (error) {
            console.error('Error loadSurahMapping:', error);
            surahListContainer.innerHTML = `<div class="error">Gagal memuat daftar surah. Pastikan data/surah-mapping.json ada.</div>`;
        }
    }

    // Render Surah List
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

    // Fetch & Render Surah
    async function loadSurahData(surahNumber) {
        if (!surahContainer) return;
        surahContainer.innerHTML = '<div class="loading">Memuat ayat...</div>';

        try {
            const response = await fetch(`./data/surah/${surahNumber}.json`);
            if (!response.ok) throw new Error(`File surah ${surahNumber}.json tidak ditemukan.`);

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

    // Initialize Settings & Initial Surah
    loadSavedFontSettings();
    loadSurahData(1);
});
