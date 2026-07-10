const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const frame = new Image();
frame.src = "twibbon mpls.png";

let userImage = null;

let offsetX = 0;
let offsetY = 0;
let zoom = 1;

// =====================
// Upload Foto
// =====================

document.getElementById("foto").addEventListener("change", function(e){

    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(ev){

        userImage = new Image();

        userImage.onload = function(){
            drawCanvas();
        };

        userImage.src = ev.target.result;
    };

    reader.readAsDataURL(file);
});

// =====================
// Slider
// =====================

document.getElementById("moveX").addEventListener("input", function(){
    offsetX = parseInt(this.value);
    drawCanvas();
});

document.getElementById("moveY").addEventListener("input", function(){
    offsetY = parseInt(this.value);
    drawCanvas();
});

document.getElementById("zoom").addEventListener("input", function(){
    zoom = parseInt(this.value) / 100;
    drawCanvas();
});

// =====================
// Nama & Sekolah
// =====================

document.getElementById("nama")
.addEventListener("input", drawCanvas);

document.getElementById("sekolah")
.addEventListener("input", drawCanvas);

// =====================
// Render Canvas
// =====================

function drawCanvas(){

    ctx.clearRect(0,0,1080,1080);

    // FOTO DULU
    if(userImage){

        ctx.save();

        // POSISI LUBANG FOTO
   const centerX = 412;
const centerY = 455;
const radius = 455;

        ctx.beginPath();
        ctx.arc(
            centerX,
            centerY,
            radius,
            0,
            Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();

        const imgW = userImage.width;
const imgH = userImage.height;

const scale = Math.max(
    (radius * 1.0) / imgW,
    (radius * 1.0) / imgH
) * zoom;

const drawW = imgW * scale;
const drawH = imgH * scale;

const x = centerX - drawW / 2 + offsetX;
const y = centerY - drawH / 2 + offsetY;

ctx.drawImage(
    userImage,
    x,
    y,
    drawW,
    drawH
);

        ctx.restore();
    }

    

    // FRAME DI ATAS FOTO
    if(frame.complete){
        ctx.drawImage(
            frame,
            0,
            0,
            1080,
            1080
        );
    }

    // =====================
    // TULISAN
    // =====================

    const nama =
        document.getElementById("nama").value || "";

    const sekolah =
        document.getElementById("sekolah").value || "";

    // Nama Sekolah

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";

    ctx.font = "bold 30px Arial";

    ctx.fillText(
        sekolah.toUpperCase(),
        540,
        855
    );

    // Nama Siswa

    ctx.fillStyle = "#003c8f";

    ctx.font = "bold 40px Arial";

    ctx.fillText(
        nama.toUpperCase(),
        540,
        930
    );
}

// =====================
// Load Frame
// =====================

frame.onload = function(){
    drawCanvas();
};

// =====================
// Download
// =====================

function downloadTwibbon(){

    const link =
        document.createElement("a");

    link.download =
        "Twibbon-MPLS-2026.png";

    link.href =
        canvas.toDataURL("image/png");

    link.click();
}