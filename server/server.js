import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Room } from './models/Room.js';
import { Student } from './models/Student.js';
import { Fee } from './models/Fee.js';
import { Complaint } from './models/Complaint.js';

// Load environment variables from root .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

const app = express();
const PORT = process.env.PORT || 5000;
let MONGODB_URI = process.env.MONGODB_URI || '';

// Clean up URI if needed
MONGODB_URI = MONGODB_URI.trim();

// Middleware
app.use(cors());
app.use(express.json());

// Initial Seed Data
const initialRooms = [
  { roomNumber: '101', type: 'Double Sharing', capacity: 2, occupied: 2, rent: 8000, status: 'Occupied' },
  { roomNumber: '102', type: 'Single Private', capacity: 1, occupied: 1, rent: 12000, status: 'Occupied' },
  { roomNumber: '103', type: 'Triple Sharing', capacity: 3, occupied: 2, rent: 6000, status: 'Available' },
  { roomNumber: '201', type: 'Double Sharing', capacity: 2, occupied: 1, rent: 7500, status: 'Available' },
  { roomNumber: '202', type: 'Single Private', capacity: 1, occupied: 0, rent: 11000, status: 'Available' },
  { roomNumber: '203', type: 'Triple Sharing', capacity: 3, occupied: 0, rent: 6000, status: 'Available' },
];

const initialStudents = [
  { name: 'Aarav Sharma', phone: '9876543210', email: 'aarav@gmail.com', roomNumber: '101', college: 'B.Tech CS' },
  { name: 'Rohan Verma', phone: '9823456789', email: 'rohan@gmail.com', roomNumber: '101', college: 'B.Tech IT' },
  { name: 'Vikram Roy', phone: '9712345678', email: 'vikram@gmail.com', roomNumber: '102', college: 'MBA' },
  { name: 'Aditya Nair', phone: '9654321098', email: 'aditya@gmail.com', roomNumber: '103', college: 'B.Com' },
  { name: 'Dev Patel', phone: '9543210987', email: 'dev@gmail.com', roomNumber: '103', college: 'B.Tech Mech' },
  { name: 'Priya Iyer', phone: '9432109876', email: 'priya@gmail.com', roomNumber: '201', college: 'MBBS' },
];

const initialFees = [
  { studentName: 'Aarav Sharma', roomNumber: '101', month: 'November', amount: 8000, status: 'Paid' },
  { studentName: 'Rohan Verma', roomNumber: '101', month: 'November', amount: 8000, status: 'Pending' },
  { studentName: 'Vikram Roy', roomNumber: '102', month: 'November', amount: 12000, status: 'Paid' },
  { studentName: 'Aditya Nair', roomNumber: '103', month: 'November', amount: 6000, status: 'Pending' },
  { studentName: 'Dev Patel', roomNumber: '103', month: 'November', amount: 6000, status: 'Paid' },
  { studentName: 'Priya Iyer', roomNumber: '201', month: 'November', amount: 7500, status: 'Pending' },
];

const initialComplaints = [
  { studentName: 'Aarav Sharma', roomNumber: '101', issue: 'Ceiling fan making noise', status: 'In Progress' },
  { studentName: 'Aditya Nair', roomNumber: '103', issue: 'Bathroom tap leaking', status: 'Pending' },
  { studentName: 'Vikram Roy', roomNumber: '102', issue: 'Wi-Fi connection slow in room', status: 'Resolved' },
  { studentName: 'Priya Iyer', roomNumber: '201', issue: 'Study lamp socket not working', status: 'Pending' },
];

async function seedIfEmpty() {
  try {
    const roomCount = await Room.countDocuments();
    if (roomCount === 0) {
      console.log('Database is empty. Populating with starter data...');
      await Room.insertMany(initialRooms);
      await Student.insertMany(initialStudents);
      await Fee.insertMany(initialFees);
      await Complaint.insertMany(initialComplaints);
      console.log('✅ Starter data seeded successfully into MongoDB Atlas!');
    }
  } catch (err) {
    console.error('Error auto-seeding database:', err.message);
  }
}

