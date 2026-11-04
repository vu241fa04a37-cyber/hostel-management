import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    block: { type: String, default: 'Block A (Main Wing)' },
    floor: { type: Number, default: 1 },
    type: { type: String, default: 'Double Sharing' },
    capacity: { type: Number, default: 2 },
    occupied: { type: Number, default: 0 },
    rent: { type: Number, default: 8500 },
    amenities: { type: [String], default: [] },
    cleaningStatus: { type: String, default: 'Clean' },
    status: { type: String, default: 'Available' },
    beds: { type: [Object], default: [] },
  },
  { timestamps: true }
);

const studentSchema = new mongoose.Schema(
  {
    regNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    roomNumber: { type: String, required: true },
    bedNumber: { type: String, default: '' },
    college: { type: String, default: '' },
    guardianName: { type: String, default: '' },
    guardianPhone: { type: String, default: '' },
    guardianRelation: { type: String, default: 'Parent' },
    bloodGroup: { type: String, default: 'O+' },
    idProofType: { type: String, default: 'Aadhaar Card' },
    idProofNumber: { type: String, default: '' },
    checkInDate: { type: String, default: '' },
    depositPaid: { type: Number, default: 15000 },
    monthlyRent: { type: Number, default: 8500 },
    status: { type: String, default: 'Active' },
    emergencyContact: { type: String, default: '' },
  },
  { timestamps: true }
);

const feeSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, unique: true },
    studentId: { type: String, default: '' },
    studentName: { type: String, required: true },
    roomNumber: { type: String, required: true },
    month: { type: String, default: 'Current Month' },
    category: { type: String, default: 'Hostel Rent' },
    amount: { type: Number, default: 8500 },
    paidAmount: { type: Number, default: 0 },
    dueDate: { type: String, default: '' },
    paymentDate: { type: String, default: null },
    paymentMode: { type: String, default: 'Pending' },
    transactionId: { type: String, default: '' },
    status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
);

const complaintSchema = new mongoose.Schema(
  {
    ticketNo: { type: String, required: true, unique: true },
    studentName: { type: String, default: 'Resident' },
    studentPhone: { type: String, default: '' },
    roomNumber: { type: String, required: true },
    category: { type: String, default: 'General' },
    priority: { type: String, enum: ['Urgent', 'High', 'Medium', 'Low'], default: 'Medium' },
    issue: { type: String, required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
    assignedStaff: { type: String, default: 'Duty Supervisor' },
    loggedAt: { type: String, default: '' },
    resolvedAt: { type: String, default: null },
    resolutionNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

const messMenuSchema = new mongoose.Schema(
  {
    day: { type: String, required: true, unique: true },
    breakfast: { type: String, default: '' },
    lunch: { type: String, default: '' },
    snacks: { type: String, default: '' },
    dinner: { type: String, default: '' },
    type: { type: String, default: 'Standard' },
  },
  { timestamps: true }
);

const visitorSchema = new mongoose.Schema(
  {
    visitorName: { type: String, required: true },
    visitorPhone: { type: String, default: '' },
    residentName: { type: String, required: true },
    roomNumber: { type: String, required: true },
    relation: { type: String, default: 'Guest' },
    inTime: { type: String, default: '' },
    outTime: { type: String, default: null },
    purpose: { type: String, default: 'Personal Visit' },
    idVerified: { type: Boolean, default: true },
    status: { type: String, enum: ['Currently Inside', 'Checked Out'], default: 'Currently Inside' },
  },
  { timestamps: true }
);

const attendanceSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    roomNumber: { type: String, required: true },
    type: { type: String, default: 'Gate Pass / Weekend Leave' },
    departureDate: { type: String, default: '' },
    expectedReturn: { type: String, default: '' },
    actualReturn: { type: String, default: null },
    destination: { type: String, default: 'Home' },
    parentConsent: { type: Boolean, default: true },
    status: { type: String, default: 'Approved' },
  },
  { timestamps: true }
);

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: 'General' },
    date: { type: String, default: '' },
    postedBy: { type: String, default: 'Chief Warden Office' },
    content: { type: String, required: true },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, default: '' },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'student'], default: 'student' },
    title: { type: String, default: '' },
    avatar: { type: String, default: '' },
    studentId: { type: String, default: '' },
    roomNumber: { type: String, default: '' },
    bedNumber: { type: String, default: '' },
    regNo: { type: String, default: '' },
  },
  { timestamps: true }
);

const hostelInfoSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Elite Palms Executive Residence' },
    tagline: { type: String, default: 'Smart Living, Premium Comfort & 24/7 Security' },
    warden: { type: String, default: 'Dr. V. K. Rao (Chief Warden)' },
    contactPhone: { type: String, default: '+91 98450 12345' },
    email: { type: String, default: 'admin@elitepalms.hostel' },
    address: { type: String, default: 'Plot 42, University Avenue, Knowledge City' },
    currency: { type: String, default: '₹' },
    curfewTime: { type: String, default: '10:00 PM' },
  },
  { timestamps: true }
);

export const RoomModel = mongoose.model('Room', roomSchema);
export const StudentModel = mongoose.model('Student', studentSchema);
export const FeeModel = mongoose.model('Fee', feeSchema);
export const ComplaintModel = mongoose.model('Complaint', complaintSchema);
export const MessMenuModel = mongoose.model('MessMenu', messMenuSchema);
export const VisitorModel = mongoose.model('Visitor', visitorSchema);
export const AttendanceModel = mongoose.model('Attendance', attendanceSchema);
export const NoticeModel = mongoose.model('Notice', noticeSchema);
export const UserModel = mongoose.model('User', userSchema);
export const HostelInfoModel = mongoose.model('HostelInfo', hostelInfoSchema);
