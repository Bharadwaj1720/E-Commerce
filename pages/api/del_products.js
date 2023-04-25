import pool from '../../utils/mysql';


async function delCart(req, res) {

    if (req.method === 'POST') {
        const data = req.body;
        const connection = await pool.getConnection();
        console.log(data);
        const id = data.id;
        await connection.query('DELETE FROM products WHERE id=? ;', [id]);

        connection.release();
        res.send('success');

    }
}


export default delCart;