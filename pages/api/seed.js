// To populate the dbms

//import Product from '../../models/Product';
import User from '../../models/User';
import data from '../../utils/data';
import db from '../../utils/mongodb';
import pool from "../../utils/mysql";
import Banking from "../../models/Banking";
import Order from '@/models/Order';

const handler = async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Banking.deleteMany();
  await Banking.insertMany(data.banking);
  await Order.deleteMany();

  await db.disconnect();


  const connection = await pool.getConnection();
  await connection.query('TRUNCATE TABLE products');
  const inputs = data.products;
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const { name, slug, category, image, price, brand, rating, numReviews, countInStock, description, isFeatured, email, id, coupon, discount, iscoupon } = input;
    await connection.query('INSERT INTO products VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);', [name, slug, category, image, price, brand, rating, numReviews, countInStock, description, isFeatured, email, id, coupon, discount, iscoupon]);

  }
  connection.release();
  res.send({ message: 'seeded successfully' });
};
export default handler;


