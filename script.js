// Cek data addon
if (typeof daftarAddon === 'undefined') {
    console.warn("⚠️ File data_addons.js belum dimuat!");
}

// Tampilkan addon dengan fitur Like & Urutan
function tampilkanAddon(data = daftarAddon, urutBerdasarkanLike = false) {
    const wadah = document.getElementById('daftarAddon');
    if (!wadah) return;
    wadah.innerHTML = '';

    // Salin data dulu biar tidak mengubah file asli
    let dataSiap = [...data];

    // Jika Semua Kategori: Urut dari Terbanyak Like
    if (urutBerdasarkanLike) {
        dataSiap.sort((a, b) => {
            const likeA = Number(localStorage.getItem(`like_${a.id}`) || 0);
            const likeB = Number(localStorage.getItem(`like_${b.id}`) || 0);
            return likeB - likeA;
        });
    }

    dataSiap.forEach(addon => {
        let jumlahLike = localStorage.getItem(`like_${addon.id}`) || 0;
        let sudahSuka = localStorage.getItem(`suka_${addon.id}`) === 'ya';

        const kartu = document.createElement('div');
        kartu.className = 'kartu-addon';
        kartu.innerHTML = `
            <img src="${addon.gambar}" alt="${addon.nama}" loading="lazy">
            <div class="info">
                <h3>${addon.nama}</h3>
                <p class="pembuat">Upload: ${addon.pembuat}</p>
                <p class="harga">✅ GRATIS</p>

                <div style="margin: 10px 0;">
                    <button class="btn-like" data-id="${addon.id}" style="background:none; border:none; cursor:pointer; font-size:16px; display:flex; align-items:center; gap:5px; padding:6px 12px; border-radius:20px; background:var(--abu-terang) !important; color:${sudahSuka ? 'var(--hijau)' : 'var(--putih)'};">
                        ${sudahSuka ? '❤️' : '🤍'} <span class="angka-like">${jumlahLike}</span>
                    </button>
                </div>

                <div class="aksi">
                    <button class="btn btn-detail" onclick="lihatDetail(${addon.id})">Detail</button>
                    <button class="btn btn-unduh" onclick="unduhAddon('${addon.linkUnduh}')">Unduh</button>
                </div>
            </div>
        `;
        wadah.appendChild(kartu);
    });
}

window.addEventListener('load', () => {
    tampilkanAddon(daftarAddon, true);
});

document.addEventListener('DOMContentLoaded', () => {
    const filter = document.getElementById('filterKategori');
    const cari = document.getElementById('cariInput');

    if (filter) {
        filter.addEventListener('change', () => {
            const pilih = filter.value;
            if (pilih === 'semua') {
                tampilkanAddon(daftarAddon, true);
            } else {
                const hasil = daftarAddon.filter(a => a.kategori === pilih);
                tampilkanAddon(hasil, false);
            }
        });
    }

    if (cari) {
        cari.addEventListener('input', () => {
            const kata = cari.value.toLowerCase();
            const hasil = daftarAddon.filter(a => 
                a.nama.toLowerCase().includes(kata) ||
                a.pembuat.toLowerCase().includes(kata)
            );
            tampilkanAddon(hasil, true);
        });
    }

    // Menu Samping
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('buka');
            overlay.classList.toggle('buka');
        });
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('buka');
            overlay.classList.remove('buka');
        });
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('buka');
                overlay.classList.remove('buka');
            });
        });
    }

    // Klik Like + Jeda 1 Menit sebelum geser posisi
    document.addEventListener('click', function(e) {
        const tombol = e.target.closest('.btn-like');
        if (!tombol) return;

        const id = tombol.dataset.id;
        const angka = tombol.querySelector('.angka-like');
        
        let jumlah = Number(localStorage.getItem(`like_${id}`) || 0);
        let status = localStorage.getItem(`suka_${id}`) === 'ya';

        if (!status) {
            jumlah++;
            localStorage.setItem(`suka_${id}`, 'ya');
            tombol.innerHTML = `❤️ <span class="angka-like">${jumlah}</span>`;
            tombol.style.color = 'var(--hijau)';
        } else {
            jumlah--;
            localStorage.setItem(`suka_${id}`, 'tidak');
            tombol.innerHTML = `🤍 <span class="angka-like">${jumlah}</span>`;
            tombol.style.color = 'var(--putih)';
        }

        localStorage.setItem(`like_${id}`, jumlah);
        angka.textContent = jumlah;

        // ✅ JEDA 1 MENIT (60.000 milidetik) baru urut ulang
        if (filter.value === 'semua') {
            setTimeout(() => {
                tampilkanAddon(daftarAddon, true);
            }, 60000); // 60 detik = 1 menit
        }
    });
});

// Fungsi Detail & Unduh
function lihatDetail(id) {
    const addon = daftarAddon.find(a => a.id === id);
    if (!addon) return;
    alert(`📝 DETAIL ADDON\n\nNama: ${addon.nama}\nUpload: ${addon.pembuat}\nKategori: ${addon.kategori}\nKompatibel: ${addon.kompatibel}\nUkuran: ${addon.ukuran}\n\nDeskripsi:\n${addon.deskripsi}`);
}

function unduhAddon(link) {
    if (!link) return alert("❌ Link unduh belum tersedia!");
    if (confirm('🔗 Buka halaman unduhan?')) {
        window.open(link, '_blank');
    }
}
// === ARAHKAN OTOMATIS DARI LINK KHUSUS ===
function cekLinkUnduh() {
  const urlParams = new URLSearchParams(window.location.search);
  const idAddon = urlParams.get('dl');

  if (!idAddon) return; // Tidak ada perintah, lanjut biasa

  // Cari data addon yang sesuai
  const addon = daftarAddon.find(a => a.id === idAddon);
  if (!addon) {
    alert("❌ Addon tidak ditemukan!");
    return;
  }

  // Tampilkan info sebentar lalu arahkan
  alert(`✅ Sedang membuka unduh:\n${addon.nama}`);
  setTimeout(() => {
    window.open(addon.linkUnduh, '_blank');
    // Bersihkan link di browser biar rapi
    history.replaceState({}, document.title, window.location.pathname);
  }, 800);
}

// Jalankan saat halaman siap
window.addEventListener('load', cekLinkUnduh);

// SALIN INI SAJA, TIDAK PERLU DIUBAH
function cekLinkUnduh(){const u=new URLSearchParams(window.location.search),d=u.get("dl");if(!d)return;const a=daftarAddon.find(x=>x.id==d);if(!a)return void alert("❌ Addon tidak ada!");alert(`✅ Buka: ${a.nama}`),setTimeout(()=>{window.open(a.linkUnduh,"_blank"),history.replaceState({},"",window.location.pathname)},700)}window.onload=cekLinkUnduh;
