* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background-color: #0b2219;
    color: #f1f5f9;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* Header */
.app-header {
    background: linear-gradient(135deg, #123d2b, #0b2219);
    border-bottom: 2px solid #d4af37;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-title h1 {
    font-size: 1.2rem;
    color: #d4af37;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.header-title span {
    font-size: 0.85rem;
    color: #e2e8f0;
}

.gold-btn {
    background: linear-gradient(135deg, #d4af37, #aa7c11);
    color: #0b2219;
    border: none;
    padding: 8px 14px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 0.85rem;
    cursor: pointer;
}

/* Layout Konten Utama */
.container {
    padding: 15px;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    flex: 1;
}

.mushaf-frame {
    background-color: #123d2b;
    border: 2px solid #d4af37;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

/* Header Detail Surah */
.surah-header-detail {
    text-align: center;
    border-bottom: 1px dashed #d4af37;
    padding-bottom: 15px;
    margin-bottom: 20px;
}

.surah-header-detail h2 {
    color: #d4af37;
    font-size: 1.8rem;
}

.surah-header-detail p {
    color: #cbd5e1;
    font-size: 0.9rem;
}

/* Card Ayat */
.verse-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
}

.verse-header {
    margin-bottom: 10px;
}

.verse-badge {
    background-color: #d4af37;
    color: #0b2219;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 50%;
    font-size: 0.8rem;
}

.verse-arabic {
    font-size: 1.8rem;
    text-align: right;
    line-height: 2.2;
    color: #ffffff;
    margin-bottom: 12px;
    direction: rtl;
}

.verse-translation {
    font-size: 0.95rem;
    color: #e2e8f0;
    line-height: 1.5;
}

.asbabun-nuzul {
    margin-top: 10px;
    padding: 10px;
    background: rgba(212, 175, 55, 0.1);
    border-left: 3px solid #d4af37;
    font-size: 0.85rem;
    color: #fef08a;
}

/* Modal Popup Mapping Surah */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 15px;
}

.modal.hidden {
    display: none;
}

.modal-content {
    background-color: #0b2219;
    border: 2px solid #d4af37;
    border-radius: 10px;
    width: 100%;
    max-width: 500px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 15px;
    border-bottom: 1px solid #d4af37;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    color: #d4af37;
    font-size: 1.2rem;
}

.close-btn {
    background: none;
    border: none;
    color: #f1f5f9;
    font-size: 1.5rem;
    cursor: pointer;
}

.surah-list {
    overflow-y: auto;
    padding: 10px;
}

.surah-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
}

.surah-item:hover {
    background-color: #123d2b;
}

.surah-num {
    background: #d4af37;
    color: #0b2219;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.85rem;
    margin-right: 12px;
}

.surah-info {
    flex: 1;
}

.surah-title-id {
    color: #f1f5f9;
    font-weight: bold;
    font-size: 0.95rem;
}

.surah-sub {
    color: #94a3b8;
    font-size: 0.8rem;
}

.surah-title-ar {
    color: #d4af37;
    font-size: 1.2rem;
}

.loading, .error {
    text-align: center;
    padding: 20px;
    color: #e2e8f0;
}

.error {
    color: #f87171;
}
