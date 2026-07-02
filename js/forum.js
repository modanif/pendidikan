const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    location.href = "login.html";
}

document.getElementById("welcome").innerHTML = `Halo, ${user.username} (${user.role})`;

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

                htmlContent += `
                    <div class="card comment-card mb-3">
                        <div class="card-body">
                            <h6 class="text-primary fw-bold mb-1">@${item.username}</h6>
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

if (user.role === "user") {
    document.getElementById("formKomentar").innerHTML = `
        <textarea id="komentar" class="form-control mb-2" rows="3" placeholder="Tulis komentar Anda di sini..."></textarea>
        <button onclick="kirimKomentar()" class="btn btn-send px-4">Kirim Komentar</button>
    `;
} else if (user.role === "admin") {
    document.getElementById("formKomentar").innerHTML = `
        <div class="alert alert-info py-2" style="font-size: 0.9rem;">
            <i class="fa-solid fa-user-shield"></i> Anda masuk sebagai Admin. Anda dapat membalas komentar langsung pada daftar di atas.
        </div>
    `;
}

async function kirimKomentar() {
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