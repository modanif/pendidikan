const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    document.getElementById("welcome").innerHTML = `Halo, ${user.username} (${user.role})`;
    document.getElementById("authButton").innerHTML = `
        <button onclick="logout()" class="btn btn-light btn-sm px-3 rounded-pill text-danger">
            <i class="fa-solid fa-right-from-bracket"></i> Logout
        </button>
    `;
} else {
    document.getElementById("welcome").innerHTML = `Selamat Datang di Forum Diskusi`;
    document.getElementById("authButton").innerHTML = `
        <a href="login.html" class="btn btn-light btn-sm px-4 rounded-pill text-primary fw-semibold text-decoration-none">
            <i class="fa-solid fa-right-to-bracket"></i> Login
        </a>
    `;
}

function logout() {
    localStorage.removeItem("user");
    location.href = "login.html";
}

async function loadKomentar() {
    try {
        const response = await fetch("/api/comments");
        const result = await response.json();
        
        const listKomentarDiv = document.getElementById("listKomentar");
        if (!listKomentarDiv) return;

        if (result.success && result.data) {
            let htmlContent = "";
            
            result.data.forEach(item => {
                let aksiAdmin = "";
                let tombolHapus = "";
                
                if (user) {
                    if (user.role === "admin" && !item.balasan) {
                        aksiAdmin = `
                            <div class="mt-3 p-2 bg-light rounded border">
                                <small class="text-muted d-block mb-1">Balas Komentar Ini:</small>
                                <div class="input-group input-group-sm">
                                    <input type="text" id="reply-${item.id}" class="form-control" placeholder="Tulis balasan admin...">
                                    <button onclick="kirimBalasan(${item.id})" class="btn btn-primary">Kirim</button>
                                </div>
                            </div>
                        `;
                    }

                    if (user.role === "admin" || user.username === item.username) {
                        tombolHapus = `
                            <button onclick="hapusKomentar(${item.id})" class="btn btn-link text-danger p-0 ms-2" title="Hapus Komentar">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        `;
                    }
                }

                htmlContent += `
                    <div class="card comment-card mb-3">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <h6 class="text-primary fw-bold mb-1">@${item.username}</h6>
                                ${tombolHapus}
                            </div>
                            <p class="card-text mb-2">${item.komentar}</p>
                            ${item.balasan ? `
                                <div class="bg-light p-2 rounded mt-2 border-start" style="border-left: 4px solid #4e54c8;">
                                    <strong class="text-dark d-block" style="font-size: 0.85rem;">Balasan Admin:</strong>
                                    <p class="mb-0 text-secondary" style="font-size: 0.9rem;">${item.balasan}</p>
                                </div>
                            ` : ""}
                            ${aksiAdmin}
                        </div>
                    </div>
                `;
            });

            listKomentarDiv.innerHTML = htmlContent || "<p class='text-muted text-center py-3'>Belum ada komentar.</p>";
        }
    } catch (err) {
        console.error("Gagal memuat komentar:", err);
    }
}

async function loadDaftarUser() {
    if (!user || user.role !== "admin") return;
    
    try {
        const response = await fetch("/api/get-users");
        const result = await response.json();
        
        const containerUser = document.getElementById("daftarUserAdmin");
        if (!containerUser) return;

        if (result.success && result.data) {
            let tabelHtml = `
                <div class="card mt-4 shadow-sm border-0" style="border-radius: 12px;">
                    <div class="card-body p-4">
                        <h5 class="fw-semibold text-dark mb-3"><i class="fa-solid fa-users-gear text-primary"></i> Manajamen Akun Terdaftar</h5>
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
        }
    } catch (err) {
        console.error("Gagal memuat daftar user:", err);
    }
}

if (user && user.role === "user") {
    document.getElementById("formKomentar").innerHTML = `
        <textarea id="komentar" class="form-control mb-2" rows="3" placeholder="Tulis komentar Anda di sini..."></textarea>
        <button onclick="kirimKomentar()" class="btn btn-send px-4">Kirim Komentar</button>
    `;
} else if (user && user.role === "admin") {
    document.getElementById("formKomentar").innerHTML = `
        <div class="alert alert-info py-2 mb-0" style="font-size: 0.9rem;">
            <i class="fa-solid fa-user-shield"></i> Anda masuk sebagai Admin. Anda dapat membalas atau menghapus komentar langsung pada daftar di atas.
        </div>
    `;
    loadDaftarUser();
} else {
    document.getElementById("formKomentar").innerHTML = `
        <div class="alert alert-warning py-3 text-center mb-0" style="font-size: 0.95rem;">
            <i class="fa-solid fa-lock"></i> Anda harus <a href="login.html" class="fw-bold text-decoration-none">Login</a> terlebih dahulu untuk dapat ikut berdiskusi dan mengirim komentar.
        </div>
    `;
}

async function kirimKomentar() {
    if (!user) return;
    const teksKomentar = document.getElementById("komentar").value;

    if (!teksKomentar.trim()) {
        alert("Isi komentar tidak boleh kosong");
        return;
    }

    try {
        const response = await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: user.username,
                komentar: teksKomentar
            })
        });

        const result = await response.json();

        if (result.success) {
            alert("Komentar berhasil dikirim!");
            document.getElementById("komentar").value = "";
            loadKomentar();
        } else {
            alert("Gagal mengirim: " + result.message);
        }
    } catch (err) {
        alert("Terjadi kesalahan sistem saat mengirim");
    }
}

async function kirimBalasan(idKomentar) {
    if (!user || user.role !== "admin") return;
    const teksBalasan = document.getElementById(`reply-${idKomentar}`).value;

    if (!teksBalasan.trim()) {
        alert("Balasan tidak boleh kosong");
        return;
    }

    try {
        const response = await fetch("/api/balasan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: idKomentar,
                balasan: teksBalasan
            })
        });

        const result = await response.json();

        if (result.success) {
            alert("Balasan berhasil dikirim!");
            loadKomentar();
        } else {
            alert("Gagal membalas: " + result.message);
        }
    } catch (err) {
        alert("Terjadi kesalahan sistem saat membalas");
    }
}

async function hapusKomentar(idKomentar) {
    if (!user) return;
    
    if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
        return;
    }

    try {
        const response = await fetch("/api/delete-comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: idKomentar,
                username: user.username,
                role: user.role
            })
        });

        const result = await response.json();

        if (result.success) {
            alert("Komentar berhasil dihapus!");
            loadKomentar();
        } else {
            alert("Gagal menghapus: " + result.message);
        }
    } catch (err) {
        alert("Terjadi kesalahan sistem saat menghapus");
    }
}

loadKomentar();

// Contoh cuplikan untuk bagian card di forum.js
htmlContent += `
    <div class="card comment-card mb-3">
        <div class="card-body">
            <h6 class="text-primary fw-bold">@${item.username}</h6>
            <p class="card-text">${item.komentar}</p>
        </div>
    </div>
`;