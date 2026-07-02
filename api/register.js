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
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username dan password wajib diisi"
            });
        }

        const { data: existingUser } = await supabase
            .from("users")
            .select("username")
            .eq("username", username)
            .maybeSingle();

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username sudah digunakan"
            });
        }

        const { error: insertError } = await supabase
            .from("users")
            .insert([{ username, password, role: "user" }]);

        if (insertError) throw insertError;

        return res.status(200).json({
            success: true,
            message: "Registrasi berhasil"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}