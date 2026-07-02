const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    location.href = "login.html";
}

document.getElementById("welcome").innerHTML = `Halo, ${user.username} (${user.role})`;

function logout() {
    localStorage.removeItem("user");
    location.href = "login.html";
}

// Fungsi utama untuk memuat dan menampilkan komentar ke layar (di bagian atas)
async function loadKomentar() {
    try {
        const response = await fetch("/api/comments");
        const result = await response.json();
        
        const listKomentarDiv = document.getElementById("listKomentar");
        if (!listKomentarDiv) return;

        if (result.success && result.data) {
            let htmlContent = "";
            
            result.data.forEach(item => {
                htmlContent += `
                    <div class="card mb-3 shadow-sm">
                        <div class="card-body">
                            <h6 class="card-subtitle mb-2 text-muted">@${item.username}</h6>
                            <p class="card-text">${item.komentar}</p>
                            ${item.balasan ? `
                                <div class="bg-light p-2 rounded mt-2 border-left" style="border-left: 4px solid #007bff;">
                                    <strong>Balasan Admin:</strong>
                                    <p class="mb-0 text-secondary">${item.balasan}</p>
                                </div>
                            ` : ""}
                        </div>
                    </div>
                `;
            });

            listKomentarDiv.innerHTML = htmlContent || "<p class='text-muted text-center'>Belum ada komentar.</p>";
        }
    } catch (err) {
        console.error("Gagal memuat komentar:", err);
    }
}

// Menyiapkan kotak input pengiriman komentar (ditaruh di bawah)
if (user.role === "user") {
    document.getElementById("formKomentar").innerHTML = `
        <hr class="my-4">
        <h4>Kirim Komentar Baru</h4>
        <textarea id="komentar" class="form-control mb-2" rows="3" placeholder="Tulis komentar Anda di sini..."></textarea>
        <button onclick="kirimKomentar()" class="btn btn-success">Kirim Komentar</button>
    `;
}

// Fungsi untuk mengirim komentar baru ke backend
async function kirimKomentar() {
    const teksKomentar = document.getElementById("komentar").value;

    if (!teksKomentar.trim()) {
        alert("Isi komentar tidak boleh kosong");
        return;
    }

    try {
        const response = await fetch("/api/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: user.username,
                komentar: teksKomentar
            })
        });

        const result = await response.json();

        if (result.success) {
            alert("Komentar berhasil dikirim!");
            document.getElementById("komentar").value = "";
            loadKomentar(); // Segera muat ulang agar komentar baru muncul paling atas
        } else {
            alert("Gagal mengirim: " + result.message);
        }
    } catch (err) {
        alert("Terjadi kesalahan sistem saat mengirim");
    }
}

// Jalankan fungsi memuat data saat halaman pertama kali dibuka
loadKomentar();