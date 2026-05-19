// Ürünler dizisi
let urunler = [
    {
        id: 1,
        kategori: 'ev',
        baslik: 'Merkez\'de Satılık 3+1 Daire',
        konum: 'Kadıköy, İstanbul',
        fiyat: 850000,
        aciklama: 'Merkezi konumda, yeni yapılmış, asansörlü binada 3+1 daire. Deniz manzaralı.',
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
        aciklama: 'İmarlı, yapı ruhsatlı arsa. Ana yola cepheli, elektrik ve su mevcut.',
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
        aciklama: 'Temiz kullanılmış, bakımlı araç. Hasar kaydı yok, tek elden.',
        telefon: '+90 555 345 67 89',
        satici: 'Ali Özkan',
        tarih: new Date(),
        foto: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'
    },
    {
        id: 4,
        kategori: 'diger',
        baslik: 'Antika Masa Takımı',
        konum: 'Beyoğlu, İstanbul',
        fiyat: 15000,
        aciklama: 'Osmanlı dönemine ait antika masa takımı. Koleksiyonerler için ideal.',
        telefon: '+90 555 456 78 90',
        satici: 'Fatma Kaya',
        tarih: new Date(),
        foto: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    }
];

let filtrelenmisUrunler = [...urunler];

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    urunleriGoster();
    kategoriSayilariGuncelle();
    smoothScrollEkle();
});

// Ürünleri göster
function urunleriGoster(gosterilecekUrunler = null) {
    const grid = document.getElementById('urun-grid');
    const urunListesi = gosterilecekUrunler || filtrelenmisUrunler;
    
    grid.innerHTML = '';
    
    if (urunListesi.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">Aradığınız kriterlere uygun ürün bulunamadı.</div>';
        return;
    }
    
    urunListesi.forEach(urun => {
        const urunKart = document.createElement('div');
        urunKart.className = 'urun-kart';
        
        const kategoriIsimleri = {
            'ev': 'EV',
            'arsa': 'ARSA',
            'araba': 'ARABA',
            'diger': 'DİĞER'
        };
        
        urunKart.innerHTML = `
            <div class="urun-resim" style="background-image: url('${urun.foto}')">
                <div class="kategori-badge">${kategoriIsimleri[urun.kategori]}</div>
            </div>
            <div class="urun-icerik">
                <div class="urun-baslik">${urun.baslik}</div>
                <div class="urun-konum">
                    <i class="fas fa-map-marker-alt"></i> ${urun.konum}
                </div>
                <div class="urun-fiyat">${urun.fiyat.toLocaleString('tr-TR')} ₺</div>
                <div class="urun-aciklama">${urun.aciklama.substring(0, 100)}...</div>
                <div class="urun-iletisim">
                    <a href="tel:${urun.telefon}" class="telefon-link">
                        <i class="fas fa-phone"></i> ${urun.telefon}
                    </a>
                    <button class="btn-primary" onclick="urunDetay(${urun.id})">Detay</button>
                </div>
            </div>
        `;
        
        grid.appendChild(urunKart);
    });
}

// Kategori sayılarını güncelle
function kategoriSayilariGuncelle() {
    const evSayisi = urunler.filter(u => u.kategori === 'ev').length;
    const arsaSayisi = urunler.filter(u => u.kategori === 'arsa').length;
    const arabaSayisi = urunler.filter(u => u.kategori === 'araba').length;
    const digerSayisi = urunler.filter(u => u.kategori === 'diger').length;
    
    document.getElementById('ev-sayisi').textContent = `${evSayisi} ürün`;
    document.getElementById('arsa-sayisi').textContent = `${arsaSayisi} ürün`;
    document.getElementById('araba-sayisi').textContent = `${arabaSayisi} ürün`;
    document.getElementById('diger-sayisi').textContent = `${digerSayisi} ürün`;
}

