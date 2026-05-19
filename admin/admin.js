// Admin Panel JavaScript

// Ana siteden ürünleri al
let adminUrunler = [];
let adminKullanicilar = [];

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Ana siteden verileri yükle
    verileriYukle();
    
    // Dashboard'ı göster
    showPage('dashboard');
    
    // İstatistikleri güncelle
    istatistikleriGuncelle();
    
    // Son ürünleri göster
    sonUrunleriGoster();
});

// Ana siteden verileri yükle
function verileriYukle() {
    // LocalStorage'dan veya ana siteden veri al
    const savedData = localStorage.getItem('site_urunler');
    if (savedData) {
        adminUrunler = JSON.parse(savedData);
    } else {
        // Örnek veriler
        adminUrunler = [
            {
                id: 1,
                kategori: 'ev',
                baslik: 'Merkez\'de Satılık 3+1 Daire',
                konum: 'Kadıköy, İstanbul',
                fiyat: 850000,
                aciklama: 'Merkezi konumda, yeni yapılmış, asansörlü binada 3+1 daire.',
                telefon: '+90 555 123 45 67',
                satici: 'Ahmet Yılmaz',
                tarih: new Date(),
                foto: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'
            },
            {
                id: 2,
                kategori: 'arsa',
                baslik: 'İmarlı Arsa - Yatırım Fırsatı',
                konum: 'Çankaya, Ankara',
                fiyat: 450000,
                aciklama: 'İmarlı, yapı ruhsatlı arsa. Ana yola cepheli.',
                telefon: '+90 555 234 56 78',
                satici: 'Mehmet Demir',
                tarih: new Date(),
                foto: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'
            },
            {
                id: 3,
                kategori: 'araba',
                baslik: '2020 Model Volkswagen Golf',
                konum: 'Beşiktaş, İstanbul',
                fiyat: 320000,
                aciklama: 'Temiz kullanılmış, bakımlı araç.',
                telefon: '+90 555 345 67 89',
                satici: 'Ali Özkan',
                tarih: new Date(),
                foto: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'
            }
        ];
    }
    
    // Kullanıcıları oluştur
    kullanicilariOlustur();
}

// Kullanıcıları oluştur
function kullanicilariOlustur() {
    const saticilar = {};
    
    adminUrunler.forEach(urun => {
        if (!saticilar[urun.satici]) {
            saticilar[urun.satici] = {
                ad: urun.satici,
                telefon: urun.telefon,
                urunSayisi: 0,
                sonUrun: null
            };
        }
        saticilar[urun.satici].urunSayisi++;
        if (!saticilar[urun.satici].sonUrun || urun.tarih > saticilar[urun.satici].sonUrun) {
            saticilar[urun.satici].sonUrun = urun.tarih;
        }
    });
    
    adminKullanicilar = Object.values(saticilar);
}