// Connect to MongoDB
if (!MONGODB_URI || MONGODB_URI.includes('<db_password>')) {
  console.warn('⚠️ Warning: MONGODB_URI is not configured properly in .env');
} else {
  // If no dbName in path, provide dbName: 'hostelDB'
  const connectOptions = {
    dbName: 'hostelDB',
    serverSelectionTimeoutMS: 8000,
  };

  mongoose
    .connect(MONGODB_URI, connectOptions)
    .then(async () => {
      console.log('✅ Connected to MongoDB Atlas successfully!');
      console.log(`📦 Database: ${mongoose.connection.name}`);
      await seedIfEmpty();
    })
    .catch((err) => {
      console.error('❌ MongoDB Atlas Connection Error:', err.message);
    });
}

// --- API ROUTES ---

// 1. Status Check
app.get('/api/status', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    connected: isConnected,
    database: isConnected ? mongoose.connection.name : null,
    host: isConnected ? mongoose.connection.host : null,
  });
});

// Seed endpoint
app.post('/api/seed', async (req, res) => {
  try {
    await Room.deleteMany({});
    await Student.deleteMany({});
    await Fee.deleteMany({});
    await Complaint.deleteMany({});

    await Room.insertMany(initialRooms);
    await Student.insertMany(initialStudents);
    await Fee.insertMany(initialFees);
    await Complaint.insertMany(initialComplaints);

    res.json({ message: 'Database reset & seeded with initial data successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rooms', async (req, res) => {
  try {
    const { roomNumber, type, capacity, rent, status } = req.body;
    const existing = await Room.findOne({ roomNumber });
    if (existing) {
      return res.status(400).json({ error: `Room ${roomNumber} already exists` });
    }
    const newRoom = await Room.create({
      roomNumber,
      type: type || 'Double Sharing',
      capacity: Number(capacity) || 2,
      occupied: 0,
      rent: Number(rent) || 8000,
      status: status || 'Available',
    });
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Room not found' });
    res.json({ message: 'Room deleted successfully', deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, phone, email, roomNumber, college } = req.body;
    const newStudent = await Student.create({
      name,
      phone: phone || '',
      email: email || '',
      roomNumber,
      college: college || '',
    });

    // Update room occupancy
    const room = await Room.findOne({ roomNumber });
    if (room) {
      const newOccupied = (room.occupied || 0) + 1;
      room.occupied = newOccupied;
      room.status = newOccupied >= room.capacity ? 'Occupied' : 'Available';
      await room.save();
    }

    // Automatically create first month fee invoice
    await Fee.create({
      studentName: name,
      roomNumber,
      month: 'November',
      amount: room ? room.rent : 8000,
      status: 'Pending',
    });

    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Decrement room occupancy
    if (student.roomNumber) {
      const room = await Room.findOne({ roomNumber: student.roomNumber });
      if (room) {
        const newOccupied = Math.max(0, (room.occupied || 0) - 1);
        room.occupied = newOccupied;
        room.status = newOccupied >= room.capacity ? 'Occupied' : 'Available';
        await room.save();
      }
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Fees
app.get('/api/fees', async (req, res) => {
  try {
    const fees = await Fee.find().sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/fees', async (req, res) => {
  try {
    const { studentName, roomNumber, month, amount, status } = req.body;
    const newFee = await Fee.create({
      studentName,
      roomNumber,
      month: month || 'Current Month',
      amount: Number(amount) || 8000,
      status: status || 'Pending',
    });
    res.status(201).json(newFee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/fees/:id', async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ error: 'Fee record not found' });

    fee.status = fee.status === 'Paid' ? 'Pending' : 'Paid';
    await fee.save();
    res.json(fee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/fees/:id', async (req, res) => {
  try {
    await Fee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fee record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/complaints', async (req, res) => {
  try {
    const { studentName, roomNumber, issue, status } = req.body;
    const newComplaint = await Complaint.create({
      studentName: studentName || 'Resident',
      roomNumber: roomNumber || 'General',
      issue,
      status: status || 'Pending',
    });
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

    complaint.status = complaint.status === 'Resolved' ? 'Pending' : 'Resolved';
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/complaints/:id', async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express Server
// Serve React frontend
const frontendPath = path.resolve(__dirname, '../dist');

app.use(express.static(frontendPath));

// React homepage
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