// Arama yapma
function aramaYap() {
    const kategori = document.getElementById('kategori').value;
    const arama = document.getElementById('arama').value.toLowerCase();
    const minFiyat = parseInt(document.getElementById('min-fiyat').value) || 0;
    const maxFiyat = parseInt(document.getElementById('max-fiyat').value) || Infinity;
    
    filtrelenmisUrunler = urunler.filter(urun => {
        const kategoriUygun = !kategori || urun.kategori === kategori;
        const aramaUygun = !arama || 
            urun.baslik.toLowerCase().includes(arama) ||
            urun.konum.toLowerCase().includes(arama) ||
            urun.aciklama.toLowerCase().includes(arama);
        const fiyatUygun = urun.fiyat >= minFiyat && urun.fiyat <= maxFiyat;
        
        return kategoriUygun && aramaUygun && fiyatUygun;
    });
    
    urunleriGoster();
    
    // Ürünler bölümüne scroll
    document.getElementById('urunler').scrollIntoView({ behavior: 'smooth' });
    
    // Filter butonlarını güncelle
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (kategori) {
        const targetBtn = Array.from(document.querySelectorAll('.filter-btn')).find(btn => 
            btn.textContent.toLowerCase() === kategori
        );
        if (targetBtn) targetBtn.classList.add('active');
    } else {
        document.querySelector('.filter-btn').classList.add('active');
    }
}

// Kategori filtresi
function kategoriFiltre(kategori) {
    filtrelenmisUrunler = urunler.filter(urun => urun.kategori === kategori);
    urunleriGoster();
    
    // Filter butonlarını güncelle
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    const targetBtn = Array.from(document.querySelectorAll('.filter-btn')).find(btn => 
        btn.textContent.toLowerCase() === kategori
    );
    if (targetBtn) targetBtn.classList.add('active');
    
    // Ürünler bölümüne scroll
    document.getElementById('urunler').scrollIntoView({ behavior: 'smooth' });
}

// Tümünü göster
function tumunuGoster() {
    filtrelenmisUrunler = [...urunler];
    urunleriGoster();
    
    // Filter butonlarını güncelle
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn').classList.add('active');
}

// Ürün detayı
function urunDetay(id) {
    const urun = urunler.find(u => u.id === id);
    if (urun) {
        const kategoriIsimleri = {
            'ev': 'Ev',
            'arsa': 'Arsa',
            'araba': 'Araba',
            'diger': 'Diğer'
        };
        
        alert(`ÜRÜN DETAYI

${urun.baslik}
Kategori: ${kategoriIsimleri[urun.kategori]}
Konum: ${urun.konum}
Fiyat: ${urun.fiyat.toLocaleString('tr-TR')} ₺

${urun.aciklama}

Satıcı: ${urun.satici}
Telefon: ${urun.telefon}
Tarih: ${urun.tarih.toLocaleDateString('tr-TR')}`);
    }
}

// Ürün ekleme modal
function urunEkleModal() {
    document.getElementById('urun-modal').style.display = 'block';
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

// Ürün ekleme
function urunEkle(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const yeniUrun = {
        id: urunler.length + 1,
        kategori: formData.get('kategori'),
        baslik: formData.get('baslik'),
        konum: formData.get('konum'),
        fiyat: parseInt(formData.get('fiyat')),
        aciklama: formData.get('aciklama'),
        telefon: formData.get('telefon'),
        satici: formData.get('satici'),
        tarih: new Date(),
        foto: formData.get('foto') || getDefaultImage(formData.get('kategori'))
    };
    
    urunler.unshift(yeniUrun);
    filtrelenmisUrunler = [...urunler];
    
    urunleriGoster();
    kategoriSayilariGuncelle();
    
    modalKapat();
    form.reset();
    
    alert('Ürününüz başarıyla eklendi!');
}

// Varsayılan resim al
function getDefaultImage(kategori) {
    const defaultImages = {
        ev: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
        arsa: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
        araba: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
        diger: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    };
    
    return defaultImages[kategori] || defaultImages.diger;
}

// Mesaj gönderme
function mesajGonder(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Basit form validasyonu
    const inputs = form.querySelectorAll('input, textarea');
    let valid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = '#28a745';
        }
    });
    
    if (valid) {
        alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
        form.reset();
        inputs.forEach(input => {
            input.style.borderColor = '#e9ecef';
        });
    } else {
        alert('Lütfen tüm alanları doldurun.');
    }
}

// Smooth scroll ekleme
function smoothScrollEkle() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Klavye kısayolları
document.addEventListener('keydown', function(e) {
    // ESC tuşu ile modal kapatma
    if (e.key === 'Escape') {
        modalKapat();
    }
    
    // Ctrl + K ile arama odaklama
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.getElementById('arama').focus();
    }
});

// Scroll animasyonları
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Sayfa yüklenme animasyonu
document.addEventListener('DOMContentLoaded', function() {
    // Fade in animasyonu için CSS sınıfı ekle
    const elements = document.querySelectorAll('.urun-kart, .kategori-kart');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});