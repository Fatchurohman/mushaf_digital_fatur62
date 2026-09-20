// Register Service Worker untuk PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker terdaftar:', reg.scope))
            .catch(err => console.error('Gagal mendaftarkan Service Worker:', err));
    });
}

// State Aplikasi
const AppState = {
    currentSurah: 36, // Default Surah Yasin
    isTranslationVisible: true,
    mappingData: []
};

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

async function initApp() {
    setupEventListeners();
    await loadSurahMapping();
    await loadSurahData(AppState.currentSurah);
}

function setupEventListeners() {
    const toggleBtn = document.getElementById("toggleTranslation");
    if (toggleBtn) {
        toggleBtn.addEventListener("change", (e) => {
            AppState.isTranslationVisible = e.target.checked;
            applyTranslationVisibility();
        });
    }
}

// 1. Memuat Data Mapping Surat
async function loadSurahMapping() {
    try {
        const response = await fetch('./data/surah-mapping.json');
        if (!response.ok) throw new Error(`HTTP Status ${response.status}`);
        
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Format mapping tidak valid.");
        
        AppState.mappingData = data;
        renderMappingSelector(data);
    } catch (error) {
        console.error("Error loading surah mapping:", error);
    }
}

function renderMappingSelector(mappingList) {
    const selector = document.getElementById("surahSelector");
    if (!selector) return;

    selector.innerHTML = "";
    mappingList.forEach(item => {
        const option = document.createElement("option");
        option.value = item?.number ?? 1;
        option.textContent = `${item?.number ?? 1}. ${item?.name ?? ''} (${item?.category ?? ''})`;
        if (item.number === AppState.currentSurah) option.selected = true;
        selector.appendChild(option);
    });

    selector.addEventListener("change", (e) => {
        const selectedNumber = parseInt(e.target.value, 10);
        if (selectedNumber) {
            AppState.currentSurah = selectedNumber;
            loadSurahData(selectedNumber);
        }
    });
}

// 2. Memuat Data Ayat Surat Dinamis
async function loadSurahData(surahNumber) {
    const container = document.getElementById("surahContainer");
    if (!container) return;

    container.innerHTML = `<p style="text-align: center; color: var(--gold-dark); font-size: 0.9rem;">Memuat data surat...</p>`;

    try {
        // Panggilan path relatif yang aman untuk GitHub Pages
        const response = await fetch(`./data/surah/${surahNumber}.json`);
        
        if (!response.ok) {
            throw new Error(`File JSON surah ${surahNumber}.json tidak ditemukan (Status: ${response.status}).`);
        }

        const surahData = await response.json();

        // Validasi struktur data JSON
        if (!surahData || !Array.isArray(surahData.verses)) {
            throw new Error("Struktur data surah dalam JSON tidak sesuai.");
        }

        renderAyatUI(surahData);
    } catch (error) {
        console.error("Gagal memuat ayat:", error);
        container.innerHTML = `
            <div style="text-align: center; color: #8a6d3b; padding: 20px 10px;">
                <p style="font-weight: bold; margin-bottom: 8px;">Gagal Memuat Data</p>
                <p style="font-size: 0.75rem; font-family: sans-serif;">Pastikan file <code>data/surah/${surahNumber}.json</code> sudah ada di repositori GitHub.</p>
            </div>
        `;
    }
}

function renderAyatUI(surahData) {
    const container = document.getElementById("surahContainer");
    container.innerHTML = "";

    // Update Header Text
    const titleAr = document.getElementById("headerTitleAr");
    const subTitle = document.getElementById("headerSubTitle");
    if (titleAr) titleAr.textContent = surahData?.name ?? "";
    if (subTitle) subTitle.textContent = `Surah Ke-${surahData?.number ?? 0} • ${surahData?.revelation ?? ''} • ${surahData?.numberOfAyahs ?? 0} Ayat`;

    surahData.verses.forEach(verse => {
        const verseNum = verse?.number ?? 0;
        const arabText = verse?.arabic ?? "";
        const idText = verse?.translation ?? "";
        const asbabText = verse?.asbabunNuzul ?? null;

        const card = document.createElement("div");
        card.className = "ayat-card";

        card.innerHTML = `
            <div class="ayat-arabic">
                ${arabText} <span class="ayat-number">${verseNum}</span>
            </div>
            <div class="ayat-translation">
                ${idText}
            </div>
            ${asbabText ? `
                <button class="asbabun-nuzul-btn" onclick="toggleAsbab(${verseNum})">Asbabun Nuzul</button>
                <div class="asbabun-nuzul-content" id="asbab-${verseNum}">
                    ${asbabText}
                </div>
            ` : ""}
        `;

        container.appendChild(card);
    });

    applyTranslationVisibility();
}

function applyTranslationVisibility() {
    const translations = document.querySelectorAll(".ayat-translation");
    const asbabBtns = document.querySelectorAll(".asbabun-nuzul-btn");

    translations.forEach(el => {
        if (AppState.isTranslationVisible) {
            el.classList.remove("hidden");
        } else {
            el.classList.add("hidden");
        }
    });

    asbabBtns.forEach(el => {
        if (AppState.isTranslationVisible) {
            el.classList.remove("hidden");
        } else {
            el.classList.add("hidden");
        }
    });
}

window.toggleAsbab = function(verseNum) {
    const el = document.getElementById(`asbab-${verseNum}`);
    if (el) {
        el.style.display = (el.style.display === "block") ? "none" : "block";
    }
};
