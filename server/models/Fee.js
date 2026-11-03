import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    roomNumber: { type: String, required: true },
    month: { type: String, default: 'Current Month' },
    amount: { type: Number, required: true, default: 8000 },
    status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  },
  { timestamps: true }
);

export const Fee = mongoose.model('Fee', feeSchema);
