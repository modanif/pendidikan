const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    location.href = "login.html";
}

document.getElementById("welcome").innerHTML = `Halo, ${user.username} (${user.role})`;

function logout() {
    localStorage.removeItem("user");
    location.href = "login.html";
}

if (user.role === "user") {
    document.getElementById("formKomentar").innerHTML = `
        <textarea id="komentar" class="form-control mb-2"></textarea>
        <button onclick="kirimKomentar()" class="btn btn-success">Kirim Komentar</button>
        <hr>
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
            alert("Komentar berhasil dikirim");
            document.getElementById("komentar").value = "";
            loadKomentar();
        } else {
            alert("Gagal mengirim: " + result.message);
        }
    } catch (err) {
        alert("Terjadi kesalahan sistem");
    }
}

async function loadKomentar() {
    try {
        const response = await fetch("/api/comments");
        const result = await response.json();
        
        if (result.success) {
            console.log(result.data);
        }
    } catch (err) {
        console.error(err);
    }
}

loadKomentar();