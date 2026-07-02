import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(500).json({
            success: false,
            message: "Variabel lingkungan database tidak terbaca di server Vercel."
        });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 1. JIKA MENERIMA METHOD GET (MEMBACA DATA KOMENTAR)
    if (req.method === "GET") {
        try {
            const { data, error } = await supabase
                .from("comments")
                .select("*")
                .order("created_at", { ascending: false }); // Komentar terbaru paling atas

            if (error) throw error;

            return res.status(200).json({
                success: true,
                data: data
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    // 2. JIKA MENERIMA METHOD POST (MENGIRIM KOMENTAR BARU)
    if (req.method === "POST") {
        try {
            const { username, komentar } = req.body;

            if (!komentar) {
                return res.status(400).json({
                    success: false,
                    message: "Isi komentar tidak boleh kosong"
                });
            }

            const { error } = await supabase
                .from("comments")
                .insert([{ username: username || "Anonim", komentar }]);

            if (error) throw error;

            return res.status(200).json({
                success: true,
                message: "Komentar berhasil dikirim"
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    return res.status(405).json({
        success: false,
        message: "Method tidak diizinkan"
    });
}