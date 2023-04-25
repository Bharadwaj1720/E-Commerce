import pool from "@/utils/mysql";

const handler = async (req, res) => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM products");
    res.send(rows);
}

export default handler;