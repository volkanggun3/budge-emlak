// =====================
// VERİ YÖNETİMİ
// =====================

var adminUrunler = [];
var adminYuklenenFotolar = [];

document.addEventListener('DOMContentLoaded', function () {
    verileriYukle();
    showPage('dashboard');
});

function verileriYukle() {
    var kayitli = localStorage.getItem('site_urunler');
    if (kayitli) {
        try {
            adminUrunler = JSON.parse(kayitli);
        } catch(e) {
            adminUrunler = [];
        }
    } else {
        adminUrunler = [];
    }
    istatistikleriGuncelle();
    sonUrunleriGoster();
}

// =====================
// SAYFA GEÇİŞİ
// =====================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(function(p) {
        p.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(function(n) {
        n.classList.remove('active');
    });
    var aktif = document.querySelector('[onclick="showPage(\'' + pageId + '\')"]');
    if (aktif) aktif.classList.add('active');

    var basliklar = {
        dashboard: 'Dashboard',
        urunler: 'Ürün Yönetimi',
        kullanicilar: 'Kullanıcı Yönetimi',
        ayarlar: 'Site Ayarları'
    };
    document.getElementById('page-title').textContent = basliklar[pageId] || 'Admin Panel';

    if (pageId === 'urunler') urunleriYukle();
    if (pageId === 'kullanicilar') kullanicilariYukle();
}

// =====================
// İSTATİSTİKLER
// =====================
function istatistikleriGuncelle() {
    document.getElementById('total-urunler').textContent = adminUrunler.length;

    var saticilar = {};
    adminUrunler.forEach(function(u) { saticilar[u.satici] = true; });
    document.getElementById('total-saticilar').textContent = Object.keys(saticilar).length;

    document.getElementById('ev-urunleri').textContent = adminUrunler.filter(function(u) { return u.kategori === 'ev'; }).length;
    document.getElementById('araba-urunleri').textContent = adminUrunler.filter(function(u) { return u.kategori === 'araba'; }).length;
}

// =====================
// SON ÜRÜNLER
// =====================
function sonUrunleriGoster() {
    var container = document.getElementById('recent-products-list');
    if (!container) return;

    var son = adminUrunler.slice(0, 5);

    if (son.length === 0) {
        container.innerHTML = '<p style="color:#888;text-align:center;padding:1rem;">Henüz ürün eklenmemiş.</p>';
        return;
    }

    container.innerHTML = son.map(function(urun) {
        var foto = (urun.fotolar && urun.fotolar.length > 0) ? urun.fotolar[0] : (urun.foto || '');
        return '<div class="recent-item">' +
            '<img src="' + foto + '" alt="foto" onerror="this.src=\'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=80\'">' +
            '<div class="recent-info">' +
                '<h4>' + urun.baslik + '</h4>' +
                '<p>' + Number(urun.fiyat).toLocaleString('tr-TR') + ' ₺ — ' + urun.satici + '</p>' +
            '</div>' +
        '</div>';
    }).join('');
}

// =====================
// ÜRÜNLER TABLOSU
// =====================
function urunleriYukle() {
    var tbody = document.getElementById('urunler-table');
    if (!tbody) return;

    if (adminUrunler.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#888;padding:2rem;">Henüz ürün eklenmemiş.</td></tr>';
        return;
    }

    var etiketler = { ev: 'EV', arsa: 'ARSA', araba: 'ARABA', diger: 'DİĞER' };
    var renkler = { ev: 'kategori-ev', arsa: 'kategori-arsa', araba: 'kategori-araba', diger: 'kategori-diger' };

    tbody.innerHTML = adminUrunler.map(function(urun) {
        var tarih = urun.tarih ? new Date(urun.tarih).toLocaleDateString('tr-TR') : '-';
        return '<tr>' +
            '<td>' + urun.id + '</td>' +
            '<td>' + urun.baslik + '</td>' +
            '<td><span class="kategori-badge ' + (renkler[urun.kategori] || '') + '">' + (etiketler[urun.kategori] || 'DİĞER') + '</span></td>' +
            '<td>' + Number(urun.fiyat).toLocaleString('tr-TR') + ' ₺</td>' +
            '<td>' + urun.satici + '</td>' +
            '<td>' + tarih + '</td>' +
            '<td>' +
                '<button class="btn-success" onclick="urunDuzenle(' + urun.id + ')">Düzenle</button> ' +
                '<button class="btn-danger" onclick="urunSil(' + urun.id + ')">Sil</button>' +
            '</td>' +
        '</tr>';
    }).join('');
}

