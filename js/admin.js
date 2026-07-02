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
                                        <th>Tanggal Registrasi</th>
                                    </tr>
                                </thead>
                                <tbody>
            `;

            result.data.forEach(u => {
                const badgeColor = u.role === "admin" ? "bg-danger" : "bg-secondary";
                const tanggal = new Date(u.created_at).toLocaleDateString("id-ID", {
                    year: 'numeric', month: 'long', day: 'numeric'
                });

                tabelHtml += `
                    <tr>
                        <td class="text-muted">#${u.id}</td>
                        <td class="fw-bold text-secondary">@${u.username}</td>
                        <td><span class="badge ${badgeColor}">${u.role}</span></td>
                        <td class="text-muted">${tanggal}</td>
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
            containerUser.innerHTML = "<div class='alert alert-danger'>Gagal memuat data pengguna.</div>";
        }
    } catch (err) {
        console.error("Gagal memuat daftar user:", err);
    }
}