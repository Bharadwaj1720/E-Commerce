import pool from '../../utils/mysql';
const fs = require('fs');

async function edit(req, res) {

    if (req.body.flag == 1) {
        const data = req.body.data;
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
        const id = data.id;
        console.log(name, slug, category, image, price, brand, rating, numReviews, countInStock, description, isFeatured, email)
        await connection.query('UPDATE products SET name=? , slug=?, category=? ,image=? , price=?, brand=?, rating=?, numReviews=?, countInStock=?, description=? Where id = ? ;', [name, slug, category, image, price, brand, rating, numReviews, countInStock, description, isFeatured, email, id]);

        connection.release();
        res.send('success');

    }

    if (req.body.flag == 2) {
        const data = req.body.data;
        const connection = await pool.getConnection();
        console.log(data);
        const id = data.id;
        const countInStock = data.countInStock - data.quantity;
        await connection.query('UPDATE products SET  countInStock=?  Where id = ? ;', [countInStock, id]);

        connection.release();
        res.send('success');

    }
    if (req.body.flag == 3) {
        const data = req.body.data;
        const connection = await pool.getConnection();
        console.log(data);
        const id = data.id;
        const [countInStock] = await connection.query('SELECT countInStock FROM products WHERE id = ? ;', [id]);
        console.log(countInStock[0].countInStock)
        const ncountInStock = countInStock[0].countInStock + data.quantity
        console.log(ncountInStock)
        await connection.query('UPDATE products SET  countInStock=?  Where id = ? ;', [ncountInStock, id]);

        connection.release();
        res.send('success');

    }
}


export default edit;