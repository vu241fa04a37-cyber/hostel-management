import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    studentName: { type: String, default: 'Resident' },
    roomNumber: { type: String, required: true },
    issue: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model('Complaint', complaintSchema);
