import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import db from '../../../utils/mongodb';

const handler = async (req, res) => {
    if (req.method === 'GET') {
        const session = await getSession({ req });
        if (!session) {
            return res.status(401).send({ message: 'signin required' });
        }
        const { user } = session;
        await db.connect();
        const orders = await Order.find({ user: user._id });
        await db.disconnect();
        res.send(orders);
    }
    if (req.method === 'POST') {
        if (req.body.flag == 1) {
            await db.connect();
            const orders = await Order.find({});
            await db.disconnect();
            res.send(orders);
        }
        else if (req.body.flag == 2) {
            await db.connect();
            const order = await Order.findOne({ _id: req.body.order });
            await order.updateOne({ isDelivered: true });
            await db.disconnect();

            res.send(order);

        }
    }
};

export default handler;