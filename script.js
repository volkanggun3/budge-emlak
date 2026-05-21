// =====================
// VERİ YÖNETİMİ
// =====================

// Varsayılan örnek ürünler
const ornekUrunler = [
    {
        id: 1779225232676,
        kategori: 'diger',
        baslik: 'yeni bağarası 322 m2',
        konum: 'İZMİR foça',
        fiyat: 900,
        aciklama: 'Foça Yenibağarası\'nda, hem yatırımlık hem de hemen kullanıma uygun, bölgenin en kupon konumunda bulunan yerimiz acil ihtiyaçtan dolayı piyasa değerinin altında satılıktır.\nÖne Çıkan Özellikleri:\n araçla bile içine kadar rahatça girilebilir durumdadır.\nHazır Konum: Çevresinde aktif yaşam vardır. Uydu haritasında da göründüğü gibi Delice Doğa Evi ve Bizim Taş Ev gibi lüks yapıların hemen komşusudur.\nKullanım Amacı: Tiny House (tekerlekli ev), karavan koymaya, hafta sonu bahçesi yapmaya veya kısa-orta vadede yüksek prim yapacak bir yatırım arayanlar için kaçırılmayacak fırsattır.',
        satici: 'VOLKAN GÜZELGÜN',
        telefon: '05461992190',
        fotolar: [
            'https://res.cloudinary.com/duvwm9dmf/image/upload/v1779225255/PHOTO-2026-05-19-23-50-53_5_zfjjdn.jpg',
            'https://res.cloudinary.com/duvwm9dmf/image/upload/v1779225255/PHOTO-2026-05-19-23-50-53_3_ewrovc.jpg',
            'https://res.cloudinary.com/duvwm9dmf/image/upload/v1779225255/PHOTO-2026-05-19-23-50-53_7_agixs3.jpg'
        ],
        foto: 'https://res.cloudinary.com/duvwm9dmf/image/upload/v1779225255/PHOTO-2026-05-19-23-50-53_5_zfjjdn.jpg',
        tarih: '2026-05-19T21:13:52.676Z'
    },
    {
        id: 1779215342396,
        kategori: 'diger',
        baslik: 'MENEMEN GÖKTEPE',
        konum: 'İZMİR MENEMEN',
        fiyat: 2,
        aciklama: 'Menemen Göktepe\'de Satılık 177m2 ve 300m2 yerlerimiz\nMenemen Göktepe mevkiinde, 300 ve 177 büyüklüğünde, tarlalarımız satılıktır.\nDüzenli yapılaşmanın bulunduğu, villaların yoğun olduğu, her geçen gün değer kazanan bir lokasyondadır.\nVilla yatırımı veya kendi yaşam alanını oluşturmak isteyenler için kaçırılmayacak bir fırsattır.\n177M2 670     300   1650',
        satici: 'VOLKAN GÜZELGÜN',
        telefon: '05461992190',
        fotolar: [
            'https://res.cloudinary.com/duvwm9dmf/image/upload/v1779213556/PHOTO-2026-05-17-16-27-33_gwl33s.jpg'
        ],
        foto: 'https://res.cloudinary.com/duvwm9dmf/image/upload/v1779213556/PHOTO-2026-05-17-16-27-33_gwl33s.jpg',
        tarih: '2026-05-19T18:29:02.396Z'
    },
    {
        id: 1779205613414,
        kategori: 'diger',
        baslik: 'EMİRALEM PİKNİK ALANI KARŞISI BANKO YER',
        konum: 'İZMİR MENEMEN',
        fiyat: 770,
        aciklama: 'EMİRALEM PİKNİK ALANI KARŞISI BANKO YER\n\n255 m2  890\n205 m2 780',
        satici: 'VOLKAN GÜZELGÜN',
        telefon: '05461992190',
        fotolar: [
            'https://res.cloudinary.com/duvwm9dmf/image/upload/f_auto,q_auto/PHOTO-2026-05-17-19-45-10_4_u8gkpb',
            'https://res.cloudinary.com/duvwm9dmf/image/upload/f_auto,q_auto/PHOTO-2026-05-17-19-45-09_1_ql0eks',
            'https://res.cloudinary.com/duvwm9dmf/image/upload/v1779212801/PHOTO-2026-05-17-19-45-09_dxvbcf.jpg',
            'https://res.cloudinary.com/duvwm9dmf/image/upload/v1779212801/PHOTO-2026-05-17-19-45-10_ymvi0w.jpg'
        ],
        foto: 'https://res.cloudinary.com/duvwm9dmf/image/upload/f_auto,q_auto/PHOTO-2026-05-17-19-45-10_4_u8gkpb',
        tarih: '2026-05-19T15:46:53.414Z'
    },
    {
        id: 1779199334150,
        kategori: 'diger',
        baslik: 'MENEMEN YANIKKÖY 194 M2 OLAN TARLALARIMIZ',
        konum: 'İZMİR MENEMEN',
        fiyat: 720,
        aciklama: 'İZMİR MENEMEN',
        satici: 'VOLKAN GÜZELGÜN',
        telefon: '05461992190',
        fotolar: [],
        foto: '',
        tarih: '2026-05-19T00:00:00.000Z'
    }
];

