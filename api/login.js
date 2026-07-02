export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method tidak diizinkan"
        });
    }

    const { username, password } = req.body;

    const users = [
        {
            username: "admin",
            password: "admin123",
            role: "admin"
        }
    ];

    const user = users.find(
        u =>
            u.username === username &&
            u.password === password
    );

    if (user) {

        return res.status(200).json({

            success: true,

            user: {
                username: user.username,
                role: user.role
            }

        });

    }

    return res.status(401).json({

        success: false,
        message: "Username atau password salah"

    });

}