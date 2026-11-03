import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    roomNumber: { type: String, required: true },
    college: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Student = mongoose.model('Student', studentSchema);
