import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, defaultHostelData } from './storage.js';
import {
  RoomModel,
  StudentModel,
  FeeModel,
  ComplaintModel,
  MessMenuModel,
  VisitorModel,
  AttendanceModel,
  NoticeModel,
  UserModel,
  HostelInfoModel,
} from './models/index.js';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hostelDB';

// Middleware
app.use(cors());
app.use(express.json());

let isMongoConnected = false;

// Function to seed MongoDB Compass database if empty
async function seedMongoDBIfEmpty() {
  try {
    const roomCount = await RoomModel.countDocuments();
    if (roomCount === 0) {
      console.log('📦 MongoDB database is empty. Seeding initial enterprise dataset...');

      // Seed all collections
      await RoomModel.insertMany(defaultHostelData.rooms);
      await StudentModel.insertMany(defaultHostelData.students);
      await FeeModel.insertMany(defaultHostelData.fees);
      await ComplaintModel.insertMany(defaultHostelData.complaints);
      await MessMenuModel.insertMany(defaultHostelData.messMenu);
      await VisitorModel.insertMany(defaultHostelData.visitors);
      await AttendanceModel.insertMany(defaultHostelData.attendance);
      await NoticeModel.insertMany(defaultHostelData.notices);
      await UserModel.insertMany(defaultHostelData.users);
      await HostelInfoModel.create(defaultHostelData.hostelInfo);

      console.log('✅ Starter dataset seeded into MongoDB Compass (hostelDB)!');
    } else {
      console.log(`✅ MongoDB Compass contains ${roomCount} rooms. Ready to serve.`);
    }
  } catch (err) {
    console.error('Error auto-seeding MongoDB:', err.message);
  }
}

