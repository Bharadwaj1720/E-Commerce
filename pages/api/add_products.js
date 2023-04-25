import pool from '../../utils/mysql';
const fs = require('fs');

async function addCart(req, res) {

    if (req.method === 'POST') {
        const data = req.body;
        const connection = await pool.getConnection();
        console.log(data);
        const isFeatured = 1
        const email = data.email;
        const name = data.name;
        const slug = data.slug;
        const category = data.category;
        const image = data.url;
        const price = data.price;
        const brand = data.brand;
        const rating = data.rating;
        const numReviews = data.review;
        const countInStock = data.stock;
        const description = data.des;
        const id = Date.now().toString();
        console.log(name, slug, category, image, price, brand, rating, numReviews, countInStock, description, isFeatured, email, id)
        await connection.query('INSERT INTO products VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);', [name, slug, category, image, price, brand, rating, numReviews, countInStock, description, isFeatured, email, id]);

        connection.release();
        res.send('success');

    }
}


export default addCart;