// Sayfa gösterme
function showPage(pageId) {
    // Tüm sayfaları gizle
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Seçili sayfayı göster
    document.getElementById(pageId).classList.add('active');
    
    // Nav item'ları güncelle
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNav = document.querySelector(`[onclick="showPage('${pageId}')"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
    
    // Sayfa başlığını güncelle
    const titles = {
        'dashboard': 'Dashboard',
        'urunler': 'Ürün Yönetimi',
        'kullanicilar': 'Kullanıcı Yönetimi',
        'ayarlar': 'Site Ayarları'
    };
    
    document.getElementById('page-title').textContent = titles[pageId] || 'Admin Panel';
    
    // Sayfa özel yüklemeler
    switch(pageId) {
        case 'urunler':
            urunleriYukle();
            break;
        case 'kullanicilar':
            kullanicilariYukle();
            break;
    }
}

// İstatistikleri güncelle
function istatistikleriGuncelle() {
    const toplamUrun = adminUrunler.length;
    const toplamSatici = adminKullanicilar.length;
    const evUrunleri = adminUrunler.filter(u => u.kategori === 'ev').length;
    const arabaUrunleri = adminUrunler.filter(u => u.kategori === 'araba').length;
    
    document.getElementById('total-urunler').textContent = toplamUrun;
    document.getElementById('total-saticilar').textContent = toplamSatici;
    document.getElementById('ev-urunleri').textContent = evUrunleri;
    document.getElementById('araba-urunleri').textContent = arabaUrunleri;
}

// Son ürünleri göster
function sonUrunleriGoster() {
    const sonUrunler = adminUrunler
        .sort((a, b) => new Date(b.tarih) - new Date(a.tarih))
        .slice(0, 5);
    
    const container = document.getElementById('recent-products-list');
    
    if (sonUrunler.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center;">Henüz ürün eklenmemiş.</p>';
        return;
    }
    
    container.innerHTML = sonUrunler.map(urun => `
        <div class="recent-item">
            <img src="${urun.foto}" alt="${urun.baslik}">
            <div class="recent-info">
                <h4>${urun.baslik}</h4>
                <p>${urun.fiyat.toLocaleString('tr-TR')} ₺ - ${urun.satici}</p>
            </div>
        </div>
    `).join('');
}

// Ürünleri yükle
function urunleriYukle() {
    const tbody = document.getElementById('urunler-table');
    
    if (adminUrunler.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666;">Henüz ürün eklenmemiş.</td></tr>';
        return;
    }
    
    tbody.innerHTML = adminUrunler.map(urun => {
        const kategoriClass = `kategori-${urun.kategori}`;
        const kategoriText = {
            'ev': 'EV',
            'arsa': 'ARSA',
            'araba': 'ARABA',
            'diger': 'DİĞER'
        };
        
        return `
            <tr>
                <td>${urun.id}</td>
                <td>${urun.baslik}</td>
                <td><span class="kategori-badge ${kategoriClass}">${kategoriText[urun.kategori]}</span></td>
                <td>${urun.fiyat.toLocaleString('tr-TR')} ₺</td>
                <td>${urun.satici}</td>
                <td>${new Date(urun.tarih).toLocaleDateString('tr-TR')}</td>
                <td>
                    <button class="btn-success" onclick="urunDuzenle(${urun.id})">Düzenle</button>
                    <button class="btn-danger" onclick="urunSil(${urun.id})">Sil</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Kullanıcıları yükle
function kullanicilariYukle() {
    const tbody = document.getElementById('kullanicilar-table');
    
    if (adminKullanicilar.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666;">Henüz kullanıcı bulunmuyor.</td></tr>';
        return;
    }
    
    tbody.innerHTML = adminKullanicilar.map(kullanici => `
        <tr>
            <td>${kullanici.ad}</td>
            <td>${kullanici.telefon}</td>
            <td>${kullanici.urunSayisi}</td>
            <td>${kullanici.sonUrun ? new Date(kullanici.sonUrun).toLocaleDateString('tr-TR') : '-'}</td>
            <td>
                <button class="btn-secondary" onclick="kullaniciDetay('${kullanici.ad}')">Detay</button>
            </td>
        </tr>
    `).join('');
}

// Yeni ürün ekleme
function yeniUrunEkle() {
    document.getElementById('modal-title').textContent = 'Yeni Ürün Ekle';
    document.getElementById('edit-id').value = '';
    document.querySelector('.admin-form').reset();
    document.getElementById('urun-modal').style.display = 'block';
}

// Ürün düzenleme
function urunDuzenle(id) {
    const urun = adminUrunler.find(u => u.id === id);
    if (!urun) return;
    
    document.getElementById('modal-title').textContent = 'Ürün Düzenle';
    document.getElementById('edit-id').value = id;
    
    const form = document.querySelector('.admin-form');
    form.kategori.value = urun.kategori;
    form.baslik.value = urun.baslik;
    form.konum.value = urun.konum;
    form.fiyat.value = urun.fiyat;
    form.aciklama.value = urun.aciklama;
    form.satici.value = urun.satici;
    form.telefon.value = urun.telefon;
    form.foto.value = urun.foto;
    
    document.getElementById('urun-modal').style.display = 'block';
}

// Ürün kaydetme
function urunKaydet(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const editId = document.getElementById('edit-id').value;
    
    const gecerliFotolar = adminYuklenenFotolar.filter(f => f !== null);

    const urunData = {
        kategori: formData.get('kategori'),
        baslik: formData.get('baslik'),
        konum: formData.get('konum'),
        fiyat: parseInt(formData.get('fiyat')),
        aciklama: formData.get('aciklama'),
        satici: formData.get('satici'),
        telefon: formData.get('telefon'),
        fotolar: gecerliFotolar.length > 0 ? gecerliFotolar : null,
        foto: gecerliFotolar.length > 0 ? gecerliFotolar[0] : getDefaultImage(formData.get('kategori'))
    };
    
    if (editId) {
        // Düzenleme
        const index = adminUrunler.findIndex(u => u.id === parseInt(editId));
        if (index !== -1) {
            adminUrunler[index] = { ...adminUrunler[index], ...urunData };
            showNotification('Ürün başarıyla güncellendi!', 'success');
        }
    } else {
        // Yeni ekleme
        const yeniUrun = {
            id: Math.max(...adminUrunler.map(u => u.id), 0) + 1,
            ...urunData,
            tarih: new Date()
        };
        adminUrunler.unshift(yeniUrun);
        showNotification('Ürün başarıyla eklendi!', 'success');
    }
    
    // Verileri kaydet
    localStorage.setItem('site_urunler', JSON.stringify(adminUrunler));
    
    // Sayfaları güncelle
    kullanicilariOlustur();
    istatistikleriGuncelle();
    sonUrunleriGoster();
    urunleriYukle();
    
    // Fotoğrafları sıfırla
    adminYuklenenFotolar = [];
    document.getElementById('admin-foto-onizleme').innerHTML = '';
    
    modalKapat();
}

// Ürün silme
function urunSil(id) {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
        adminUrunler = adminUrunler.filter(u => u.id !== id);
        localStorage.setItem('site_urunler', JSON.stringify(adminUrunler));
        
        kullanicilariOlustur();
        istatistikleriGuncelle();
        sonUrunleriGoster();
        urunleriYukle();
        
        showNotification('Ürün başarıyla silindi!', 'success');
    }
}

// Ürün filtreleme
function urunFiltrele() {
    const kategori = document.getElementById('kategori-filter').value;
    const arama = document.getElementById('urun-arama').value.toLowerCase();
    
    let filtreliUrunler = [...adminUrunler];
    
    if (kategori) {
        filtreliUrunler = filtreliUrunler.filter(u => u.kategori === kategori);
    }
    
    if (arama) {
        filtreliUrunler = filtreliUrunler.filter(u => 
            u.baslik.toLowerCase().includes(arama) ||
            u.satici.toLowerCase().includes(arama) ||
            u.konum.toLowerCase().includes(arama)
        );
    }
    
    // Filtrelenmiş sonuçları göster
    const tbody = document.getElementById('urunler-table');
    
    if (filtreliUrunler.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666;">Arama kriterlerine uygun ürün bulunamadı.</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtreliUrunler.map(urun => {
        const kategoriClass = `kategori-${urun.kategori}`;
        const kategoriText = {
            'ev': 'EV',
            'arsa': 'ARSA',
            'araba': 'ARABA',
            'diger': 'DİĞER'
        };
        
        return `
            <tr>
                <td>${urun.id}</td>
                <td>${urun.baslik}</td>
                <td><span class="kategori-badge ${kategoriClass}">${kategoriText[urun.kategori]}</span></td>
                <td>${urun.fiyat.toLocaleString('tr-TR')} ₺</td>
                <td>${urun.satici}</td>
                <td>${new Date(urun.tarih).toLocaleDateString('tr-TR')}</td>
                <td>
                    <button class="btn-success" onclick="urunDuzenle(${urun.id})">Düzenle</button>
                    <button class="btn-danger" onclick="urunSil(${urun.id})">Sil</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Kullanıcı detayı
function kullaniciDetay(ad) {
    const kullaniciUrunleri = adminUrunler.filter(u => u.satici === ad);
    const detay = `Kullanıcı: ${ad}
Toplam Ürün: ${kullaniciUrunleri.length}
Ürünler: ${kullaniciUrunleri.map(u => u.baslik).join(', ')}`;
    
    alert(detay);
}

// Ayarları kaydetme
function ayarlariKaydet() {
    const ayarlar = {
        baslik: document.getElementById('site-baslik').value,
        aciklama: document.getElementById('site-aciklama').value,
        telefon: document.getElementById('site-telefon').value,
        email: document.getElementById('site-email').value,
        adres: document.getElementById('site-adres').value
    };
    
    localStorage.setItem('site_ayarlar', JSON.stringify(ayarlar));
    showNotification('Ayarlar başarıyla kaydedildi!', 'success');
}

// Ayarları sıfırlama
function ayarlariSifirla() {
    if (confirm('Tüm ayarları varsayılan değerlere sıfırlamak istediğinizden emin misiniz?')) {
        localStorage.removeItem('site_ayarlar');
        
        document.getElementById('site-baslik').value = 'Bütçe Dostu Satış Platformu';
        document.getElementById('site-aciklama').value = 'Ev, arsa, araba ve daha fazlası... Aradığınız her şeyi bulun!';
        document.getElementById('site-telefon').value = '+90 555 123 45 67';
        document.getElementById('site-email').value = 'info@butcedostu.com';
        document.getElementById('site-adres').value = 'Merkez Mah. Ticaret Sok. No:123 İstanbul';
        
        showNotification('Ayarlar sıfırlandı!', 'info');
    }
}

// Modal kapatma
function modalKapat() {
    document.getElementById('urun-modal').style.display = 'none';
}

// Modal dışına tıklayınca kapatma
window.onclick = function(event) {
    const modal = document.getElementById('urun-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Yüklenen fotoğraflar (admin)
let adminYuklenenFotolar = [];

// Fotoğrafları oku (admin)
function adminFotolariOku(input) {
    const dosyalar = Array.from(input.files);
    const onizleme = document.getElementById('admin-foto-onizleme');
    
    dosyalar.forEach(dosya => {
        if (dosya.size > 5 * 1024 * 1024) {
            showNotification(`${dosya.name} 5MB'dan büyük, atlandı.`, 'warning');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result;
            adminYuklenenFotolar.push(base64);
            
            const item = document.createElement('div');
            item.className = 'foto-onizleme-item';
            const idx = adminYuklenenFotolar.length - 1;
            item.innerHTML = `
                <img src="${base64}" alt="Fotoğraf">
                <button class="foto-sil" onclick="adminFotoyuSil(${idx}, this)">
                    <i class="fas fa-times"></i>
                </button>
            `;
            onizleme.appendChild(item);
        };
        reader.readAsDataURL(dosya);
    });
}