// Connect to MongoDB Compass (localhost:27017)
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(async () => {
    isMongoConnected = true;
    console.log('====================================================');
    console.log('🍃 CONNECTED TO MONGODB COMPASS SUCCESSFULLY!');
    console.log(`📍 Connection URI: ${MONGODB_URI}`);
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`💻 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    console.log('====================================================');
    await seedMongoDBIfEmpty();
  })
  .catch((err) => {
    isMongoConnected = false;
    console.warn('⚠️ MongoDB Compass connection error:', err.message);
    console.log('📁 Using local persistent storage (server/data/hostel_database.json) as active engine.');
  });

// 1. Status Check
app.get('/api/status', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  let counts = {
    rooms: db.get('rooms').length,
    students: db.get('students').length,
    fees: db.get('fees').length,
    complaints: db.get('complaints').length,
    visitors: db.get('visitors').length,
    notices: db.get('notices').length,
  };

  if (isConnected) {
    try {
      counts = {
        rooms: await RoomModel.countDocuments(),
        students: await StudentModel.countDocuments(),
        fees: await FeeModel.countDocuments(),
        complaints: await ComplaintModel.countDocuments(),
        visitors: await VisitorModel.countDocuments(),
        notices: await NoticeModel.countDocuments(),
      };
    } catch {
      // fallback to memory counts
    }
  }

  res.json({
    connected: true,
    mongoConnected: isConnected,
    engine: isConnected ? 'MongoDB Compass (Local)' : 'Local Persistent JSON Engine',
    host: isConnected ? `${mongoose.connection.host}:${mongoose.connection.port}` : 'localhost:27017 (Standby)',
    database: isConnected ? mongoose.connection.name : 'hostelDB',
    uri: MONGODB_URI,
    activeRecords: counts,
  });
});

// 2. Database Reset / Re-seed
app.post('/api/reset', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await RoomModel.deleteMany({});
      await StudentModel.deleteMany({});
      await FeeModel.deleteMany({});
      await ComplaintModel.deleteMany({});
      await MessMenuModel.deleteMany({});
      await VisitorModel.deleteMany({});
      await AttendanceModel.deleteMany({});
      await NoticeModel.deleteMany({});
      await UserModel.deleteMany({});
      await HostelInfoModel.deleteMany({});

      await RoomModel.insertMany(defaultHostelData.rooms);
      await StudentModel.insertMany(defaultHostelData.students);
      await FeeModel.insertMany(defaultHostelData.fees);
      await ComplaintModel.insertMany(defaultHostelData.complaints);
      await MessMenuModel.insertMany(defaultHostelData.messMenu);
      await VisitorModel.insertMany(defaultHostelData.visitors);
      await AttendanceModel.insertMany(defaultHostelData.attendance);
      await NoticeModel.insertMany(defaultHostelData.notices);
      await UserModel.insertMany(defaultHostelData.users);
      await HostelInfoModel.create(defaultHostelData.hostelInfo);
    }
    const data = db.reset();
    res.json({ message: 'Hostel database reloaded with enterprise starter dataset', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Export complete data
app.get('/api/export', async (req, res) => {
  try {
    let exportData = db.data;
    if (mongoose.connection.readyState === 1) {
      exportData = {
        hostelInfo: (await HostelInfoModel.findOne()) || defaultHostelData.hostelInfo,
        rooms: await RoomModel.find(),
        students: await StudentModel.find(),
        fees: await FeeModel.find(),
        complaints: await ComplaintModel.find(),
        messMenu: await MessMenuModel.find(),
        visitors: await VisitorModel.find(),
        attendance: await AttendanceModel.find(),
        notices: await NoticeModel.find(),
        users: await UserModel.find(),
        exportedAt: new Date().toISOString(),
      };
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=hostel_backup.json');
    res.send(JSON.stringify(exportData, null, 2));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Hostel Info Settings
app.get('/api/hostel-info', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let info = await HostelInfoModel.findOne();
      if (!info) info = await HostelInfoModel.create(defaultHostelData.hostelInfo);
      return res.json(info);
    }
    res.json(db.data.hostelInfo || defaultHostelData.hostelInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/hostel-info', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let info = await HostelInfoModel.findOneAndUpdate({}, req.body, { new: true, upsert: true });
      db.data.hostelInfo = { ...db.data.hostelInfo, ...req.body };
      db.save();
      return res.json(info);
    }
    db.data.hostelInfo = { ...db.data.hostelInfo, ...req.body };
    db.save();
    res.json(db.data.hostelInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= AUTHENTICATION ROUTES (USER & ADMIN) =================
app.post('/api/auth/login', async (req, res) => {
  const { usernameOrEmail, password, role } = req.body;
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'Please enter both username/email and password' });
  }

  const cleanQuery = usernameOrEmail.trim().toLowerCase();
  const cleanPass = password.trim();

  try {
    // 1. Admin Authentication
    if (role === 'admin' || cleanQuery.includes('admin') || cleanQuery.includes('warden')) {
      let adminUser = null;
      if (mongoose.connection.readyState === 1) {
        adminUser = await UserModel.findOne({
          role: 'admin',
          $or: [{ email: cleanQuery }, { username: cleanQuery }],
        });
      }
      if (!adminUser) {
        adminUser = (db.get('users') || []).find(
          (u) =>
            u.role === 'admin' &&
            (u.email.toLowerCase() === cleanQuery || (u.username && u.username.toLowerCase() === cleanQuery))
        );
      }

      if (adminUser) {
        if (adminUser.password !== cleanPass && cleanPass !== 'admin123') {
          return res.status(401).json({ error: 'Invalid admin password. Default is: admin123' });
        }
        return res.json({
          user: {
            id: adminUser.id || adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: 'admin',
            title: adminUser.title || 'Hostel Administrator',
            avatar: adminUser.avatar || 'VR',
          },
          token: `hostel-token-${Date.now()}`,
        });
      }
    }

    // 2. Student / Resident Authentication
    let studentUser = null;
    let studentRecord = null;

    if (mongoose.connection.readyState === 1) {
      studentUser = await UserModel.findOne({
        role: 'student',
        $or: [{ email: cleanQuery }, { username: cleanQuery }, { regNo: cleanQuery }],
      });
      studentRecord = await StudentModel.findOne({
        $or: [{ email: cleanQuery }, { name: cleanQuery }, { regNo: cleanQuery }, { phone: cleanQuery }],
      });
    }

    if (!studentUser) {
      studentUser = (db.get('users') || []).find(
        (u) =>
          u.role === 'student' &&
          (u.email.toLowerCase() === cleanQuery ||
            (u.username && u.username.toLowerCase() === cleanQuery) ||
            (u.regNo && u.regNo.toLowerCase() === cleanQuery))
      );
    }

    if (!studentRecord) {
      studentRecord = db.get('students').find(
        (s) =>
          s.email.toLowerCase() === cleanQuery ||
          s.name.toLowerCase() === cleanQuery ||
          (s.regNo && s.regNo.toLowerCase() === cleanQuery) ||
          (s.phone && s.phone === cleanQuery)
      );
    }

    if (studentUser || studentRecord) {
      if (studentUser && studentUser.password !== cleanPass && cleanPass !== 'student123') {
        return res.status(401).json({ error: 'Invalid password. Default password is: student123' });
      }

      const targetStudent = studentRecord || studentUser;
      const name = targetStudent.name;
      const email = targetStudent.email;
      const room = targetStudent.roomNumber;
      const bed = targetStudent.bedNumber || `${room}-A`;
      const regNo = targetStudent.regNo || 'HST-2024-001';
      const id = targetStudent.id || targetStudent._id;

      return res.json({
        user: {
          id,
          studentId: id,
          name,
          email,
          role: 'student',
          roomNumber: room,
          bedNumber: bed,
          regNo,
          title: `Resident (Room ${room})`,
          avatar: name.slice(0, 2).toUpperCase(),
        },
        token: `hostel-token-${Date.now()}`,
      });
    }

    if (role === 'admin') {
      return res.status(401).json({ error: 'Admin account not found. Try: admin@hostel.com / admin123' });
    }

    return res.status(401).json({
      error: 'User account not found. Try student demo credentials: aarav.sharma@gmail.com / student123',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Demo accounts
app.get('/api/auth/demo-accounts', (req, res) => {
  res.json({
    admin: {
      email: 'admin@hostel.com',
      username: 'admin',
      password: 'admin123',
      name: 'Dr. V. K. Rao (Chief Warden)',
      role: 'admin',
    },
    students: [
      {
        email: 'aarav.sharma@gmail.com',
        username: 'aarav',
        password: 'student123',
        name: 'Aarav Sharma (Room 101)',
        roomNumber: '101',
        role: 'student',
      },
      {
        email: 'vikram.roy@business.edu',
        username: 'vikram',
        password: 'student123',
        name: 'Vikram Roy (Deluxe Room 102)',
        roomNumber: '102',
        role: 'student',
      },
      {
        email: 'priya.iyer@med.edu',
        username: 'priya',
        password: 'student123',
        name: 'Priya Iyer (Room 201)',
        roomNumber: '201',
        role: 'student',
      },
    ],
  });
});

// ================= ROOMS ROUTES =================
app.get('/api/rooms', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const rooms = await RoomModel.find().sort({ roomNumber: 1 });
      return res.json(rooms.map(r => ({ ...r.toObject(), id: r._id.toString() })));
    }
    res.json(db.get('rooms'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rooms', async (req, res) => {
  try {
    const { roomNumber, block, floor, type, capacity, rent, amenities } = req.body;
    const cap = Number(capacity) || 2;
    const beds = [];
    for (let i = 0; i < cap; i++) {
      beds.push({
        bedNumber: `${roomNumber}-${String.fromCharCode(65 + i)}`,
        studentId: null,
        studentName: null,
      });
    }

    const roomPayload = {
      roomNumber,
      block: block || 'Block A (Main Wing)',
      floor: Number(floor) || 1,
      type: type || 'Double Sharing',
      capacity: cap,
      occupied: 0,
      rent: Number(rent) || 8500,
      amenities: Array.isArray(amenities) ? amenities : ['Attached Washroom', 'High-Speed Wi-Fi'],
      cleaningStatus: 'Clean',
      status: 'Available',
      beds,
    };

    if (mongoose.connection.readyState === 1) {
      const existing = await RoomModel.findOne({ roomNumber });
      if (existing) {
        return res.status(400).json({ error: `Room ${roomNumber} already exists in MongoDB` });
      }
      const saved = await RoomModel.create(roomPayload);
      const out = { ...saved.toObject(), id: saved._id.toString() };
      db.insert('rooms', out);
      return res.status(201).json(out);
    }

    const saved = db.insert('rooms', { ...roomPayload, id: `rm-${Date.now()}` });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let room = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        room = await RoomModel.findById(req.params.id);
      }
      if (!room) {
        room = await RoomModel.findOne({ roomNumber: req.params.id });
      }
      if (room) {
        if (room.occupied > 0) {
          return res.status(400).json({ error: `Cannot delete Room ${room.roomNumber} while it has ${room.occupied} resident(s).` });
        }
        await RoomModel.findByIdAndDelete(room._id);
      }
    }
    db.delete('rooms', req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= STUDENTS ROUTES =================
app.get('/api/students', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const students = await StudentModel.find().sort({ createdAt: -1 });
      return res.json(students.map(s => ({ ...s.toObject(), id: s._id.toString() })));
    }
    res.json(db.get('students'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      roomNumber,
      bedNumber,
      college,
      guardianName,
      guardianPhone,
      guardianRelation,
      bloodGroup,
      idProofType,
      idProofNumber,
      depositPaid,
    } = req.body;

    if (!name || !roomNumber) {
      return res.status(400).json({ error: 'Name and Room Number are required' });
    }

    const regNo = `HST-2024-${String(db.get('students').length + 1).padStart(3, '0')}`;
    let assignedBed = bedNumber;

    if (mongoose.connection.readyState === 1) {
      const room = await RoomModel.findOne({ roomNumber });
      if (room) {
        if (!assignedBed && room.beds) {
          const free = room.beds.find((b) => !b.studentId);
          if (free) assignedBed = free.bedNumber;
        }

        const newOccupied = (room.occupied || 0) + 1;
        room.occupied = newOccupied;
        room.status = newOccupied >= room.capacity ? 'Occupied' : 'Available';

        if (room.beds && assignedBed) {
          const bObj = room.beds.find((b) => b.bedNumber === assignedBed);
          if (bObj) {
            bObj.studentName = name;
          }
        }
        await room.save();
      }

      const studentPayload = {
        regNo,
        name,
        phone: phone || '',
        email: email || '',
        roomNumber,
        bedNumber: assignedBed || `${roomNumber}-A`,
        college: college || 'Regular Student',
        guardianName: guardianName || '',
        guardianPhone: guardianPhone || '',
        guardianRelation: guardianRelation || 'Parent',
        bloodGroup: bloodGroup || 'O+',
        idProofType: idProofType || 'Aadhaar Card',
        idProofNumber: idProofNumber || '',
        checkInDate: new Date().toISOString().split('T')[0],
        depositPaid: Number(depositPaid) || 15000,
        monthlyRent: room ? room.rent : 8500,
        status: 'Active',
        emergencyContact: guardianPhone ? `${guardianPhone} (${guardianRelation || 'Guardian'})` : phone,
      };

      const saved = await StudentModel.create(studentPayload);

      // Create invoice
      await FeeModel.create({
        invoiceNo: `INV-2024-${Date.now().toString().slice(-4)}`,
        studentId: saved._id.toString(),
        studentName: name,
        roomNumber,
        month: 'November 2024',
        category: 'Hostel Rent',
        amount: room ? room.rent : 8500,
        paidAmount: 0,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentDate: null,
        paymentMode: 'Pending',
        transactionId: '',
        status: 'Pending',
        remarks: 'First month hostel invoice',
      });

      const out = { ...saved.toObject(), id: saved._id.toString() };
      db.insert('students', out);
      return res.status(201).json(out);
    }

    const saved = db.insert('students', {
      id: `std-${Date.now()}`,
      regNo,
      name,
      phone: phone || '',
      email: email || '',
      roomNumber,
      bedNumber: assignedBed || `${roomNumber}-A`,
      college: college || 'Regular Student',
      guardianName: guardianName || '',
      guardianPhone: guardianPhone || '',
      guardianRelation: guardianRelation || 'Parent',
      bloodGroup: bloodGroup || 'O+',
      idProofType: idProofType || 'Aadhaar Card',
      idProofNumber: idProofNumber || '',
      checkInDate: new Date().toISOString().split('T')[0],
      depositPaid: Number(depositPaid) || 15000,
      monthlyRent: 8500,
      status: 'Active',
      emergencyContact: guardianPhone ? `${guardianPhone} (${guardianRelation})` : phone,
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let student = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        student = await StudentModel.findById(req.params.id);
      }
      if (!student) {
        student = await StudentModel.findOne({ name: req.params.id });
      }

      if (student) {
        if (student.roomNumber) {
          const room = await RoomModel.findOne({ roomNumber: student.roomNumber });
          if (room) {
            room.occupied = Math.max(0, (room.occupied || 0) - 1);
            room.status = room.occupied >= room.capacity ? 'Occupied' : 'Available';
            if (room.beds) {
              const bed = room.beds.find((b) => b.studentName === student.name || b.bedNumber === student.bedNumber);
              if (bed) {
                bed.studentId = null;
                bed.studentName = null;
              }
            }
            await room.save();
          }
        }
        await StudentModel.findByIdAndDelete(student._id);
      }
    }
    db.delete('students', req.params.id);
    res.json({ message: 'Student removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= FEES ROUTES =================
app.get('/api/fees', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const fees = await FeeModel.find().sort({ createdAt: -1 });
      return res.json(fees.map(f => ({ ...f.toObject(), id: f._id.toString() })));
    }
    res.json(db.get('fees'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/fees', async (req, res) => {
  try {
    const { studentName, roomNumber, month, category, amount, paymentMode, remarks } = req.body;
    const invoiceNo = `INV-2024-${Date.now().toString().slice(-4)}`;
    const feePayload = {
      invoiceNo,
      studentId: '',
      studentName: studentName || 'Resident',
      roomNumber: roomNumber || '101',
      month: month || 'Current Month',
      category: category || 'Hostel Rent',
      amount: Number(amount) || 8500,
      paidAmount: 0,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentDate: null,
      paymentMode: paymentMode || 'Pending',
      transactionId: '',
      status: 'Pending',
      remarks: remarks || 'Issued by hostel finance desk',
    };

    if (mongoose.connection.readyState === 1) {
      const saved = await FeeModel.create(feePayload);
      const out = { ...saved.toObject(), id: saved._id.toString() };
      db.insert('fees', out);
      return res.status(201).json(out);
    }

    const saved = db.insert('fees', { ...feePayload, id: `inv-${Date.now()}` });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/fees/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      const fee = await FeeModel.findById(req.params.id);
      if (fee) {
        if (req.body.toggleStatus) {
          const willBePaid = fee.status !== 'Paid';
          fee.status = willBePaid ? 'Paid' : 'Pending';
          fee.paidAmount = willBePaid ? fee.amount : 0;
          fee.paymentDate = willBePaid ? new Date().toISOString().split('T')[0] : null;
          fee.paymentMode = willBePaid ? 'UPI' : 'Pending';
          fee.transactionId = willBePaid ? `UPI-${Date.now().toString().slice(-8)}` : '';
          await fee.save();
          return res.json({ ...fee.toObject(), id: fee._id.toString() });
        }
        const updated = await FeeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json({ ...updated.toObject(), id: updated._id.toString() });
      }
    }

    const localFee = db.findById('fees', req.params.id);
    if (localFee) {
      if (req.body.toggleStatus) {
        localFee.status = localFee.status === 'Paid' ? 'Pending' : 'Paid';
        db.save();
        return res.json(localFee);
      }
      const updated = db.update('fees', req.params.id, req.body);
      return res.json(updated);
    }

    res.status(404).json({ error: 'Invoice not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= COMPLAINTS ROUTES =================
app.get('/api/complaints', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const complaints = await ComplaintModel.find().sort({ createdAt: -1 });
      return res.json(complaints.map(c => ({ ...c.toObject(), id: c._id.toString() })));
    }
    res.json(db.get('complaints'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/complaints', async (req, res) => {
  try {
    const { studentName, studentPhone, roomNumber, category, priority, issue, assignedStaff } = req.body;
    const ticketNo = `TKT-${Date.now().toString().slice(-4)}`;
    const compPayload = {
      ticketNo,
      studentName: studentName || 'Resident',
      studentPhone: studentPhone || '',
      roomNumber: roomNumber || '101',
      category: category || 'General Maintenance',
      priority: priority || 'Medium',
      issue,
      status: 'Open',
      assignedStaff: assignedStaff || 'Duty Supervisor',
      loggedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      resolvedAt: null,
      resolutionNotes: '',
    };

    if (mongoose.connection.readyState === 1) {
      const saved = await ComplaintModel.create(compPayload);
      const out = { ...saved.toObject(), id: saved._id.toString() };
      db.insert('complaints', out);
      return res.status(201).json(out);
    }

    const saved = db.insert('complaints', { ...compPayload, id: `tkt-${Date.now()}` });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/complaints/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      const complaint = await ComplaintModel.findById(req.params.id);
      if (complaint) {
        if (req.body.toggleStatus) {
          complaint.status = complaint.status === 'Resolved' ? 'Open' : 'Resolved';
          complaint.resolvedAt = complaint.status === 'Resolved' ? new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : null;
          await complaint.save();
          return res.json({ ...complaint.toObject(), id: complaint._id.toString() });
        }
        const updated = await ComplaintModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json({ ...updated.toObject(), id: updated._id.toString() });
      }
    }

    const localComplaint = db.findById('complaints', req.params.id);
    if (localComplaint) {
      if (req.body.toggleStatus) {
        localComplaint.status = localComplaint.status === 'Resolved' ? 'Open' : 'Resolved';
        db.save();
        return res.json(localComplaint);
      }
      const updated = db.update('complaints', req.params.id, req.body);
      return res.json(updated);
    }

    res.status(404).json({ error: 'Complaint ticket not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= MESS MENU ROUTES =================
app.get('/api/mess-menu', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const menus = await MessMenuModel.find();
      if (menus.length > 0) return res.json(menus);
    }
    res.json(db.get('messMenu'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/mess-menu/:day', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await MessMenuModel.findOneAndUpdate({ day: req.params.day }, req.body, { new: true, upsert: true });
      return res.json(updated);
    }
    const list = db.get('messMenu');
    const index = list.findIndex((m) => m.day.toLowerCase() === req.params.day.toLowerCase());
    if (index !== -1) {
      list[index] = { ...list[index], ...req.body };
      db.save();
      return res.json(list[index]);
    }
    res.status(404).json({ error: 'Day not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= VISITORS ROUTES =================
app.get('/api/visitors', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const visitors = await VisitorModel.find().sort({ createdAt: -1 });
      return res.json(visitors.map(v => ({ ...v.toObject(), id: v._id.toString() })));
    }
    res.json(db.get('visitors'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/visitors', async (req, res) => {
  try {
    const { visitorName, visitorPhone, residentName, roomNumber, relation, purpose } = req.body;
    const visPayload = {
      visitorName,
      visitorPhone: visitorPhone || '',
      residentName,
      roomNumber,
      relation: relation || 'Guest',
      inTime: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      outTime: null,
      purpose: purpose || 'Personal Visit',
      idVerified: true,
      status: 'Currently Inside',
    };

    if (mongoose.connection.readyState === 1) {
      const saved = await VisitorModel.create(visPayload);
      const out = { ...saved.toObject(), id: saved._id.toString() };
      db.insert('visitors', out);
      return res.status(201).json(out);
    }

    const saved = db.insert('visitors', { ...visPayload, id: `vis-${Date.now()}` });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/visitors/:id/checkout', async (req, res) => {
  try {
    const time = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      const updated = await VisitorModel.findByIdAndUpdate(
        req.params.id,
        { status: 'Checked Out', outTime: time },
        { new: true }
      );
      if (updated) return res.json({ ...updated.toObject(), id: updated._id.toString() });
    }

    const visitor = db.findById('visitors', req.params.id);
    if (visitor) {
      visitor.status = 'Checked Out';
      visitor.outTime = time;
      db.save();
      return res.json(visitor);
    }
    res.status(404).json({ error: 'Visitor record not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ATTENDANCE & LEAVE ROUTES =================
app.get('/api/attendance', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const att = await AttendanceModel.find().sort({ createdAt: -1 });
      return res.json(att.map(a => ({ ...a.toObject(), id: a._id.toString() })));
    }
    res.json(db.get('attendance'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { studentName, roomNumber, type, departureDate, expectedReturn, destination } = req.body;
    const attPayload = {
      studentName,
      roomNumber,
      type: type || 'Gate Pass / Weekend Leave',
      departureDate: departureDate || new Date().toISOString().split('T')[0],
      expectedReturn: expectedReturn || '',
      actualReturn: null,
      destination: destination || 'Home',
      parentConsent: true,
      status: 'Approved',
    };

    if (mongoose.connection.readyState === 1) {
      const saved = await AttendanceModel.create(attPayload);
      const out = { ...saved.toObject(), id: saved._id.toString() };
      db.insert('attendance', out);
      return res.status(201).json(out);
    }

    const saved = db.insert('attendance', { ...attPayload, id: `att-${Date.now()}` });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= NOTICES ROUTES =================
app.get('/api/notices', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const notices = await NoticeModel.find().sort({ isPinned: -1, createdAt: -1 });
      return res.json(notices.map(n => ({ ...n.toObject(), id: n._id.toString() })));
    }
    res.json(db.get('notices'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notices', async (req, res) => {
  try {
    const { title, category, content, isPinned } = req.body;
    const notPayload = {
      title,
      category: category || 'General',
      date: new Date().toISOString().split('T')[0],
      postedBy: 'Chief Warden Office',
      content,
      isPinned: Boolean(isPinned),
    };

    if (mongoose.connection.readyState === 1) {
      const saved = await NoticeModel.create(notPayload);
      const out = { ...saved.toObject(), id: saved._id.toString() };
      db.insert('notices', out);
      return res.status(201).json(out);
    }

    const saved = db.insert('notices', { ...notPayload, id: `not-${Date.now()}` });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/notices/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      await NoticeModel.findByIdAndDelete(req.params.id);
    }
    db.delete('notices', req.params.id);
    res.json({ message: 'Notice removed' });
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
