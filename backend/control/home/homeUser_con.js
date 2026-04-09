
const pool = require("../../config/condb");



const getuserInfo = async (req, res) => {
    try {
        const userId = req.userId; 

        const query = `
            SELECT 
                id, 
                full_name, 
                email, 
                phone, 
                role, 
                is_active,
                last_login, 
                created_at 
            FROM users 
            WHERE id = $1
        `;

        const { rows } = await pool.query(query, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};



module.exports = {
    getuserInfo
}