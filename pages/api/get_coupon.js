import pool from '../../utils/mysql';
const fs = require('fs');

async function getCoupon(req, res) {

    if (req.body.flag == 1) {

        const connection = await pool.getConnection();

        const [data] = await connection.query('SELECT coupon, discount, iscoupon FROM products WHERE id = ? ;', [req.body.id]);
        console.log(data);
        connection.release();
        res.send(data[0]);

    }
    if (req.body.flag == 2) {

        const connection = await pool.getConnection();
        const data = req.body.data;
        await connection.query('UPDATE products SET coupon=?, discount=?, iscoupon=? WHERE id =? ;', [data.coupon_number, (data.discount % 101) / 100, data.isenabled, data.id]);
        connection.release();
        res.send(data[0]);

    }
}


export default getCoupon;