// Ürünleri yükle - her zaman ornekUrunler'i kullan (localStorage'ı yoksay)
function urunleriYukle() {
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
                '<div class="paylasim-alani">' +
                    '<button class="paylas-btn" onclick="event.stopPropagation();paylasimAc(' + urun.id + ', this)"><i class="fas fa-share-alt"></i> Paylaş</button>' +
                    '<div class="paylas-menu" id="paylas-' + urun.id + '" style="display:none;">' +
                        '<a class="paylas-item" href="https://wa.me/?text=' + encodeURIComponent(urun.baslik + ' - ' + Number(urun.fiyat).toLocaleString('tr-TR') + ' ₺ - ' + urun.konum + ' - ' + window.location.href) + '" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a>' +
                        '<a class="paylas-item" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href) + '" target="_blank"><i class="fab fa-facebook"></i> Facebook</a>' +
                        '<button class="paylas-item" onclick="linkkopyala(\'' + urun.id + '\')"><i class="fas fa-link"></i> Linki Kopyala</button>' +
                    '</div>' +
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
var aktifSliderIndex = 0;
var aktifSliderResimler = [];

function urunDetay(id) {
    var urun = urunler.find(function(u) { return u.id === id; });
    if (!urun) return;

    // Başlık ve bilgiler
    document.getElementById('detay-baslik').textContent = urun.baslik;
    document.getElementById('detay-konum').textContent = urun.konum;
    document.getElementById('detay-fiyat').textContent = Number(urun.fiyat).toLocaleString('tr-TR') + ' ₺';
    document.getElementById('detay-aciklama').textContent = urun.aciklama || '-';
    document.getElementById('detay-satici').textContent = urun.satici;

    var tel = urun.telefon || '';
    document.getElementById('detay-telefon').href = 'tel:' + tel;
    document.getElementById('detay-telefon').innerHTML = '<i class="fas fa-phone"></i> ' + tel;
    document.getElementById('detay-whatsapp').href = 'https://wa.me/' + tel.replace(/[^0-9]/g, '');

    // Paylaşım menüsü içeriğini güncelle
    var paylasMesaj = urun.baslik + ' - ' + Number(urun.fiyat).toLocaleString('tr-TR') + ' ₺ - ' + urun.konum + '\n' + window.location.href;
    var paylasMenu = document.getElementById('detay-paylas-menu');
    paylasMenu.style.display = 'none';
    paylasMenu.innerHTML =
        '<a class="paylas-item" href="https://wa.me/?text=' + encodeURIComponent(paylasMesaj) + '" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp ile Paylaş</a>' +
        '<a class="paylas-item" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href) + '" target="_blank"><i class="fab fa-facebook"></i> Facebook ile Paylaş</a>' +
        '<button class="paylas-item" onclick="linkkopyala(\'detay\')"><i class="fas fa-link"></i> Linki Kopyala</button>';

    // Resimler
    aktifSliderResimler = [];
    if (urun.fotolar && urun.fotolar.length > 0) {
        aktifSliderResimler = urun.fotolar.filter(Boolean);
    } else if (urun.foto) {
        aktifSliderResimler = [urun.foto];
    } else {
        aktifSliderResimler = [varsayilanFoto(urun.kategori)];
    }

    aktifSliderIndex = 0;
    sliderRender();

    document.getElementById('detay-modal').style.display = 'block';
}

function sliderRender() {
    var resimlerDiv = document.getElementById('detay-slider-resimler');
    var noktalarDiv = document.getElementById('detay-slider-noktalar');
    var oklar = document.querySelectorAll('.detay-slider-ok');

    resimlerDiv.innerHTML = '';
    noktalarDiv.innerHTML = '';

    aktifSliderResimler.forEach(function(src, i) {
        var img = document.createElement('img');
        img.src = src;
        img.alt = 'Resim ' + (i + 1);
        if (i === aktifSliderIndex) img.classList.add('aktif');
        resimlerDiv.appendChild(img);

        var nokta = document.createElement('button');
        nokta.className = 'detay-nokta' + (i === aktifSliderIndex ? ' aktif' : '');
        nokta.onclick = (function(idx) { return function() { sliderGo(idx); }; })(i);
        noktalarDiv.appendChild(nokta);
    });

    // Tek resimse okları gizle
    oklar.forEach(function(ok) {
        ok.style.display = aktifSliderResimler.length > 1 ? 'flex' : 'none';
    });
    noktalarDiv.style.display = aktifSliderResimler.length > 1 ? 'flex' : 'none';
}

function sliderGit(yon) {
    aktifSliderIndex = (aktifSliderIndex + yon + aktifSliderResimler.length) % aktifSliderResimler.length;
    sliderGo(aktifSliderIndex);
}

function sliderGo(idx) {
    aktifSliderIndex = idx;
    var resimler = document.querySelectorAll('#detay-slider-resimler img');
    var noktalar = document.querySelectorAll('.detay-nokta');
    resimler.forEach(function(img, i) { img.classList.toggle('aktif', i === idx); });
    noktalar.forEach(function(n, i) { n.classList.toggle('aktif', i === idx); });
}

function detayKapat() {
    document.getElementById('detay-modal').style.display = 'none';
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
    if (e.key === 'Escape') { modalKapat(); detayKapat(); }
});

