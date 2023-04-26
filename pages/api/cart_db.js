import pool from '../../utils/mysql';

async function createCart(req, res, data_id) {
    if (req.method === 'POST') {
        const data = req.body;
        console.log(data);
        const connection = await pool.getConnection();

        await connection.query('delete from cart where cus_email=?', [data.email]);
        for (let i = 0; i < data.cart.length; i++) {
            const input = data.cart[i];

            const { id, name, brand, quantity, email } = input;
            await connection.query('INSERT INTO cart VALUES(?,?,?,?,?,?);', [data.email, id, name, brand, quantity, email]);
        }
        connection.release();
        res.send('success');

    }
    else if (req.method === 'GET') {
        const data = req.query.email;
        const connection = await pool.getConnection();
        console.log(data + "asfsagdag");
        const [rows] = await connection.query("SELECT * FROM cart WHERE cus_email = ?", [data]);
        res.send(rows)
        connection.close();
    }
}


export default createCart