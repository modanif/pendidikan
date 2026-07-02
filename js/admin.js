const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {
    alert("Akses ditolak! Halaman ini hanya untuk Admin.");
    location.href = "index.html";
} else {
    document.getElementById("adminWelcome").innerHTML = `Log masuk sebagai: ${user.username}`;
    loadDaftarUser();
}

async function loadDaftarUser() {
    try {
        const response = await fetch("/api/get-users");
        const result = await response.json();
        
        const containerUser = document.getElementById("daftarUserAdmin");
        if (!containerUser) return;

        if (result.success && result.data) {
            let tabelHtml = `
                <div class="card shadow-sm border-0" style="border-radius: 12px;">
                    <div class="card-body p-4">
                        <h5 class="fw-semibold text-dark mb-3"><i class="fa-solid fa-users text-primary"></i> Daftar Akun Terdaftar</h5>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0" style="font-size: 0.9rem;">
                                <thead class="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Role</th>
                                        <th class="text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
            `;

            result.data.forEach(u => {
                const badgeColor = u.role === "admin" ? "bg-danger" : "bg-secondary";
                
                let tombolPromosi = "";
                if (u.role !== "admin") {
                    tombolPromosi = `
                        <button onclick="ubahKeAdmin(${u.id}, '${u.username}')" class="btn btn-sm btn-outline-success me-2 py-1 px-2" title="Jadikan Admin">
                            <i class="fa-solid fa-user-shield"></i> Jadi Admin
                        </button>
                    `;
                }

                tabelHtml += `
                    <tr>
                        <td class="text-muted">#${u.id}</td>
                        <td class="fw-bold text-secondary">@${u.username}</td>
                        <td><span class="badge ${badgeColor}">${u.role}</span></td>
                        <td class="text-center">
                            ${tombolPromosi}
                            <button onclick="hapusUser(${u.id}, '${u.username}')" class="btn btn-sm btn-outline-danger py-1 px-2" title="Hapus Pengguna">
                                <i class="fa-solid fa-trash-can"></i> Hapus
                            </button>
                        </td>
                    </tr>
                `;
            });

            tabelHtml += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            containerUser.innerHTML = tabelHtml;
        } else {
            containerUser.innerHTML = `<div class='alert alert-danger'>Gagal memuat data pengguna. Respon Server: <strong>${result.message || 'Tidak ada pesan error detail'}</strong></div>`;
        }
    } catch (err) {
        containerUser.innerHTML = `<div class='alert alert-danger'>Terjadi kesalahan koneksi sistem: <strong>${err.message}</strong></div>`;
    }
}

async function ubahKeAdmin(idUser, username) {
    if (!confirm(`Apakah Anda yakin ingin menjadikan @${username} sebagai Admin?`)) return;

    try {
        const response = await fetch("/api/manage-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "promote", id: idUser })
        });
        const result = await response.json();

        if (result.success) {
            alert(`@${username} sekarang resmi menjadi Admin!`);
            loadDaftarUser();
        } else {
            alert("Gagal mengubah status: " + result.message);
        }
    } catch (err) {
        alert("Terjadi kesalahan koneksi saat memproses data.");
    }
}

async function hapusUser(idUser, username) {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun @${username} secara permanen?`)) return;

    try {
        const response = await fetch("/api/manage-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete", id: idUser })
        });
        const result = await response.json();

        if (result.success) {
            alert(`Akun @${username} berhasil dihapus.`);
            loadDaftarUser();
        } else {
            alert("Gagal menghapus akun: " + result.message);
        }
    } catch (err) {
        alert("Terjadi kesalahan koneksi saat memproses data.");
    }
}