function adminFotoyuSil(idx, btn) {
    adminYuklenenFotolar[idx] = null;
    btn.parentElement.remove();
}

// Varsayılan resim alma
function getDefaultImage(kategori) {
    const defaultImages = {
        ev: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
        arsa: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
        araba: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
        diger: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    };
    
    return defaultImages[kategori] || defaultImages.diger;
}

// Bildirim gösterme
function showNotification(message, type = 'info') {
    // Mevcut bildirimleri temizle
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // CSS ekle (eğer yoksa)
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 3000;
                min-width: 300px;
                max-width: 400px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                animation: slideInRight 0.3s ease-out;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 15px 20px;
                color: white;
                font-weight: 600;
            }
            .notification-success {
                background: linear-gradient(135deg, #28a745, #20c997);
            }
            .notification-warning {
                background: linear-gradient(135deg, #ffc107, #fd7e14);
            }
            .notification-info {
                background: linear-gradient(135deg, #17a2b8, #6f42c1);
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 5px;
                margin-left: auto;
                border-radius: 50%;
                transition: background-color 0.3s;
            }
            .notification-close:hover {
                background-color: rgba(255,255,255,0.2);
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // 5 saniye sonra otomatik kapat
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Çıkış yapma
function cikisYap() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        sessionStorage.removeItem('admin_giris');
        window.location.href = 'index.html';
    }
}

// Klavye kısayolları
document.addEventListener('keydown', function(e) {
    // ESC tuşu ile modal kapatma
    if (e.key === 'Escape') {
        modalKapat();
    }
    
    // Ctrl + N ile yeni ürün
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        yeniUrunEkle();
    }
});

// Sayfa yüklendiğinde ayarları yükle
window.addEventListener('load', function() {
    const savedSettings = localStorage.getItem('site_ayarlar');
    if (savedSettings) {
        const ayarlar = JSON.parse(savedSettings);
        
        document.getElementById('site-baslik').value = ayarlar.baslik || 'Bütçe Dostu Satış Platformu';
        document.getElementById('site-aciklama').value = ayarlar.aciklama || 'Ev, arsa, araba ve daha fazlası...';
        document.getElementById('site-telefon').value = ayarlar.telefon || '+90 555 123 45 67';
        document.getElementById('site-email').value = ayarlar.email || 'info@butcedostu.com';
        document.getElementById('site-adres').value = ayarlar.adres || 'Merkez Mah. Ticaret Sok. No:123 İstanbul';
    }
});