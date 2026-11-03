import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, required: true, default: 'Double Sharing' },
    capacity: { type: Number, required: true, default: 2 },
    occupied: { type: Number, default: 0 },
    rent: { type: Number, required: true, default: 8000 },
    status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' },
  },
  { timestamps: true }
);

export const Room = mongoose.model('Room', roomSchema);
