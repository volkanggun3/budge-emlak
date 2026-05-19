// =====================
// VERİ YÖNETİMİ
// =====================

// Varsayılan örnek ürünler
const ornekUrunler = [
    {
        id: 1779199334150,
        kategori: 'diger',
        baslik: 'MENEMEN YANIKKÖY 194 M2 OLAN TARLALARIMIZ',
        konum: 'Menemen, İzmir',
        fiyat: 720,
        aciklama: '',
        telefon: '+90 546 199 21 90',
        satici: 'VOLKAN GÜZELGÜN',
        tarih: new Date().toISOString(),
        foto: ''
    }
];

// Ürünleri localStorage'dan yükle, yoksa örnek verileri kullan
function urunleriYukle() {
    const kayitli = localStorage.getItem('site_urunler');
    if (kayitli) {
        try {
            const parsed = JSON.parse(kayitli);
            // Eski örnek ürünler varsa temizle (id 1,2,3 olanlar)
            const eskiIds = [1, 2, 3];
            const temiz = parsed.filter(u => !eskiIds.includes(u.id));
            if (temiz.length !== parsed.length) {
                localStorage.setItem('site_urunler', JSON.stringify(temiz));
                return temiz.length ? temiz : ornekUrunler;
            }
            return parsed;
        } catch(e) {
            return ornekUrunler;
        }
    }
    // İlk açılışta örnek verileri kaydet
    localStorage.setItem('site_urunler', JSON.stringify(ornekUrunler));
    return ornekUrunler;
}

let urunler = urunleriYukle();
let filtrelenmisUrunler = [...urunler];
let yuklenenFotolar = [];

// =====================
// SAYFA YÜKLENDİĞİNDE
// =====================
document.addEventListener('DOMContentLoaded', function () {
    urunleriGoster();
    kategoriSayilariGuncelle();
});

// =====================
// ÜRÜN GÖSTER
// =====================
function urunleriGoster(liste) {
    const grid = document.getElementById('urun-grid');
    if (!grid) return;

    const gosterilecek = liste !== undefined ? liste : filtrelenmisUrunler;

    if (gosterilecek.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#888;font-size:1.1rem;">Ürün bulunamadı.</div>';
        return;
    }

    grid.innerHTML = '';

    gosterilecek.forEach(function(urun) {
        const div = document.createElement('div');
        div.className = 'urun-kart';

        const etiketler = { ev: 'EV', arsa: 'ARSA', araba: 'ARABA', diger: 'DİĞER' };
        const foto = (urun.fotolar && urun.fotolar.length > 0) ? urun.fotolar[0] : (urun.foto || varsayilanFoto(urun.kategori));

        div.innerHTML =
            '<div class="urun-resim" style="background-image:url(\'' + foto + '\')">' +
                '<div class="kategori-badge">' + (etiketler[urun.kategori] || 'DİĞER') + '</div>' +
            '</div>' +
            '<div class="urun-icerik">' +
                '<div class="urun-baslik">' + urun.baslik + '</div>' +
                '<div class="urun-konum"><i class="fas fa-map-marker-alt"></i> ' + urun.konum + '</div>' +
                '<div class="urun-fiyat">' + Number(urun.fiyat).toLocaleString('tr-TR') + ' ₺</div>' +
                '<div class="urun-aciklama">' + urun.aciklama.substring(0, 100) + '...</div>' +
                '<div class="urun-iletisim">' +
                    '<a href="tel:' + urun.telefon + '" class="telefon-link"><i class="fas fa-phone"></i> ' + urun.telefon + '</a>' +
                    '<button class="btn-primary" onclick="urunDetay(' + urun.id + ')">Detay</button>' +
                '</div>' +
            '</div>';

        grid.appendChild(div);
    });
}

// =====================
// KATEGORİ SAYILARI
// =====================
function kategoriSayilariGuncelle() {
    var sayilar = { ev: 0, arsa: 0, araba: 0, diger: 0 };
    urunler.forEach(function(u) {
        if (sayilar[u.kategori] !== undefined) sayilar[u.kategori]++;
        else sayilar.diger++;
    });
    var evEl = document.getElementById('ev-sayisi');
    var arsaEl = document.getElementById('arsa-sayisi');
    var arabaEl = document.getElementById('araba-sayisi');
    var digerEl = document.getElementById('diger-sayisi');
    if (evEl) evEl.textContent = sayilar.ev + ' ürün';
    if (arsaEl) arsaEl.textContent = sayilar.arsa + ' ürün';
    if (arabaEl) arabaEl.textContent = sayilar.araba + ' ürün';
    if (digerEl) digerEl.textContent = sayilar.diger + ' ürün';
}

// =====================
// FİLTRE BUTONLARI
// =====================
function tumunuGoster() {
    filtrelenmisUrunler = [...urunler];
    urunleriGoster();
    filterBtnAktif('Tümü');
}

function kategoriFiltre(kategori) {
    filtrelenmisUrunler = urunler.filter(function(u) { return u.kategori === kategori; });
    urunleriGoster();
    filterBtnAktif(kategori);
    document.getElementById('urunler').scrollIntoView({ behavior: 'smooth' });
}