// =====================
// KULLANICILAR
// =====================
function kullanicilariYukle() {
    var tbody = document.getElementById('kullanicilar-table');
    if (!tbody) return;

    var saticilar = {};
    adminUrunler.forEach(function(u) {
        if (!saticilar[u.satici]) {
            saticilar[u.satici] = { ad: u.satici, telefon: u.telefon, sayi: 0, son: u.tarih };
        }
        saticilar[u.satici].sayi++;
    });

    var liste = Object.values(saticilar);

    if (liste.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;padding:2rem;">Henüz kullanıcı yok.</td></tr>';
        return;
    }

    tbody.innerHTML = liste.map(function(k) {
        var tarih = k.son ? new Date(k.son).toLocaleDateString('tr-TR') : '-';
        return '<tr>' +
            '<td>' + k.ad + '</td>' +
            '<td>' + k.telefon + '</td>' +
            '<td>' + k.sayi + '</td>' +
            '<td>' + tarih + '</td>' +
            '<td><button class="btn-secondary" onclick="alert(\'' + k.ad + ' - ' + k.sayi + ' ürün\')">Detay</button></td>' +
        '</tr>';
    }).join('');
}

// =====================
// ÜRÜN EKLE / DÜZENLE
// =====================
function yeniUrunEkle() {
    document.getElementById('modal-title').textContent = 'Yeni Ürün Ekle';
    document.getElementById('edit-id').value = '';
    document.querySelector('.admin-form').reset();
    adminYuklenenFotolar = [];
    var onizleme = document.getElementById('admin-foto-onizleme');
    if (onizleme) onizleme.innerHTML = '';
    document.getElementById('urun-modal').style.display = 'block';
}

function urunDuzenle(id) {
    var urun = adminUrunler.find(function(u) { return u.id === id; });
    if (!urun) return;

    document.getElementById('modal-title').textContent = 'Ürün Düzenle';
    document.getElementById('edit-id').value = id;

    var form = document.querySelector('.admin-form');
    form.kategori.value = urun.kategori;
    form.baslik.value = urun.baslik;
    form.konum.value = urun.konum;
    form.fiyat.value = urun.fiyat;
    form.aciklama.value = urun.aciklama;
    form.satici.value = urun.satici;
    form.telefon.value = urun.telefon;

    adminYuklenenFotolar = [];
    var onizleme = document.getElementById('admin-foto-onizleme');
    if (onizleme) onizleme.innerHTML = '';

    document.getElementById('urun-modal').style.display = 'block';
}

function urunKaydet(event) {
    event.preventDefault();
    var form = event.target;
    var fd = new FormData(form);
    var editId = document.getElementById('edit-id').value;

    var gecerliFotolar = adminYuklenenFotolar.filter(function(f) { return f !== null; });

    var urunData = {
        kategori: fd.get('kategori'),
        baslik: fd.get('baslik'),
        konum: fd.get('konum'),
        fiyat: parseInt(fd.get('fiyat')),
        aciklama: fd.get('aciklama'),
        satici: fd.get('satici'),
        telefon: fd.get('telefon'),
        fotolar: gecerliFotolar.length > 0 ? gecerliFotolar : null,
        foto: gecerliFotolar.length > 0 ? gecerliFotolar[0] : varsayilanFoto(fd.get('kategori'))
    };

    if (editId) {
        var idx = adminUrunler.findIndex(function(u) { return u.id === parseInt(editId); });
        if (idx !== -1) {
            adminUrunler[idx] = Object.assign(adminUrunler[idx], urunData);
            showNotification('Ürün güncellendi!', 'success');
        }
    } else {
        urunData.id = Date.now();
        urunData.tarih = new Date().toISOString();
        adminUrunler.unshift(urunData);
        showNotification('Ürün eklendi!', 'success');
    }

    localStorage.setItem('site_urunler', JSON.stringify(adminUrunler));

    istatistikleriGuncelle();
    sonUrunleriGoster();
    urunleriYukle();

    adminYuklenenFotolar = [];
    var onizleme = document.getElementById('admin-foto-onizleme');
    if (onizleme) onizleme.innerHTML = '';

    modalKapat();
}

function urunSil(id) {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    adminUrunler = adminUrunler.filter(function(u) { return u.id !== id; });
    localStorage.setItem('site_urunler', JSON.stringify(adminUrunler));
    istatistikleriGuncelle();
    sonUrunleriGoster();
    urunleriYukle();
    showNotification('Ürün silindi!', 'success');
}

// =====================
// ÜRÜN FİLTRE
// =====================
function urunFiltrele() {
    var kategori = document.getElementById('kategori-filter').value;
    var arama = document.getElementById('urun-arama').value.toLowerCase();

    var liste = adminUrunler.filter(function(u) {
        var k = !kategori || u.kategori === kategori;
        var a = !arama || u.baslik.toLowerCase().includes(arama) || u.satici.toLowerCase().includes(arama);
        return k && a;
    });

    var etiketler = { ev: 'EV', arsa: 'ARSA', araba: 'ARABA', diger: 'DİĞER' };
    var renkler = { ev: 'kategori-ev', arsa: 'kategori-arsa', araba: 'kategori-araba', diger: 'kategori-diger' };
    var tbody = document.getElementById('urunler-table');

    if (liste.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#888;padding:2rem;">Sonuç bulunamadı.</td></tr>';
        return;
    }

    tbody.innerHTML = liste.map(function(urun) {
        var tarih = urun.tarih ? new Date(urun.tarih).toLocaleDateString('tr-TR') : '-';
        return '<tr>' +
            '<td>' + urun.id + '</td>' +
            '<td>' + urun.baslik + '</td>' +
            '<td><span class="kategori-badge ' + (renkler[urun.kategori] || '') + '">' + (etiketler[urun.kategori] || 'DİĞER') + '</span></td>' +
            '<td>' + Number(urun.fiyat).toLocaleString('tr-TR') + ' ₺</td>' +
            '<td>' + urun.satici + '</td>' +
            '<td>' + tarih + '</td>' +
            '<td>' +
                '<button class="btn-success" onclick="urunDuzenle(' + urun.id + ')">Düzenle</button> ' +
                '<button class="btn-danger" onclick="urunSil(' + urun.id + ')">Sil</button>' +
            '</td>' +
        '</tr>';
    }).join('');
}

