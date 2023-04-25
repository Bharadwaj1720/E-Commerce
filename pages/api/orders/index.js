
import Order from '../../../models/Order';
import db from '../../../utils/mongodb';
const handler = async (req, res) => {
  const session = req.body.currsession.data;

  if (!session) {
    return res.status(401).send('signin required');
  }

  const { user } = session;
  await db.connect();

  req.body.send.isPaid = true;
  const newOrder = await new Order({
    ...req.body.send,
    user: user._id,
  });
  const order = await newOrder.save();

  res.status(201).send(order);


};
export default handler;