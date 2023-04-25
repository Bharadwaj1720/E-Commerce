import db from '../../utils/mongodb';
import Banking from '@/models/Banking';
const handler = async (req, res) => {
    if (req.body.flag == 1) {
        console.log(req.body.data)
        await db.connect();
        const banks = await Banking.findOne({ credit_card_number: req.body.data });
        await db.disconnect();

        //res.send(orders);
        res.send(banks)
    }

    if (req.body.flag == 2) {

        await db.connect();
        const bank_cus = await Banking.findOne({ credit_card_number: req.body.data_cus });
        const bank_sel = await Banking.findOne({ email: req.body.data_sel });
        const IBank = await Banking.findOne({ credit_card_number: "0000" });

        const balance_sel = bank_sel.balance + bank_cus.balance - req.body.balance

        await bank_cus.updateOne({ balance: req.body.balance - req.body.commission })
        await bank_sel.updateOne({ balance: balance_sel })
        await IBank.updateOne({ balance: IBank.balance + req.body.commission })


        console.log(req.body.balance)
        const nbank_cus = await Banking.findOne({ credit_card_number: req.body.data_cus });
        const nbank_sel = await Banking.findOne({ email: req.body.data_sel });
        console.log(nbank_cus.balance)
        console.log(nbank_sel.balance)
        //res.send(orders);













        await db.disconnect();
        res.send("Success")
    }
};

export default handler;