// =====================
// FOTOĞRAF YÜKLEME
// =====================
function adminFotolariOku(input) {
    var dosyalar = Array.from(input.files);
    var onizleme = document.getElementById('admin-foto-onizleme');

    dosyalar.forEach(function(dosya) {
        if (dosya.size > 5 * 1024 * 1024) {
            showNotification(dosya.name + ' 5MB\'dan büyük!', 'warning');
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var base64 = e.target.result;
            var idx = adminYuklenenFotolar.length;
            adminYuklenenFotolar.push(base64);

            var item = document.createElement('div');
            item.className = 'foto-onizleme-item';
            item.id = 'admin-foto-item-' + idx;
            item.innerHTML =
                '<img src="' + base64 + '" alt="foto">' +
                '<button type="button" class="foto-sil" onclick="adminFotoyuSil(' + idx + ')">' +
                    '<i class="fas fa-times"></i>' +
                '</button>';
            onizleme.appendChild(item);
        };
        reader.readAsDataURL(dosya);
    });
}

function adminFotoyuSil(idx) {
    adminYuklenenFotolar[idx] = null;
    var item = document.getElementById('admin-foto-item-' + idx);
    if (item) item.remove();
}

// =====================
// AYARLAR
// =====================
function ayarlariKaydet() {
    var ayarlar = {
        baslik: document.getElementById('site-baslik').value,
        aciklama: document.getElementById('site-aciklama').value,
        telefon: document.getElementById('site-telefon').value,
        email: document.getElementById('site-email').value,
        adres: document.getElementById('site-adres').value
    };
    localStorage.setItem('site_ayarlar', JSON.stringify(ayarlar));
    showNotification('Ayarlar kaydedildi!', 'success');
}

function ayarlariSifirla() {
    if (!confirm('Ayarları sıfırlamak istediğinizden emin misiniz?')) return;
    localStorage.removeItem('site_ayarlar');
    location.reload();
}

// =====================
// ÇIKIŞ
// =====================
function cikisYap() {
    if (!confirm('Çıkış yapmak istediğinizden emin misiniz?')) return;
    sessionStorage.removeItem('admin_giris');
    window.location.href = 'index.html';
}

// =====================
// MODAL
// =====================
function modalKapat() {
    document.getElementById('urun-modal').style.display = 'none';
}

window.addEventListener('click', function(e) {
    var modal = document.getElementById('urun-modal');
    if (e.target === modal) modalKapat();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') modalKapat();
    if (e.ctrlKey && e.key === 'n') { e.preventDefault(); yeniUrunEkle(); }
});

// =====================
// BİLDİRİM
// =====================
function showNotification(mesaj, tip) {
    document.querySelectorAll('.notif').forEach(function(n) { n.remove(); });

    var renkler = {
        success: 'linear-gradient(135deg,#28a745,#20c997)',
        warning: 'linear-gradient(135deg,#ffc107,#fd7e14)',
        info: 'linear-gradient(135deg,#17a2b8,#6f42c1)'
    };

    var div = document.createElement('div');
    div.className = 'notif';
    div.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;background:' + (renkler[tip] || renkler.info) + ';color:white;padding:15px 20px;border-radius:10px;font-weight:600;box-shadow:0 5px 15px rgba(0,0,0,0.2);';
    div.textContent = mesaj;
    document.body.appendChild(div);
    setTimeout(function() { div.remove(); }, 3000);
}

// =====================
// YARDIMCI
// =====================
function varsayilanFoto(kategori) {
    var fotolar = {
        ev: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
        arsa: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
        araba: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
        diger: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    };
    return fotolar[kategori] || fotolar.diger;
}

// Sayfa yüklendiğinde ayarları yükle
window.addEventListener('load', function() {
    var s = localStorage.getItem('site_ayarlar');
    if (s) {
        try {
            var ayarlar = JSON.parse(s);
            if (document.getElementById('site-baslik')) document.getElementById('site-baslik').value = ayarlar.baslik || '';
            if (document.getElementById('site-aciklama')) document.getElementById('site-aciklama').value = ayarlar.aciklama || '';
            if (document.getElementById('site-telefon')) document.getElementById('site-telefon').value = ayarlar.telefon || '';
            if (document.getElementById('site-email')) document.getElementById('site-email').value = ayarlar.email || '';
            if (document.getElementById('site-adres')) document.getElementById('site-adres').value = ayarlar.adres || '';
        } catch(e) {}
    }
});