window.addEventListener('click', function(e) {
    var modal = document.getElementById('urun-modal');
    if (e.target === modal) modalKapat();
    var detayModal = document.getElementById('detay-modal');
    if (e.target === detayModal) detayKapat();
});

function detayPaylasimAc() {
    var menu = document.getElementById('detay-paylas-menu');
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// =====================
// PAYLAŞIM
// =====================
function paylasimAc(id, btn) {
    // Diğer açık menüleri kapat
    document.querySelectorAll('.paylas-menu').forEach(function(m) {
        if (m.id !== 'paylas-' + id) m.style.display = 'none';
    });
    var menu = document.getElementById('paylas-' + id);
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
}

function linkkopyala(id) {
    var url = window.location.href.split('#')[0] + '#urunler';
    navigator.clipboard.writeText(url).then(function() {
        showKopyalandi();
    }).catch(function() {
        // Eski tarayıcılar için
        var ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showKopyalandi();
    });
    var menu = document.getElementById('paylas-' + id);
    if (menu) menu.style.display = 'none';
}

function showKopyalandi() {
    var t = document.getElementById('kopyalandi-toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'kopyalandi-toast';
        t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:12px 24px;border-radius:25px;font-weight:600;z-index:9999;font-size:0.95rem;';
        document.body.appendChild(t);
    }
    t.textContent = '✓ Link kopyalandı!';
    t.style.display = 'block';
    setTimeout(function() { t.style.display = 'none'; }, 2500);
}

// Dışarı tıklayınca paylaşım menüsünü kapat
document.addEventListener('click', function(e) {
    if (!e.target.closest('.paylasim-alani')) {
        document.querySelectorAll('.paylas-menu').forEach(function(m) {
            m.style.display = 'none';
        });
    }
});

// Hamburger menü
function menuToggle() {
    var nav = document.getElementById('main-nav');
    var btn = document.getElementById('hamburger-btn');
    nav.classList.toggle('acik');
    btn.innerHTML = nav.classList.contains('acik')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
}

// Menü linkine tıklayınca kapat
document.querySelectorAll('#main-nav a').forEach(function(a) {
    a.addEventListener('click', function() {
        var nav = document.getElementById('main-nav');
        nav.classList.remove('acik');
        document.getElementById('hamburger-btn').innerHTML = '<i class="fas fa-bars"></i>';
    });
});