function filterBtnAktif(secilen) {
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.classList.remove('active');
        var txt = btn.textContent.trim().toLowerCase();
        if (txt === secilen.toLowerCase() || (secilen === 'Tümü' && txt === 'tümü')) {
            btn.classList.add('active');
        }
    });
}

// =====================
// ARAMA
// =====================
function aramaYap() {
    var kategori = document.getElementById('kategori').value;
    var arama = document.getElementById('arama').value.toLowerCase();
    var minF = parseInt(document.getElementById('min-fiyat').value) || 0;
    var maxF = parseInt(document.getElementById('max-fiyat').value) || Infinity;

    filtrelenmisUrunler = urunler.filter(function(u) {
        var katUygun = !kategori || u.kategori === kategori;
        var aramaUygun = !arama || u.baslik.toLowerCase().includes(arama) || u.konum.toLowerCase().includes(arama);
        var fiyatUygun = u.fiyat >= minF && u.fiyat <= maxF;
        return katUygun && aramaUygun && fiyatUygun;
    });

    urunleriGoster();
    document.getElementById('urunler').scrollIntoView({ behavior: 'smooth' });
}

// =====================
// ÜRÜN DETAY
// =====================
function urunDetay(id) {
    var urun = urunler.find(function(u) { return u.id === id; });
    if (!urun) return;
    alert(
        urun.baslik + '\n' +
        'Konum: ' + urun.konum + '\n' +
        'Fiyat: ' + Number(urun.fiyat).toLocaleString('tr-TR') + ' ₺\n\n' +
        urun.aciklama + '\n\n' +
        'Satıcı: ' + urun.satici + '\n' +
        'Tel: ' + urun.telefon
    );
}

// =====================
// MODAL
// =====================
function urunEkleModal() {
    yuklenenFotolar = [];
    var onizleme = document.getElementById('foto-onizleme');
    if (onizleme) onizleme.innerHTML = '';
    document.getElementById('urun-modal').style.display = 'block';
}

function modalKapat() {
    document.getElementById('urun-modal').style.display = 'none';
}

window.addEventListener('click', function(e) {
    var modal = document.getElementById('urun-modal');
    if (e.target === modal) modalKapat();
});

// =====================
// FOTOĞRAF YÜKLEME
// =====================
function fotolariOku(input) {
    var dosyalar = Array.from(input.files);
    var onizleme = document.getElementById('foto-onizleme');

    dosyalar.forEach(function(dosya) {
        if (dosya.size > 5 * 1024 * 1024) {
            alert(dosya.name + ' 5MB\'dan büyük, atlandı.');
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var base64 = e.target.result;
            var idx = yuklenenFotolar.length;
            yuklenenFotolar.push(base64);

            var item = document.createElement('div');
            item.className = 'foto-onizleme-item';
            item.id = 'foto-item-' + idx;
            item.innerHTML =
                '<img src="' + base64 + '" alt="foto">' +
                '<button type="button" class="foto-sil" onclick="fotoyuSil(' + idx + ')">' +
                    '<i class="fas fa-times"></i>' +
                '</button>';
            onizleme.appendChild(item);
        };
        reader.readAsDataURL(dosya);
    });
}

function fotoyuSil(idx) {
    yuklenenFotolar[idx] = null;
    var item = document.getElementById('foto-item-' + idx);
    if (item) item.remove();
}

// =====================
// ÜRÜN EKLE
// =====================
function urunEkle(event) {
    event.preventDefault();
    var form = event.target;
    var fd = new FormData(form);

    var gecerliFotolar = yuklenenFotolar.filter(function(f) { return f !== null; });

    var yeniUrun = {
        id: Date.now(),
        kategori: fd.get('kategori'),
        baslik: fd.get('baslik'),
        konum: fd.get('konum'),
        fiyat: parseInt(fd.get('fiyat')),
        aciklama: fd.get('aciklama'),
        telefon: fd.get('telefon'),
        satici: fd.get('satici'),
        tarih: new Date().toISOString(),
        fotolar: gecerliFotolar.length > 0 ? gecerliFotolar : null,
        foto: gecerliFotolar.length > 0 ? gecerliFotolar[0] : varsayilanFoto(fd.get('kategori'))
    };

    urunler.unshift(yeniUrun);
    filtrelenmisUrunler = [...urunler];
    localStorage.setItem('site_urunler', JSON.stringify(urunler));

    urunleriGoster();
    kategoriSayilariGuncelle();

    modalKapat();
    form.reset();
    yuklenenFotolar = [];
    document.getElementById('foto-onizleme').innerHTML = '';

    alert('Ürün başarıyla eklendi!');
}

// =====================
// İLETİŞİM FORMU
// =====================
function mesajGonder(event) {
    event.preventDefault();
    alert('Mesajınız gönderildi! En kısa sürede dönüş yapacağız.');
    event.target.reset();
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

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') modalKapat();
});