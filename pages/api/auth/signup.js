import bcryptjs from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/mongodb';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return;
    }
    const { name, email, password, option } = req.body;
    console.log(name, email, password, option);
    if (
        !name ||
        !email ||
        !email.includes('@') ||
        !password ||
        password.trim().length < 5
    ) {
        res.status(422).json({
            message: 'Validation error',
        });
        return;
    }

    await db.connect();

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        res.status(422).json({ message: 'User exists already!' });
        await db.disconnect();
        return;
    }

    const newUser = new User({
        name,
        email,
        password: bcryptjs.hashSync(password),
        isAdmin: false,
        isSeller: false,
        account_number: " "

    });

    if (option === '2') {
        newUser.isAdmin = true;
        newUser.isSeller = true;

    }
    else if (option === '3') {
        newUser.isAdmin = true;

    }

    const user = await newUser.save();
    await db.disconnect();
    res.status(201).send({
        message: 'Created user!',
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    });
}

export default handler;