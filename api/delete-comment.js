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
        const { id, username, role } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID komentar wajib diisi"
            });
        }

        let query = supabase.from("comments").delete().eq("id", id);

        if (role !== "admin") {
            query = query.eq("username", username);
        }

        const { error, count } = await query;

        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: "Komentar berhasil dihapus"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}