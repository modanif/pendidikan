import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method tidak diizinkan"
        });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(500).json({
            success: false,
            message: "Variabel lingkungan database tidak terbaca di server Vercel."
        });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
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