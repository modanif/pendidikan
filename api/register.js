const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH;
const TOKEN = process.env.GITHUB_TOKEN;

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method tidak diizinkan"
        });
    }

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username dan password wajib diisi"
            });
        }

        const path = "data/user.json";

        const getFile = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
            {
                headers: {
                    Authorization: `token ${TOKEN}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        const fileData = await getFile.json();

        const content = JSON.parse(
            Buffer.from(fileData.content, "base64").toString()
        );

        const exists = content.users.find(
            u => u.username.toLowerCase() === username.toLowerCase()
        );

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Username sudah digunakan"
            });
        }

        content.users.push({
            id: Date.now(),
            username,
            password,
            role: "user"
        });

        const updatedContent = Buffer.from(
            JSON.stringify(content, null, 2)
        ).toString("base64");

        await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `token ${TOKEN}`,
                    Accept: "application/vnd.github+json"
                },
                body: JSON.stringify({
                    message: `Register user ${username}`,
                    content: updatedContent,
                    sha: fileData.sha,
                    branch: BRANCH
                })
            }
        );

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