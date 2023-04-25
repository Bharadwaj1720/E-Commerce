
import mongoose from 'mongoose';

const bankingSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        account_number: { type: String, required: true },
        credit_card_number: { type: String, required: true },
        cvv: { type: String, required: true },
        exp: { type: String, required: true },
        balance: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

const Banking = mongoose.models.Banking || mongoose.model('Banking', bankingSchema);
export default Banking;