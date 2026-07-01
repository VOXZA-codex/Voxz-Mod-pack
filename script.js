// Cek data addon
if (typeof daftarAddon === 'undefined') {
    console.warn("⚠️ File data_addons.js belum dimuat!");
}

// Tampilkan addon
function tampilkanAddon(data = daftarAddon) {
    const wadah = document.getElementById('daftarAddon');
    if (!wadah) return;
    wadah.innerHTML = '';

    data.forEach(addon => {
        const kartu = document.createElement('div');
        kartu.className = 'kartu-addon';
        kartu.innerHTML = `
            <img src="${addon.gambar}" alt="${addon.nama}" loading="lazy">
            <div class="info">
                <h3>${addon.nama}</h3>
                <p class="pembuat">Upload: ${addon.pembuat}</p>
                <p class="harga">✅ GRATIS</p>
                <div class="aksi">
                    <button class="btn btn-detail" onclick="lihatDetail(${addon.id})">Detail</button>
                    <button class="btn btn-unduh" onclick="unduhAddon('${addon.linkUnduh}')">Unduh</button>
                </div>
            </div>
        `;
        wadah.appendChild(kartu);
    });
}

window.addEventListener('load', tampilkanAddon);

// Filter & Cari
document.addEventListener('DOMContentLoaded', () => {
    const filter = document.getElementById('filterKategori');
    const cari = document.getElementById('cariInput');

    if (filter) {
        filter.addEventListener('change', () => {
            const pilih = filter.value;
            const hasil = pilih === 'semua' ? daftarAddon : daftarAddon.filter(a => a.kategori === pilih);
            tampilkanAddon(hasil);
        });
    }

    if (cari) {
        cari.addEventListener('input', () => {
            const kata = cari.value.toLowerCase();
            const hasil = daftarAddon.filter(a => a.nama.toLowerCase().includes(kata));
            tampilkanAddon(hasil);
        });
    }

    // Fungsi Menu Samping
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
