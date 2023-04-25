import db from '../../utils/mongodb';
import Order from '../../models/Order';
import Banking from '@/models/Banking';
async function canOrder(req, res) {
    await db.connect()
    console.log(req.body)
    const order = await Order.findOne({ _id: req.body.id })

    const bank_cus = await Banking.findOne({ email: req.body.data_cus });
    const bank_sel = await Banking.findOne({ email: req.body.data_sel });

    console.log(bank_cus)
    console.log(bank_sel)
    bank_cus.balance += req.body.amount
    bank_sel.balance -= req.body.amount
    order.isCanceled = true




    await order.save()
    await bank_sel.save()
    await bank_cus.save()


    await db.disconnect();

    res.send("success")

}


export default canOrder;