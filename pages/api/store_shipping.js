import pool from '../../utils/mysql';
const fs = require('fs');

async function setShipping(req, res) {

    if (req.method === 'POST') {
        const data = req.body;
        const connection = await pool.getConnection();
        console.log(data);
        let milliseconds = new Date().valueOf();
        console.log(milliseconds / 1000)
        await connection.query('INSERT INTO shipping VALUES(?,?,?,?,?,?)', [milliseconds / 1000, data.FN, data.AD, data.CT, data.PC, data.CO])

        connection.release();
        res.send('success');

    }
}


export default setShipping;