import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
    if (req.method !== "GET") {
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
        
        const { data, error } = await supabase
            .from("users")
            .select("id, username, role")
            .order("id", { ascending: true });

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