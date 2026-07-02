import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method tidak diizinkan"
        });
    }

    if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(500).json({
            success: false,
            message: "Environment variables Supabase belum terkonfigurasi dengan benar di Vercel."
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

        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .maybeSingle();

        if (error) throw error;

        if (!user || user.password !== password) {
            return res.status(400).json({
                success: false,
                message: "Username atau password salah"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login berhasil",
            user: {
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}