import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method tidak diizinkan"
        });
    }

    const { username, password } = req.body;

    try {
        // 1. Ambil path/lokasi file user.json di root project
        const filePath = path.join(process.cwd(), 'user.json');
        
        // 2. Baca isi file tersebut
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileData);

        // 3. Ambil array di dalam properti "users" sesuai format user.json Anda
        const users = jsonData.users;

        // 4. Cari user yang cocok
        const user = users.find(
            u =>
                u.username.toLowerCase() === username.toLowerCase() &&
                u.password === password
        );

        if (user) {
            return res.status(200).json({
                success: true,
                message: "Login berhasil!",
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        }

        return res.status(401).json({
            success: false,
            message: "Username atau password salah"
        });

    } catch (error) {
        // Jika file user.json belum dibuat atau ada error pembacaan file
        return res.status(500).json({
            success: false,
            message: "Gagal membaca data pengguna",
            error: error.message
        });
    }
}