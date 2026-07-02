import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method tidak diizinkan" });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return res.status(500).json({ success: false, message: "Variabel lingkungan database tidak terbaca." });
    }

    const { action, id } = req.body;
    if (!action || !id) {
        return res.status(400).json({ success: false, message: "Parameter tidak lengkap." });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        if (action === "promote") {
            const { error } = await supabase
                .from("users")
                .update({ role: "admin" })
                .eq("id", id);

            if (error) throw error;
            return res.status(200).json({ success: true });

        } else if (action === "delete") {
            const { error } = await supabase
                .from("users")
                .delete()
                .eq("id", id);

            if (error) throw error;
            return res.status(200).json({ success: true });
            
        } else {
            return res.status(400).json({ success: false, message: "Aksi tidak dikenali." });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}