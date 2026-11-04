import React, { useState, useEffect } from 'react';
import {
  initialRooms,
  initialStudents,
  initialFees,
  initialComplaints,
  initialMessMenu,
  initialVisitors,
  initialAttendance,
  initialNotices,
  initialUsers,
  demoAccounts,
  defaultHostelInfo
} from './mockData';
import {
  LayoutDashboard,
  BedDouble,
  Users,
  CreditCard,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Building2,
  RefreshCw,
  Search,
  Filter,
  Download,
  Printer,
  QrCode,
  Calendar,
  ShieldCheck,
  Utensils,
  Bell,
  Phone,
  Mail,
  FileText,
  Check,
  X,
  ChevronRight,
  Eye,
  Edit,
  UserCheck,
  MapPin,
  Coffee,
  MessageCircle,
  LogIn,
  LogOut,
  Key,
  Shield,
  User,
  Lock,
  Unlock,
  Sparkles,
  Home
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export default function App() {
  // Current Logged-in User State (null = show Login Page)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hostel_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Login Form States
  const [loginRole, setLoginRole] = useState('admin'); // 'admin' | 'student'
  const [loginEmail, setLoginEmail] = useState('admin@hostel.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [serverOnline, setServerOnline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  // Core Data States
  const [hostelInfo, setHostelInfo] = useState(() => {
    const saved = localStorage.getItem('hostel_info');
    return saved ? JSON.parse(saved) : defaultHostelInfo;
  });

  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('hostel_rooms_pro');
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('hostel_students_pro');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [fees, setFees] = useState(() => {
    const saved = localStorage.getItem('hostel_fees_pro');
    return saved ? JSON.parse(saved) : initialFees;
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('hostel_complaints_pro');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  const [messMenu, setMessMenu] = useState(() => {
    const saved = localStorage.getItem('hostel_mess_pro');
    return saved ? JSON.parse(saved) : initialMessMenu;
  });

  const [visitors, setVisitors] = useState(() => {
    const saved = localStorage.getItem('hostel_visitors_pro');
    return saved ? JSON.parse(saved) : initialVisitors;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('hostel_attendance_pro');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem('hostel_notices_pro');
    return saved ? JSON.parse(saved) : initialNotices;
  });

  // Modal States
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddFee, setShowAddFee] = useState(false);
  const [showAddComplaint, setShowAddComplaint] = useState(false);
  const [showAddVisitor, setShowAddVisitor] = useState(false);
  const [showAddLeave, setShowAddLeave] = useState(false);
  const [showAddNotice, setShowAddNotice] = useState(false);

  // Detail / View Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [idCardStudent, setIdCardStudent] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [editingDayMenu, setEditingDayMenu] = useState(null);

  // Filters
  const [roomFilterBlock, setRoomFilterBlock] = useState('All');
  const [roomFilterFloor, setRoomFilterFloor] = useState('All');
  const [roomFilterStatus, setRoomFilterStatus] = useState('All');
  const [feeFilterStatus, setFeeFilterStatus] = useState('All');
  const [complaintFilterCat, setComplaintFilterCat] = useState('All');
  const [activeMenuDay, setActiveMenuDay] = useState('Monday');

  // New Entity Form States
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    block: 'Block A (Main Wing)',
    floor: 1,
    type: 'Double Sharing',
    capacity: 2,
    rent: 8500,
    amenities: ['Air Conditioner', 'Attached Washroom', 'High-Speed Wi-Fi']
  });

  const [newStudent, setNewStudent] = useState({
    name: '',
    phone: '',
    email: '',
    roomNumber: '',
    bedNumber: '',
    college: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'Father',
    bloodGroup: 'O+',
    idProofType: 'Aadhaar Card',
    idProofNumber: '',
    depositPaid: 15000
  });

  const [newFee, setNewFee] = useState({
    studentName: '',
    roomNumber: '',
    month: 'November 2024',
    category: 'Hostel Rent',
    amount: 8500,
    paymentMode: 'Pending',
    remarks: 'Monthly hostel dues'
  });

  const [newComplaint, setNewComplaint] = useState({
    studentName: '',
    studentPhone: '',
    roomNumber: '',
    category: 'Electrical',
    priority: 'Medium',
    issue: '',
    assignedStaff: 'Ramesh (Electrician)'
  });

  const [newVisitor, setNewVisitor] = useState({
    visitorName: '',
    visitorPhone: '',
    residentName: '',
    roomNumber: '',
    relation: 'Parent',
    purpose: 'Personal Visit'
  });

  const [newLeave, setNewLeave] = useState({
    studentName: '',
    roomNumber: '',
    type: 'Gate Pass / Weekend Leave',
    departureDate: new Date().toISOString().split('T')[0],
    expectedReturn: '',
    destination: 'Home'
  });

  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'General',
    content: '',
    isPinned: false
  });

  // Show Toast
  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Sync with Backend Server (Local Persistent DB)
  const syncWithBackend = async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      if (res.ok) {
        setServerOnline(true);
        const [rRes, sRes, fRes, cRes, mRes, vRes, aRes, nRes, infoRes] = await Promise.all([
          fetch(`${API_BASE}/rooms`),
          fetch(`${API_BASE}/students`),
          fetch(`${API_BASE}/fees`),
          fetch(`${API_BASE}/complaints`),
          fetch(`${API_BASE}/mess-menu`),
          fetch(`${API_BASE}/visitors`),
          fetch(`${API_BASE}/attendance`),
          fetch(`${API_BASE}/notices`),
          fetch(`${API_BASE}/hostel-info`),
        ]);

        if (rRes.ok) setRooms(await rRes.json());
        if (sRes.ok) setStudents(await sRes.json());
        if (fRes.ok) setFees(await fRes.json());
        if (cRes.ok) setComplaints(await cRes.json());
        if (mRes.ok) setMessMenu(await mRes.json());
        if (vRes.ok) setVisitors(await vRes.json());
        if (aRes.ok) setAttendance(await aRes.json());
        if (nRes.ok) setNotices(await nRes.json());
        if (infoRes.ok) setHostelInfo(await infoRes.json());
      } else {
        setServerOnline(false);
      }
    } catch {
      setServerOnline(false);
    }
  };

  useEffect(() => {
    syncWithBackend();
  }, []);

  // Sync LocalStorage
  useEffect(() => {
    localStorage.setItem('hostel_rooms_pro', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('hostel_students_pro', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('hostel_fees_pro', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('hostel_complaints_pro', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('hostel_mess_pro', JSON.stringify(messMenu));
  }, [messMenu]);

  useEffect(() => {
    localStorage.setItem('hostel_visitors_pro', JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem('hostel_attendance_pro', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('hostel_notices_pro', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('hostel_info', JSON.stringify(hostelInfo));
  }, [hostelInfo]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hostel_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hostel_current_user');
    }
  }, [currentUser]);

  // ================= AUTHENTICATION HANDLERS =================
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    const query = loginEmail.trim().toLowerCase();
    const pass = loginPassword.trim();

    if (!query || !pass) {
      setLoginError('Please enter your email or username and password');
      setIsSubmitting(false);
      return;
    }

    // Try backend authentication first
    if (serverOnline) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usernameOrEmail: query,
            password: pass,
            role: loginRole,
          }),
        });

        const data = await res.json();
        if (res.ok && data.user) {
          setCurrentUser(data.user);
          setActiveTab('dashboard');
          notify(`Welcome back, ${data.user.name}!`);
          setIsSubmitting(false);
          return;
        } else {
          setLoginError(data.error || 'Login failed. Check your credentials.');
          setIsSubmitting(false);
          return;
        }
      } catch (err) {
        console.warn('Backend login request failed, falling back to local validation:', err.message);
      }
    }

    // Local / Offline authentication fallback
    if (loginRole === 'admin') {
      const adminAcc = initialUsers.find(
        (u) =>
          u.role === 'admin' &&
          (u.email.toLowerCase() === query || u.username.toLowerCase() === query)
      );
      if (adminAcc && (adminAcc.password === pass || pass === 'admin123')) {
        const userObj = {
          id: adminAcc.id,
          name: adminAcc.name,
          email: adminAcc.email,
          role: 'admin',
          title: adminAcc.title || 'Hostel Administrator',
          avatar: adminAcc.avatar || 'VR',
        };
        setCurrentUser(userObj);
        setActiveTab('dashboard');
        notify(`Welcome back, ${userObj.name}!`);
      } else {
        setLoginError('Invalid admin credentials. Use: admin@hostel.com / admin123');
      }
    } else {
      // Student login
      const matchedStudent = students.find(
        (s) =>
          s.email.toLowerCase() === query ||
          (s.name && s.name.toLowerCase() === query) ||
          (s.regNo && s.regNo.toLowerCase() === query) ||
          (s.phone && s.phone === query)
      );

      const studentUser = initialUsers.find(
        (u) =>
          u.role === 'student' &&
          (u.email.toLowerCase() === query || u.username.toLowerCase() === query)
      );

      if ((matchedStudent || studentUser) && pass === 'student123') {
        const s = matchedStudent || students.find((item) => item.id === studentUser.studentId) || studentUser;
        const userObj = {
          id: s.id,
          studentId: s.id,
          name: s.name,
          email: s.email,
          role: 'student',
          roomNumber: s.roomNumber,
          bedNumber: s.bedNumber || `${s.roomNumber}-A`,
          regNo: s.regNo || 'HST-2024-001',
          title: `Resident (Room ${s.roomNumber})`,
          avatar: s.name.slice(0, 2).toUpperCase(),
        };
        setCurrentUser(userObj);
        setActiveTab('dashboard');
        notify(`Welcome, ${userObj.name}!`);
      } else {
        setLoginError('Invalid student credentials. Use: aarav.sharma@gmail.com / student123');
      }
    }

    setIsSubmitting(false);
  };

  const handleQuickDemoLogin = (role, email, password) => {
    setLoginRole(role);
    setLoginEmail(email);
    setLoginPassword(password);
    setLoginError('');

    // Instant login
    if (role === 'admin') {
      const userObj = {
        id: 'usr-admin-1',
        name: 'Dr. V. K. Rao',
        email: 'admin@hostel.com',
        role: 'admin',
        title: 'Chief Warden & Hostel Director',
        avatar: 'VR',
      };
      setCurrentUser(userObj);
      setActiveTab('dashboard');
      notify(`Logged in as Chief Warden (Admin)`);
    } else {
      const st = students.find((s) => s.email === email) || {
        id: 'std-1',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@gmail.com',
        roomNumber: '101',
        bedNumber: '101-A',
        regNo: 'HST-2024-001',
      };
      const userObj = {
        id: st.id,
        studentId: st.id,
        name: st.name,
        email: st.email,
        role: 'student',
        roomNumber: st.roomNumber,
        bedNumber: st.bedNumber || `${st.roomNumber}-A`,
        regNo: st.regNo || 'HST-2024-001',
        title: `Resident (Room ${st.roomNumber})`,
        avatar: st.name.slice(0, 2).toUpperCase(),
      };
      setCurrentUser(userObj);
      setActiveTab('dashboard');
      notify(`Logged in as Resident: ${st.name}`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    notify('Logged out successfully');
  };

  // Calculations for Admin Dashboard
  const totalCapacity = rooms.reduce((sum, r) => sum + Number(r.capacity || 0), 0);
  const totalOccupied = rooms.reduce((sum, r) => sum + Number(r.occupied || 0), 0);
  const availableBeds = Math.max(0, totalCapacity - totalOccupied);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  const totalCollectedFees = fees
    .filter((f) => f.status === 'Paid')
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const totalPendingFees = fees
    .filter((f) => f.status === 'Pending' || f.status === 'Overdue')
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);

  const openComplaintsCount = complaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const urgentComplaintsCount = complaints.filter((c) => c.priority === 'Urgent' && c.status !== 'Resolved').length;
  const activeVisitorsCount = visitors.filter((v) => v.status === 'Currently Inside').length;

  // Student specific data
  const myStudentData = currentUser && currentUser.role === 'student'
    ? students.find((s) => s.id === currentUser.studentId || s.email === currentUser.email) || currentUser
    : null;

  const myRoom = myStudentData
    ? rooms.find((r) => r.roomNumber === myStudentData.roomNumber)
    : null;

  const myRoommates = myRoom && myRoom.beds
    ? myRoom.beds.filter((b) => b.studentName && b.studentName !== currentUser?.name)
    : [];

  const myFees = currentUser && currentUser.role === 'student'
    ? fees.filter((f) => f.studentName === currentUser.name || (myStudentData && f.studentName === myStudentData.name))
    : [];

  const myPendingDues = myFees
    .filter((f) => f.status !== 'Paid')
    .reduce((s, f) => s + f.amount, 0);

  const myComplaints = currentUser && currentUser.role === 'student'
    ? complaints.filter((c) => c.studentName === currentUser.name || c.roomNumber === currentUser.roomNumber)
    : [];

  const myLeaves = currentUser && currentUser.role === 'student'
    ? attendance.filter((a) => a.studentName === currentUser.name)
    : [];

  // Handlers for Entity Operations
  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.roomNumber) return;

    if (serverOnline) {
      try {
        const res = await fetch(`${API_BASE}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRoom),
        });
        if (res.ok) {
          const saved = await res.json();
          setRooms([...rooms, saved]);
          notify(`Room ${saved.roomNumber} created successfully!`);
        } else {
          const err = await res.json();
          alert(err.error || 'Failed to add room');
          return;
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const cap = Number(newRoom.capacity) || 2;
      const beds = [];
      for (let i = 0; i < cap; i++) {
        beds.push({
          bedNumber: `${newRoom.roomNumber}-${String.fromCharCode(65 + i)}`,
          studentId: null,
          studentName: null,
        });
      }
      const roomObj = {
        ...newRoom,
        id: `rm-${Date.now()}`,
        capacity: cap,
        occupied: 0,
        rent: Number(newRoom.rent) || 8500,
        cleaningStatus: 'Clean',
        status: 'Available',
        beds,
      };
      setRooms([...rooms, roomObj]);
      notify(`Room ${roomObj.roomNumber} added!`);
    }

    setNewRoom({
      roomNumber: '',
      block: 'Block A (Main Wing)',
      floor: 1,
      type: 'Double Sharing',
      capacity: 2,
      rent: 8500,
      amenities: ['Air Conditioner', 'Attached Washroom', 'High-Speed Wi-Fi'],
    });
    setShowAddRoom(false);
  };

  const handleDeleteRoom = async (id) => {
    const room = rooms.find((r) => r.id === id);
    if (!room) return;
    if (room.occupied > 0) {
      alert(`Cannot delete Room ${room.roomNumber} while it has ${room.occupied} resident(s).`);
      return;
    }
    if (!window.confirm(`Delete Room ${room.roomNumber}?`)) return;

    if (serverOnline) {
      try {
        await fetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error(err);
      }
    }
    setRooms(rooms.filter((r) => r.id !== id));
    notify(`Room ${room.roomNumber} deleted`);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.roomNumber) return;

    if (serverOnline) {
      try {
        const res = await fetch(`${API_BASE}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStudent),
        });
        if (res.ok) {
          const saved = await res.json();
          setStudents([saved, ...students]);
          syncWithBackend();
          notify(`Resident ${saved.name} registered and bed allocated!`);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const studentId = `std-${Date.now()}`;
      const regNo = `HST-2024-${String(students.length + 1).padStart(3, '0')}`;
      const targetRoom = rooms.find((r) => r.roomNumber === newStudent.roomNumber);

      let assignedBed = newStudent.bedNumber;
      if (!assignedBed && targetRoom && targetRoom.beds) {
        const freeBed = targetRoom.beds.find((b) => !b.studentId);
        if (freeBed) assignedBed = freeBed.bedNumber;
      }

      const studentObj = {
        ...newStudent,
        id: studentId,
        regNo,
        bedNumber: assignedBed || `${newStudent.roomNumber}-A`,
        checkInDate: new Date().toISOString().split('T')[0],
        depositPaid: Number(newStudent.depositPaid) || 15000,
        monthlyRent: targetRoom ? targetRoom.rent : 8500,
        status: 'Active',
        emergencyContact: newStudent.guardianPhone ? `${newStudent.guardianPhone} (${newStudent.guardianRelation})` : newStudent.phone,
      };

      if (targetRoom) {
        const updatedRooms = rooms.map((r) => {
          if (r.id === targetRoom.id) {
            const updatedBeds = (r.beds || []).map((b) => {
              if (b.bedNumber === studentObj.bedNumber) {
                return { ...b, studentId: studentObj.id, studentName: studentObj.name };
              }
              return b;
            });
            const newOcc = r.occupied + 1;
            return {
              ...r,
              occupied: newOcc,
              status: newOcc >= r.capacity ? 'Occupied' : 'Available',
              beds: updatedBeds,
            };
          }
          return r;
        });
        setRooms(updatedRooms);
      }

      setStudents([studentObj, ...students]);
      notify(`Resident ${studentObj.name} registered!`);
    }

    setNewStudent({
      name: '',
      phone: '',
      email: '',
      roomNumber: '',
      bedNumber: '',
      college: '',
      guardianName: '',
      guardianPhone: '',
      guardianRelation: 'Father',
      bloodGroup: 'O+',
      idProofType: 'Aadhaar Card',
      idProofNumber: '',
      depositPaid: 15000,
    });
    setShowAddStudent(false);
  };

  const handleDeleteStudent = async (id) => {
    const student = students.find((s) => s.id === id);
    if (!student) return;
    if (!window.confirm(`Check out resident student ${student.name} from Room ${student.roomNumber}?`)) return;

    if (serverOnline) {
      try {
        await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
        syncWithBackend();
      } catch (err) {
        console.error(err);
      }
    } else {
      if (student.roomNumber) {
        setRooms(
          rooms.map((r) => {
            if (r.roomNumber === student.roomNumber) {
              const updatedBeds = (r.beds || []).map((b) => {
                if (b.studentId === student.id || b.bedNumber === student.bedNumber) {
                  return { ...b, studentId: null, studentName: null };
                }
                return b;
              });
              const newOcc = Math.max(0, r.occupied - 1);
              return {
                ...r,
                occupied: newOcc,
                status: newOcc >= r.capacity ? 'Occupied' : 'Available',
                beds: updatedBeds,
              };
            }
            return r;
          })
        );
      }
    }

    setStudents(students.filter((s) => s.id !== id));
    notify(`Resident ${student.name} checked out`);
  };

  const handleAddFee = async (e) => {
    e.preventDefault();
    if (!newFee.studentName) return;

    if (serverOnline) {
      try {
        const res = await fetch(`${API_BASE}/fees`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFee),
        });
        if (res.ok) {
          const saved = await res.json();
          setFees([saved, ...fees]);
          notify(`Invoice issued to ${saved.studentName}`);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const invCount = fees.length + 101;
      const feeObj = {
        id: `inv-${Date.now()}`,
        invoiceNo: `INV-2024-${invCount}`,
        studentId: '',
        studentName: newFee.studentName,
        roomNumber: newFee.roomNumber || '101',
        month: newFee.month,
        category: newFee.category,
        amount: Number(newFee.amount) || 8500,
        paidAmount: 0,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentDate: null,
        paymentMode: newFee.paymentMode || 'Pending',
        transactionId: '',
        status: 'Pending',
        remarks: newFee.remarks || 'Monthly invoice',
      };
      setFees([feeObj, ...fees]);
      notify(`Invoice issued to ${feeObj.studentName}`);
    }

    setNewFee({
      studentName: '',
      roomNumber: '',
      month: 'November 2024',
      category: 'Hostel Rent',
      amount: 8500,
      paymentMode: 'Pending',
      remarks: 'Monthly hostel dues',
    });
    setShowAddFee(false);
  };

  const toggleFeeStatus = async (id) => {
    const fee = fees.find((f) => f.id === id);
    if (!fee) return;

    const willBePaid = fee.status !== 'Paid';
    const updatedFee = {
      ...fee,
      status: willBePaid ? 'Paid' : 'Pending',
      paidAmount: willBePaid ? fee.amount : 0,
      paymentDate: willBePaid ? new Date().toISOString().split('T')[0] : null,
      paymentMode: willBePaid ? 'UPI' : 'Pending',
      transactionId: willBePaid ? `UPI-${Date.now().toString().slice(-8)}` : '',
    };

    if (serverOnline) {
      try {
        await fetch(`${API_BASE}/fees/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toggleStatus: true }),
        });
      } catch (err) {
        console.error(err);
      }
    }

    setFees(fees.map((f) => (f.id === id ? updatedFee : f)));
    notify(`Invoice ${fee.invoiceNo} marked as ${updatedFee.status}`);
  };

  const handleAddComplaint = async (e) => {
    e.preventDefault();
    if (!newComplaint.issue) return;

    const reporterName = currentUser && currentUser.role === 'student' ? currentUser.name : newComplaint.studentName || 'Resident';
    const reporterRoom = currentUser && currentUser.role === 'student' ? currentUser.roomNumber : newComplaint.roomNumber || '101';

    const complaintPayload = {
      ...newComplaint,
      studentName: reporterName,
      roomNumber: reporterRoom,
    };

    if (serverOnline) {
      try {
        const res = await fetch(`${API_BASE}/complaints`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(complaintPayload),
        });
        if (res.ok) {
          const saved = await res.json();
          setComplaints([saved, ...complaints]);
          notify(`Complaint logged with ticket #${saved.ticketNo}`);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const tktCount = complaints.length + 301;
      const complaintObj = {
        id: `tkt-${Date.now()}`,
        ticketNo: `TKT-${tktCount}`,
        studentName: reporterName,
        studentPhone: newComplaint.studentPhone || '',
        roomNumber: reporterRoom,
        category: newComplaint.category,
        priority: newComplaint.priority,
        issue: newComplaint.issue,
        status: 'Open',
        assignedStaff: newComplaint.assignedStaff,
        loggedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        resolvedAt: null,
        resolutionNotes: '',
      };
      setComplaints([complaintObj, ...complaints]);
      notify(`Complaint logged with ticket #${complaintObj.ticketNo}`);
    }

    setNewComplaint({
      studentName: '',
      studentPhone: '',
      roomNumber: '',
      category: 'Electrical',
      priority: 'Medium',
      issue: '',
      assignedStaff: 'Ramesh (Electrician)',
    });
    setShowAddComplaint(false);
  };

  const toggleComplaintStatus = async (id) => {
    const complaint = complaints.find((c) => c.id === id);
    if (!complaint) return;

    const nextStatus = complaint.status === 'Resolved' ? 'Open' : 'Resolved';
    const updated = {
      ...complaint,
      status: nextStatus,
      resolvedAt: nextStatus === 'Resolved' ? new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : null,
    };

    if (serverOnline) {
      try {
        await fetch(`${API_BASE}/complaints/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toggleStatus: true }),
        });
      } catch (err) {
        console.error(err);
      }
    }

    setComplaints(complaints.map((c) => (c.id === id ? updated : c)));
    notify(`Ticket #${complaint.ticketNo} marked as ${nextStatus}`);
  };

  const handleAddVisitor = async (e) => {
    e.preventDefault();
    if (!newVisitor.visitorName || !newVisitor.residentName) return;

    const visObj = {
      id: `vis-${Date.now()}`,
      visitorName: newVisitor.visitorName,
      visitorPhone: newVisitor.visitorPhone || '',
      residentName: newVisitor.residentName,
      roomNumber: newVisitor.roomNumber || '101',
      relation: newVisitor.relation,
      inTime: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      outTime: null,
      purpose: newVisitor.purpose || 'Personal Visit',
      idVerified: true,
      status: 'Currently Inside',
    };

    if (serverOnline) {
      try {
        const res = await fetch(`${API_BASE}/visitors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVisitor),
        });
        if (res.ok) {
          const saved = await res.json();
          setVisitors([saved, ...visitors]);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setVisitors([visObj, ...visitors]);
    }

    notify(`Visitor ${newVisitor.visitorName} checked in`);
    setNewVisitor({ visitorName: '', visitorPhone: '', residentName: '', roomNumber: '', relation: 'Parent', purpose: 'Personal Visit' });
    setShowAddVisitor(false);
  };

  const handleCheckoutVisitor = async (id) => {
    const visitor = visitors.find((v) => v.id === id);
    if (!visitor) return;

    const updated = {
      ...visitor,
      status: 'Checked Out',
      outTime: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    };

    if (serverOnline) {
      try {
        await fetch(`${API_BASE}/visitors/${id}/checkout`, { method: 'PUT' });
      } catch (err) {
        console.error(err);
      }
    }

    setVisitors(visitors.map((v) => (v.id === id ? updated : v)));
    notify(`Visitor ${visitor.visitorName} checked out`);
  };

  const handleAddLeave = async (e) => {
    e.preventDefault();
    const stName = currentUser && currentUser.role === 'student' ? currentUser.name : newLeave.studentName;
    const stRoom = currentUser && currentUser.role === 'student' ? currentUser.roomNumber : newLeave.roomNumber || '101';
    if (!stName) return;

    const leaveObj = {
      id: `att-${Date.now()}`,
      studentName: stName,
      roomNumber: stRoom,
      type: newLeave.type,
      departureDate: newLeave.departureDate,
      expectedReturn: newLeave.expectedReturn || 'Next Day 09:00 PM',
      actualReturn: null,
      destination: newLeave.destination || 'Home',
      parentConsent: true,
      status: 'Approved',
    };

    if (serverOnline) {
      try {
        const res = await fetch(`${API_BASE}/attendance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leaveObj),
        });
        if (res.ok) {
          const saved = await res.json();
          setAttendance([saved, ...attendance]);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setAttendance([leaveObj, ...attendance]);
    }

    notify(`Gate Pass issued for ${stName}`);
    setNewLeave({ studentName: '', roomNumber: '', type: 'Gate Pass / Weekend Leave', departureDate: new Date().toISOString().split('T')[0], expectedReturn: '', destination: 'Home' });
    setShowAddLeave(false);
  };

  const handleAddNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;

    const noticeObj = {
      id: `not-${Date.now()}`,
      title: newNotice.title,
      category: newNotice.category,
      date: new Date().toISOString().split('T')[0],
      postedBy: 'Chief Warden Office',
      content: newNotice.content,
      isPinned: newNotice.isPinned,
    };

    if (serverOnline) {
      try {
        const res = await fetch(`${API_BASE}/notices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNotice),
        });
        if (res.ok) {
          const saved = await res.json();
          setNotices([saved, ...notices]);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setNotices([noticeObj, ...notices]);
    }

    notify(`Notice "${newNotice.title}" published`);
    setNewNotice({ title: '', category: 'General', content: '', isPinned: false });
    setShowAddNotice(false);
  };

  const handleExportData = () => {
    const fullBackup = {
      hostelInfo,
      rooms,
      students,
      fees,
      complaints,
      messMenu,
      visitors,
      attendance,
      notices,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hostel_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Hostel database exported successfully!');
  };

  const handleResetData = async () => {
    if (!window.confirm('Reload enterprise demo dataset?')) return;
    if (serverOnline) {
      try {
        await fetch(`${API_BASE}/reset`, { method: 'POST' });
        await syncWithBackend();
        notify('Enterprise dataset reloaded!');
        return;
      } catch (err) {
        console.error(err);
      }
    }

    setRooms(initialRooms);
    setStudents(initialStudents);
    setFees(initialFees);
    setComplaints(initialComplaints);
    setMessMenu(initialMessMenu);
    setVisitors(initialVisitors);
    setAttendance(initialAttendance);
    setNotices(initialNotices);
    setHostelInfo(defaultHostelInfo);
    notify('Enterprise dataset reloaded!');
  };

  // Filtered Lists (Admin)
  const filteredRooms = rooms.filter((r) => {
    const matchBlock = roomFilterBlock === 'All' || (r.block && r.block.includes(roomFilterBlock));
    const matchFloor = roomFilterFloor === 'All' || String(r.floor) === String(roomFilterFloor);
    const matchStatus = roomFilterStatus === 'All' || r.status === roomFilterStatus;
    const matchSearch =
      !searchQuery ||
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.type && r.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.beds && r.beds.some((b) => b.studentName && b.studentName.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchBlock && matchFloor && matchStatus && matchSearch;
  });

  const filteredStudents = students.filter((s) => {
    return (
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.regNo && s.regNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.phone && s.phone.includes(searchQuery)) ||
      (s.college && s.college.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const filteredFees = fees.filter((f) => {
    const matchStatus = feeFilterStatus === 'All' || f.status === feeFilterStatus;
    const matchSearch =
      !searchQuery ||
      f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.invoiceNo && f.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const filteredComplaints = complaints.filter((c) => {
    const matchCat = complaintFilterCat === 'All' || c.category === complaintFilterCat;
    const matchSearch =
      !searchQuery ||
      c.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.ticketNo && c.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // ================= RENDER: LOGIN SCREEN (IF NOT LOGGED IN) =================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-indigo-500 selection:text-white">
        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-6 right-6 z-50 animate-fade-in">
            <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{notification.msg}</span>
            </div>
          </div>
        )}

        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          {/* Logo & Heading */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/25">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-3">
              {hostelInfo.name}
            </h1>
            <p className="text-xs text-indigo-300 font-medium">
              Smart Hostel & Resident Management Portal
            </p>
          </div>

          {/* Role Segmented Switch */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setLoginRole('admin');
                setLoginEmail('admin@hostel.com');
                setLoginPassword('admin123');
                setLoginError('');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition ${loginRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginRole('student');
                setLoginEmail('aarav.sharma@gmail.com');
                setLoginPassword('student123');
                setLoginError('');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition ${loginRole === 'student'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <User className="w-4 h-4" />
              Resident / User
            </button>
          </div>

          {/* Error Message Alert */}
          {loginError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                {loginRole === 'admin' ? 'Admin Email / Username' : 'Resident Email / Reg No / Username'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={loginRole === 'admin' ? 'admin@hostel.com' : 'aarav.sharma@gmail.com'}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white pl-9 pr-10 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <Unlock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 text-white font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider ${loginRole === 'admin'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-indigo-600/30'
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-violet-600/30'
                }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Signing In...' : `Sign In as ${loginRole === 'admin' ? 'Administrator' : 'Resident'}`}</span>
            </button>
          </form>

          {/* Quick 1-Click Demo Buttons */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold flex items-center gap-1 text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                1-Click Instant Demo Access:
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin', 'admin@hostel.com', 'admin123')}
                className="p-2.5 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/60 rounded-xl text-left transition"
              >
                <div className="flex items-center gap-1 font-bold text-indigo-300">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  Chief Warden
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">admin123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student', 'aarav.sharma@gmail.com', 'student123')}
                className="p-2.5 bg-violet-950/60 hover:bg-violet-900/80 border border-violet-800/60 rounded-xl text-left transition"
              >
                <div className="flex items-center gap-1 font-bold text-violet-300">
                  <User className="w-3.5 h-3.5 text-violet-400" />
                  Aarav (Room 101)
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">student123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student', 'vikram.roy@business.edu', 'student123')}
                className="p-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition"
              >
                <div className="flex items-center gap-1 font-bold text-slate-200">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Vikram (Room 102)
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">student123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student', 'priya.iyer@med.edu', 'student123')}
                className="p-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition"
              >
                <div className="flex items-center gap-1 font-bold text-slate-200">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Priya (Room 201)
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">student123</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= RENDER: LOGGED IN APPLICATION =================
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Main App Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold tracking-tight text-white leading-none">
                    {hostelInfo.name}
                  </h1>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${isAdmin
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      }`}
                  >
                    {isAdmin ? 'ADMIN PORTAL' : `RESIDENT (${currentUser.roomNumber || 'PORTAL'})`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
                  {hostelInfo.tagline}
                </p>
              </div>
            </div>

            {/* Global Search Bar (Admin Only) */}
            {isAdmin && (
              <div className="flex-1 max-w-md hidden md:block">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search resident, room #, invoice, ticket..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 text-white pl-9 pr-8 py-1.5 rounded-xl text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* User Profile Chip & Actions */}
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => setShowQuickAction(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Action</span>
                </button>
              )}

              {/* Logged in User Badge */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow">
                  {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-indigo-300 font-medium">{currentUser.title || currentUser.role}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-slate-800 rounded-xl transition border border-slate-700 ml-1"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-slate-900/95 border-t border-slate-800/80 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            {isAdmin ? (
              // ADMIN NAVIGATION TABS
              [
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'rooms', label: 'Rooms & Beds', icon: BedDouble, count: rooms.length },
                { id: 'students', label: 'Residents', icon: Users, count: students.length },
                { id: 'fees', label: 'Fees & Accounts', icon: CreditCard },
                { id: 'complaints', label: 'Maintenance', icon: AlertCircle, count: openComplaintsCount, badge: urgentComplaintsCount > 0 ? 'Urgent' : null },
                { id: 'mess', label: 'Mess & Meals', icon: Utensils },
                { id: 'security', label: 'Visitors & Gate Pass', icon: ShieldCheck, count: activeVisitorsCount },
                { id: 'notices', label: 'Notices', icon: Bell, count: notices.length },
                { id: 'settings', label: 'Settings & Backup', icon: Download },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                          }`}
                      >
                        {tab.count}
                      </span>
                    )}
                    {tab.badge && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    )}
                  </button>
                );
              })
            ) : (
              // RESIDENT / STUDENT NAVIGATION TABS
              [
                { id: 'dashboard', label: 'My Resident Hub', icon: Home },
                { id: 'my-room', label: 'My Room & Roommates', icon: BedDouble },
                { id: 'my-fees', label: 'My Fee Invoices', icon: CreditCard, count: myFees.filter((f) => f.status !== 'Paid').length },
                { id: 'my-complaints', label: 'Maintenance Requests', icon: AlertCircle, count: myComplaints.filter((c) => c.status !== 'Resolved').length },
                { id: 'mess', label: 'Mess Menu', icon: Utensils },
                { id: 'my-leaves', label: 'Gate Passes & Leave', icon: ShieldCheck },
                { id: 'notices', label: 'Hostel Notices', icon: Bell, count: notices.length },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${isActive
                        ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500 text-slate-900">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ========================================================================= */}
        {/* ======================= ROLE 1: RESIDENT / STUDENT VIEW ================= */}
        {/* ========================================================================= */}
        {!isAdmin && (
          <div className="space-y-6 animate-fade-in">
            {/* RESIDENT TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-500 to-purple-500 text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-violet-400/30">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-violet-300 uppercase tracking-wider bg-violet-500/20 px-2 py-0.5 rounded-full border border-violet-400/30">
                        Resident Portal Active
                      </span>
                      <h2 className="text-2xl font-black mt-1">Hello, {currentUser.name}!</h2>
                      <p className="text-xs text-indigo-200 mt-0.5">
                        Room {currentUser.roomNumber} ({currentUser.bedNumber}) • Registration #{currentUser.regNo}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setIdCardStudent(myStudentData || currentUser)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-violet-900 hover:bg-violet-50 font-bold text-xs rounded-xl shadow transition"
                    >
                      <QrCode className="w-4 h-4" />
                      View Digital ID
                    </button>

                    <button
                      onClick={() => setShowAddComplaint(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-700 hover:bg-violet-600 text-white font-bold text-xs rounded-xl border border-violet-400/30 shadow transition"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Report Room Issue
                    </button>
                  </div>
                </div>

                {/* Resident Quick KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: My Room */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Assigned Room</span>
                        <BedDouble className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="mt-2 text-2xl font-black text-slate-900">
                        Room {currentUser.roomNumber}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Bed Slot: <strong className="text-slate-800">{currentUser.bedNumber}</strong></p>
                    </div>
                    <div className="mt-4 pt-3 border-t text-xs flex justify-between">
                      <span className="text-slate-500">{myRoommates.length} roommate(s)</span>
                      <button onClick={() => setActiveTab('my-room')} className="font-bold text-indigo-600 hover:underline">
                        Room Details →
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Fee Balance */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">My Dues</span>
                        <CreditCard className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="mt-2 text-2xl font-black text-slate-900">
                        {myPendingDues > 0 ? (
                          <span className="text-amber-600">₹{myPendingDues.toLocaleString()}</span>
                        ) : (
                          <span className="text-emerald-600">All Paid</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {myPendingDues > 0 ? 'Pending monthly invoice' : 'No overdue bills'}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t text-xs flex justify-between">
                      <span className="text-slate-500">{myFees.length} total bills</span>
                      <button onClick={() => setActiveTab('my-fees')} className="font-bold text-emerald-700 hover:underline">
                        View Receipts →
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Complaints */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Maintenance</span>
                        <AlertCircle className="w-5 h-5 text-rose-600" />
                      </div>
                      <div className="mt-2 text-2xl font-black text-slate-900">
                        {myComplaints.filter((c) => c.status !== 'Resolved').length} Active
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Room service tickets</p>
                    </div>
                    <div className="mt-4 pt-3 border-t text-xs flex justify-between">
                      <span className="text-slate-500">{myComplaints.length} tickets logged</span>
                      <button onClick={() => setActiveTab('my-complaints')} className="font-bold text-rose-600 hover:underline">
                        Track Status →
                      </button>
                    </div>
                  </div>

                  {/* Card 4: Curfew & Notice */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Night Curfew</span>
                        <Clock className="w-5 h-5 text-violet-600" />
                      </div>
                      <div className="mt-2 text-2xl font-black text-slate-900">
                        {hostelInfo.curfewTime}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Daily roll call cutoff</p>
                    </div>
                    <div className="mt-4 pt-3 border-t text-xs flex justify-between">
                      <span className="text-slate-500">Need overnight leave?</span>
                      <button onClick={() => setShowAddLeave(true)} className="font-bold text-violet-600 hover:underline">
                        Apply Leave →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resident Overview Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* My Pending Invoices */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        My Hostel Invoices
                      </h3>
                      <button onClick={() => setActiveTab('my-fees')} className="text-xs text-indigo-600 font-bold hover:underline">
                        All Invoices →
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {myFees.slice(0, 3).map((f) => (
                        <div key={f.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800">{f.category} ({f.month})</span>
                            <span className="block text-[11px] text-slate-400 font-mono">{f.invoiceNo}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-slate-900 text-sm">₹{f.amount.toLocaleString()}</span>
                            <button
                              onClick={() => toggleFeeStatus(f.id)}
                              className={`px-3 py-1 rounded-lg font-bold text-xs ${f.status === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                            >
                              {f.status === 'Paid' ? 'Paid ✓' : 'Pay Now'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hostel Pinned Notices */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-600" />
                        Hostel Circulars & Alerts
                      </h3>
                      <button onClick={() => setActiveTab('notices')} className="text-xs text-indigo-600 font-bold hover:underline">
                        All Notices →
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {notices.slice(0, 3).map((n) => (
                        <div key={n.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-900">{n.title}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                              {n.category}
                            </span>
                          </div>
                          <p className="text-slate-600 line-clamp-2">{n.content}</p>
                          <p className="text-[10px] text-slate-400">{n.postedBy} • {n.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RESIDENT TAB: MY ROOM & ROOMMATES */}
            {activeTab === 'my-room' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 uppercase">Room Details</span>
                      <h2 className="text-2xl font-black text-slate-900">Room {currentUser.roomNumber}</h2>
                      <p className="text-xs text-slate-500">{myRoom ? myRoom.block : 'Main Wing'} • Bed Slot {currentUser.bedNumber}</p>
                    </div>

                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                      Status: Active Resident
                    </span>
                  </div>

                  {/* Roommates Grid */}
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-3">My Roommates in Room {currentUser.roomNumber}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {/* Self */}
                      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase bg-indigo-100 px-2 py-0.5 rounded">
                          Your Bed ({currentUser.bedNumber})
                        </span>
                        <h4 className="font-black text-slate-900 text-base mt-2">{currentUser.name}</h4>
                        <p className="text-slate-500 mt-0.5">{currentUser.email}</p>
                      </div>

                      {/* Other beds */}
                      {myRoom && (myRoom.beds || []).filter((b) => b.bedNumber !== currentUser.bedNumber).map((b) => (
                        <div key={b.bedNumber} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                          <span className="text-[10px] font-bold text-slate-600 uppercase bg-slate-200 px-2 py-0.5 rounded">
                            Bed {b.bedNumber}
                          </span>
                          <h4 className="font-black text-slate-900 text-base mt-2">
                            {b.studentName || 'Vacant Bed'}
                          </h4>
                          <p className="text-slate-500 mt-0.5">{b.studentName ? 'Fellow Resident' : 'Unassigned Bed Slot'}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Room Amenities */}
                  {myRoom && myRoom.amenities && (
                    <div className="border-t pt-4">
                      <h3 className="font-bold text-slate-800 text-sm mb-2">Room Amenities Included</h3>
                      <div className="flex flex-wrap gap-2">
                        {myRoom.amenities.map((am) => (
                          <span key={am} className="px-3 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs">
                            ✓ {am}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RESIDENT TAB: MY FEES */}
            {activeTab === 'my-fees' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">My Fee Invoices & Tax Receipts</h2>
                      <p className="text-xs text-slate-500">View payment history and download verified formal receipts.</p>
                    </div>
                    <span className="font-bold text-sm text-slate-800">
                      Total Bills: {myFees.length}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {myFees.map((fee) => (
                      <div key={fee.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-700">{fee.invoiceNo}</span>
                            <span className="font-bold text-slate-900 text-sm">{fee.category}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${fee.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}
                            >
                              {fee.status}
                            </span>
                          </div>
                          <p className="text-slate-500 mt-1">
                            Cycle: {fee.month} • Due Date: {fee.dueDate} {fee.paymentDate ? `• Paid on: ${fee.paymentDate}` : ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-lg font-black text-slate-900">₹{fee.amount.toLocaleString()}</span>
                          {fee.status !== 'Paid' ? (
                            <button
                              onClick={() => toggleFeeStatus(fee.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedReceipt(fee)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              Receipt
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {myFees.length === 0 && (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No invoices billed to your account yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* RESIDENT TAB: MY COMPLAINTS */}
            {activeTab === 'my-complaints' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">My Room Maintenance Requests</h2>
                    <p className="text-xs text-slate-500">Log repair tickets directly to hostel facilities staff.</p>
                  </div>
                  <button
                    onClick={() => setShowAddComplaint(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Request
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myComplaints.map((c) => (
                    <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-700">{c.ticketNo}</span>
                          <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{c.category}</span>
                        </div>
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full ${c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                        >
                          {c.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-800 text-sm">{c.issue}</h4>
                      <p className="text-slate-500">Assigned Staff: <strong className="text-slate-700">{c.assignedStaff}</strong></p>
                      {c.resolutionNotes && (
                        <p className="text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                          Staff Note: {c.resolutionNotes}
                        </p>
                      )}
                    </div>
                  ))}

                  {myComplaints.length === 0 && (
                    <div className="col-span-2 bg-white p-8 text-center text-xs text-slate-400 rounded-2xl border">
                      You have no active maintenance issues!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RESIDENT TAB: MESS MENU */}
            {activeTab === 'mess' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Hostel Weekly Mess Menu</h2>
                    <p className="text-xs text-slate-500">7-Day nutritional meal plan and timings.</p>
                  </div>
                  <div className="flex items-center gap-1 overflow-x-auto py-1">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <button
                        key={day}
                        onClick={() => setActiveMenuDay(day)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeMenuDay === day
                            ? 'bg-violet-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {(() => {
                  const menu = messMenu.find((m) => m.day.toLowerCase() === activeMenuDay.toLowerCase()) || messMenu[0];
                  if (!menu) return null;
                  return (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                      <div className="border-b pb-3">
                        <span className="text-xs font-bold text-violet-600 uppercase">{menu.day} Meal Schedule</span>
                        <h3 className="text-2xl font-black text-slate-900">{menu.type || 'Standard Menu'}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/60 text-xs">
                          <span className="font-bold text-amber-900 block mb-1">🍳 Breakfast (07:30 - 09:30 AM)</span>
                          <p className="text-slate-700">{menu.breakfast}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/60 text-xs">
                          <span className="font-bold text-emerald-900 block mb-1">🍛 Lunch (12:30 - 02:30 PM)</span>
                          <p className="text-slate-700">{menu.lunch}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200/60 text-xs">
                          <span className="font-bold text-orange-900 block mb-1">☕ Snacks (05:00 - 06:15 PM)</span>
                          <p className="text-slate-700">{menu.snacks}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200/60 text-xs">
                          <span className="font-bold text-indigo-900 block mb-1">🍲 Dinner (08:00 - 10:00 PM)</span>
                          <p className="text-slate-700">{menu.dinner}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* RESIDENT TAB: MY LEAVES & GATE PASSES */}
            {activeTab === 'my-leaves' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">My Gate Passes & Curfew Leaves</h2>
                    <p className="text-xs text-slate-500">Apply for overnight leaves and check security clearance.</p>
                  </div>
                  <button
                    onClick={() => setShowAddLeave(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Request Gate Pass
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 divide-y text-xs">
                  {myLeaves.map((l) => (
                    <div key={l.id} className="p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{l.type}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {l.status}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">Destination: <strong>{l.destination}</strong></p>
                        <p className="text-[11px] text-slate-400">Departure: {l.departureDate} • Return: {l.expectedReturn}</p>
                      </div>
                    </div>
                  ))}

                  {myLeaves.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No gate passes requested. Use the button above when traveling or staying out late.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RESIDENT TAB: NOTICES */}
            {activeTab === 'notices' && (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <h2 className="text-xl font-black text-slate-900">Hostel Bulletin Board</h2>
                  <p className="text-xs text-slate-500">Official circulars, maintenance schedules and directives.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notices.map((n) => (
                    <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                          {n.category}
                        </span>
                        {n.isPinned && <span className="font-bold text-amber-700 text-[10px]">📌 Pinned</span>}
                      </div>
                      <h3 className="font-black text-slate-900 text-sm">{n.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{n.content}</p>
                      <p className="text-[10px] text-slate-400 pt-2 border-t">{n.postedBy} • {n.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ======================= ROLE 2: ADMIN / WARDEN VIEW ===================== */}
        {/* ========================================================================= */}
        {isAdmin && (
          <div className="space-y-6 animate-fade-in">
            {/* ================= 1. TAB: DASHBOARD ================= */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Top Headline Banner */}
                <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="inline-block bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2 uppercase tracking-wider">
                      Hostel Operations Command Center
                    </span>
                    <h2 className="text-2xl font-black tracking-tight">
                      Welcome, {currentUser.name}
                    </h2>
                    <p className="text-xs text-indigo-200 mt-1 max-w-xl">
                      {hostelInfo.warden} • Contact: {hostelInfo.contactPhone} • Curfew: {hostelInfo.curfewTime}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setShowAddStudent(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow transition"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Check-in Resident
                    </button>
                    <button
                      onClick={() => setShowAddFee(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600/70 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl border border-indigo-400/30 shadow transition"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Issue Fee Invoice
                    </button>
                    <button
                      onClick={() => setShowAddLeave(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-700 shadow transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Gate Pass
                    </button>
                  </div>
                </div>

                {/* KPI Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Bed Occupancy */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bed Occupancy</span>
                        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                          <BedDouble className="w-5 h-5" />
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-800">{occupancyRate}%</span>
                        <span className="text-xs text-slate-500 font-semibold">({totalOccupied}/{totalCapacity} Beds)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${occupancyRate > 85 ? 'bg-amber-500' : 'bg-indigo-600'
                            }`}
                          style={{ width: `${Math.min(100, occupancyRate)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                      <span>{availableBeds} beds vacant</span>
                      <span className="text-indigo-600 font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('rooms')}>
                        View Map →
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Fee Collections */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Collected Dues</span>
                        <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                          <CreditCard className="w-5 h-5" />
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-black text-emerald-600">₹{totalCollectedFees.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-amber-600 font-semibold mt-1">
                        ₹{totalPendingFees.toLocaleString()} pending this month
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                      <span>{fees.filter((f) => f.status === 'Paid').length} invoices paid</span>
                      <span className="text-emerald-700 font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('fees')}>
                        Ledger →
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Residents */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Residents</span>
                        <span className="p-2 bg-violet-50 text-violet-600 rounded-xl">
                          <Users className="w-5 h-5" />
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-800">{students.length}</span>
                        <span className="text-xs text-violet-600 font-semibold">Registered</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Across {rooms.length} rooms in 2 blocks</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                      <span>100% verified IDs</span>
                      <span className="text-violet-600 font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('students')}>
                        Directory →
                      </span>
                    </div>
                  </div>

                  {/* Card 4: Maintenance Tickets */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Open Complaints</span>
                        <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                          <AlertCircle className="w-5 h-5" />
                        </span>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-black text-rose-600">{openComplaintsCount}</span>
                        <span className="text-xs text-slate-500 font-semibold">Tickets Active</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {urgentComplaintsCount > 0 ? (
                          <span className="text-rose-600 font-bold">⚠️ {urgentComplaintsCount} urgent attention</span>
                        ) : (
                          'All tickets within SLA'
                        )}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                      <span>{complaints.filter((c) => c.status === 'Resolved').length} resolved</span>
                      <span className="text-rose-600 font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('complaints')}>
                        Helpdesk →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Summary Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Floor Occupancy Matrix Preview */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-600" />
                        Floor & Wing Overview
                      </h3>
                      <button onClick={() => setActiveTab('rooms')} className="text-xs text-indigo-600 font-bold hover:underline">
                        Manage →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {[1, 2, 3].map((fl) => {
                        const floorRooms = rooms.filter((r) => r.floor === fl);
                        const flCap = floorRooms.reduce((s, r) => s + r.capacity, 0);
                        const flOcc = floorRooms.reduce((s, r) => s + r.occupied, 0);
                        const pct = flCap > 0 ? Math.round((flOcc / flCap) * 100) : 0;
                        return (
                          <div key={fl} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span>Floor {fl}</span>
                              <span>
                                {flOcc}/{flCap} Beds ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Immediate Attention Alert Box */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        Urgent Maintenance
                      </h3>
                      <button onClick={() => setActiveTab('complaints')} className="text-xs text-indigo-600 font-bold hover:underline">
                        View All →
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {complaints
                        .filter((c) => c.status !== 'Resolved')
                        .slice(0, 3)
                        .map((c) => (
                          <div key={c.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 uppercase">
                                  {c.priority}
                                </span>
                                <span className="text-xs font-bold text-slate-800">Room {c.roomNumber}</span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-1">{c.issue}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Staff: {c.assignedStaff}</p>
                            </div>
                            <button
                              onClick={() => toggleComplaintStatus(c.id)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition whitespace-nowrap"
                            >
                              Resolve
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Today's Mess & Visitors */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-amber-600" />
                        Today's Mess Schedule
                      </h3>
                      <button onClick={() => setActiveTab('mess')} className="text-xs text-indigo-600 font-bold hover:underline">
                        Full Menu →
                      </button>
                    </div>

                    {messMenu[0] && (
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl">
                          <span className="font-bold text-amber-900 block">🍳 Breakfast</span>
                          <p className="text-slate-600 mt-0.5 line-clamp-1">{messMenu[0].breakfast}</p>
                        </div>
                        <div className="p-2.5 bg-indigo-50/70 border border-indigo-200/60 rounded-xl">
                          <span className="font-bold text-indigo-900 block">🍛 Lunch</span>
                          <p className="text-slate-600 mt-0.5 line-clamp-1">{messMenu[0].lunch}</p>
                        </div>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                          <span className="font-bold text-slate-800 block">🍲 Dinner</span>
                          <p className="text-slate-600 mt-0.5 line-clamp-1">{messMenu[0].dinner}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ================= 2. TAB: ROOMS & BEDS ================= */}
            {activeTab === 'rooms' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">Rooms & Bed Allocation Matrix</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Visual floor layout with individual bed-slot allocations and occupancy status.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={roomFilterFloor}
                      onChange={(e) => setRoomFilterFloor(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:outline-none"
                    >
                      <option value="All">All Floors</option>
                      <option value="1">Floor 1</option>
                      <option value="2">Floor 2</option>
                      <option value="3">Floor 3</option>
                    </select>

                    <select
                      value={roomFilterStatus}
                      onChange={(e) => setRoomFilterStatus(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>

                    <button
                      onClick={() => setShowAddRoom(true)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Room
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredRooms.map((room) => {
                    const isFull = room.occupied >= room.capacity;
                    return (
                      <div
                        key={room.id}
                        className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:border-indigo-300 transition"
                      >
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-slate-800">Room {room.roomNumber}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                  Floor {room.floor}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium">{room.block}</p>
                            </div>
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-full ${room.status === 'Maintenance'
                                  ? 'bg-rose-100 text-rose-700'
                                  : isFull
                                    ? 'bg-slate-200 text-slate-700'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                            >
                              {room.status === 'Maintenance' ? 'Under Maintenance' : isFull ? 'Full Occupancy' : 'Available'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-4">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-600">{room.type}</span>
                            <span className="font-extrabold text-slate-900 text-sm">₹{room.rent.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span></span>
                          </div>

                          <div>
                            <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 mb-2">
                              <span>BED ALLOCATION ({room.occupied}/{room.capacity})</span>
                              <span className={room.cleaningStatus === 'Clean' ? 'text-emerald-600' : 'text-amber-600'}>
                                ● {room.cleaningStatus}
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              {(room.beds || []).map((bed) => (
                                <div
                                  key={bed.bedNumber}
                                  className={`flex items-center justify-between p-2 rounded-xl text-xs border ${bed.studentName
                                      ? 'bg-indigo-50/60 border-indigo-100 text-indigo-900'
                                      : 'bg-slate-50 border-dashed border-slate-200 text-slate-400'
                                    }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-[11px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                                      {bed.bedNumber}
                                    </span>
                                    <span className="font-semibold">
                                      {bed.studentName ? bed.studentName : 'Vacant Bed'}
                                    </span>
                                  </div>

                                  {bed.studentName ? (
                                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                                      Occupied
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setNewStudent({ ...newStudent, roomNumber: room.roomNumber, bedNumber: bed.bedNumber });
                                        setShowAddStudent(true);
                                      }}
                                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                                    >
                                      + Assign Resident
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 pt-1">
                            {(room.amenities || []).map((am) => (
                              <span key={am} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                                {am}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
                          <button
                            onClick={() => {
                              const updated = rooms.map((r) =>
                                r.id === room.id
                                  ? { ...r, cleaningStatus: r.cleaningStatus === 'Clean' ? 'Needs Cleaning' : 'Clean' }
                                  : r
                              );
                              setRooms(updated);
                              notify(`Room ${room.roomNumber} cleanliness updated`);
                            }}
                            className="text-slate-500 hover:text-slate-800 font-semibold"
                          >
                            Toggle Cleanliness
                          </button>

                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                            title="Delete Room"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= 3. TAB: RESIDENTS / STUDENTS ================= */}
            {activeTab === 'students' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">Resident Student Directory</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Complete registry with digital student ID cards, bed allocations & contact info.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddStudent(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Register Resident
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3.5 px-4">Resident</th>
                          <th className="py-3.5 px-4">Room & Bed</th>
                          <th className="py-3.5 px-4">College / Course</th>
                          <th className="py-3.5 px-4">Contact Phone</th>
                          <th className="py-3.5 px-4">Guardian / Emergency</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                  {student.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-extrabold text-slate-900">{student.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{student.regNo}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg text-xs">
                                Room {student.roomNumber} ({student.bedNumber})
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 font-medium">
                              {student.college || 'Regular Student'}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 font-mono">
                              {student.phone}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-slate-800">{student.guardianName || 'Guardian'}</p>
                              <p className="text-[10px] text-slate-500">{student.guardianPhone}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                {student.status || 'Active'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setSelectedStudent(student)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                                  title="View Full Profile Dossier"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => setIdCardStudent(student)}
                                  className="p-1.5 text-slate-400 hover:text-violet-600 rounded-lg hover:bg-slate-100 transition"
                                  title="Print Digital Student ID Card"
                                >
                                  <QrCode className="w-4 h-4" />
                                </button>

                                {student.phone && (
                                  <a
                                    href={`https://wa.me/91${student.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition"
                                    title="WhatsApp Resident"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>
                                )}

                                <button
                                  onClick={() => handleDeleteStudent(student.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                                  title="Check Out Resident"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 4. TAB: FEES & BILLING ================= */}
            {activeTab === 'fees' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">Fee Accounts & Invoicing</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Track monthly room rent, caution deposits, mess dues, and print formal tax receipts.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={feeFilterStatus}
                      onChange={(e) => setFeeFilterStatus(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:outline-none"
                    >
                      <option value="All">All Invoices</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>

                    <button
                      onClick={() => setShowAddFee(true)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Issue Invoice
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3.5 px-4">Invoice #</th>
                          <th className="py-3.5 px-4">Resident</th>
                          <th className="py-3.5 px-4">Room</th>
                          <th className="py-3.5 px-4">Billing Category</th>
                          <th className="py-3.5 px-4">Month</th>
                          <th className="py-3.5 px-4">Amount</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredFees.map((fee) => (
                          <tr key={fee.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                              {fee.invoiceNo}
                            </td>
                            <td className="py-3.5 px-4 font-extrabold text-slate-900">
                              {fee.studentName}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-600">
                              Room {fee.roomNumber}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700">
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                                {fee.category || 'Hostel Rent'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">
                              {fee.month}
                            </td>
                            <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                              ₹{fee.amount.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${fee.status === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : fee.status === 'Overdue'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                              >
                                {fee.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => toggleFeeStatus(fee.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${fee.status === 'Paid'
                                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    }`}
                                >
                                  {fee.status === 'Paid' ? 'Mark Pending' : 'Mark Paid'}
                                </button>

                                <button
                                  onClick={() => setSelectedReceipt(fee)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                                  title="Print Formal Receipt"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 5. TAB: MAINTENANCE & COMPLAINTS ================= */}
            {activeTab === 'complaints' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">Maintenance & Complaints Helpdesk</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Track tickets, staff assignment, resolution notes, and SLA tracking.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={complaintFilterCat}
                      onChange={(e) => setComplaintFilterCat(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl focus:outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Wi-Fi & Network">Wi-Fi & Network</option>
                      <option value="Carpentry / Furniture">Carpentry / Furniture</option>
                    </select>

                    <button
                      onClick={() => setShowAddComplaint(true)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Log Ticket
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredComplaints.map((c) => (
                    <div
                      key={c.id}
                      className={`bg-white rounded-2xl p-5 border shadow-xs flex flex-col justify-between transition ${c.status === 'Resolved' ? 'border-slate-200 opacity-80' : 'border-indigo-100 hover:border-indigo-300'
                        }`}
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-indigo-700">{c.ticketNo}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${c.priority === 'Urgent'
                                  ? 'bg-rose-100 text-rose-700'
                                  : c.priority === 'High'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                            >
                              {c.priority}
                            </span>
                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-600">
                              {c.category}
                            </span>
                          </div>

                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}
                          >
                            {c.status}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-800 mt-2.5">{c.issue}</h3>

                        <div className="mt-3 space-y-1 text-xs text-slate-500">
                          <p>
                            Reported by: <strong className="text-slate-800">{c.studentName}</strong> (Room {c.roomNumber})
                          </p>
                          <p>Assigned Staff: <strong className="text-slate-700">{c.assignedStaff}</strong></p>
                          <p className="text-[11px] text-slate-400">Logged at: {c.loggedAt}</p>
                          {c.resolutionNotes && (
                            <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-2 border border-emerald-100">
                              Note: {c.resolutionNotes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                        <button
                          onClick={() => toggleComplaintStatus(c.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition text-xs ${c.status === 'Resolved'
                              ? 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                        >
                          {c.status === 'Resolved' ? 'Reopen Ticket' : 'Mark Resolved'}
                        </button>

                        <button
                          onClick={() => {
                            const notes = window.prompt('Enter staff resolution notes:', c.resolutionNotes || '');
                            if (notes !== null) {
                              setComplaints(complaints.map((item) => (item.id === c.id ? { ...item, resolutionNotes: notes } : item)));
                              notify('Staff notes updated');
                            }
                          }}
                          className="text-xs text-indigo-600 font-semibold hover:underline"
                        >
                          Update Notes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= 6. TAB: MESS & MEALS ================= */}
            {activeTab === 'mess' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">Weekly Mess & Meal Planner</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      7-Day breakfast, lunch, snacks, and grand feast menu schedules.
                    </p>
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto py-1">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <button
                        key={day}
                        onClick={() => setActiveMenuDay(day)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeMenuDay === day
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {(() => {
                  const menu = messMenu.find((m) => m.day.toLowerCase() === activeMenuDay.toLowerCase()) || messMenu[0];
                  if (!menu) return null;
                  return (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                      <div className="flex justify-between items-center border-b pb-4">
                        <div>
                          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                            {menu.day} Meal Schedule
                          </span>
                          <h3 className="text-2xl font-black text-slate-900">{menu.type || 'Standard Menu'}</h3>
                        </div>
                        <button
                          onClick={() => setEditingDayMenu(menu)}
                          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit Day Menu
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                          <div className="flex items-center gap-2 text-amber-900 font-black text-sm mb-2">
                            <Coffee className="w-4 h-4" />
                            Breakfast (07:30 - 09:30 AM)
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">{menu.breakfast}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                          <div className="flex items-center gap-2 text-emerald-900 font-black text-sm mb-2">
                            <Utensils className="w-4 h-4" />
                            Lunch (12:30 - 02:30 PM)
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">{menu.lunch}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60">
                          <div className="flex items-center gap-2 text-orange-900 font-black text-sm mb-2">
                            <Coffee className="w-4 h-4" />
                            Evening Snacks (05:00 - 06:15 PM)
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">{menu.snacks}</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/60">
                          <div className="flex items-center gap-2 text-indigo-900 font-black text-sm mb-2">
                            <Utensils className="w-4 h-4" />
                            Dinner (08:00 - 10:00 PM)
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">{menu.dinner}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ================= 7. TAB: VISITORS & GATE PASS ================= */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Security Visitors Register */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm">Security Visitors Log</h3>
                        <p className="text-[11px] text-slate-500">Active campus guests & in/out timing</p>
                      </div>
                      <button
                        onClick={() => setShowAddVisitor(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Log Visitor
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
                      {visitors.map((v) => (
                        <div key={v.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 text-sm">{v.visitorName}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.status === 'Currently Inside'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-600'
                                  }`}
                              >
                                {v.status}
                              </span>
                            </div>
                            <p className="text-slate-500 mt-1">
                              Visiting: <strong className="text-slate-800">{v.residentName}</strong> (Room {v.roomNumber}) • {v.relation}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              In: {v.inTime} {v.outTime ? `| Out: ${v.outTime}` : ''}
                            </p>
                          </div>

                          {v.status === 'Currently Inside' && (
                            <button
                              onClick={() => handleCheckoutVisitor(v.id)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                            >
                              Check Out
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Gate Passes & Attendance */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm">Gate Passes & Overnight Leaves</h3>
                        <p className="text-[11px] text-slate-500">Approved student movement & parental consent</p>
                      </div>
                      <button
                        onClick={() => setShowAddLeave(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        New Gate Pass
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
                      {attendance.map((att) => (
                        <div key={att.id} className="p-4 text-xs space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900 text-sm">
                              {att.studentName} (Room {att.roomNumber})
                            </span>
                            <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                              {att.status}
                            </span>
                          </div>
                          <p className="text-slate-600">
                            Type: <strong>{att.type}</strong> • Destination: <strong>{att.destination}</strong>
                          </p>
                          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                            <span>Departure: {att.departureDate}</span>
                            <span>Expected Return: {att.expectedReturn}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 8. TAB: NOTICES ================= */}
            {activeTab === 'notices' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">Digital Hostel Bulletin Board</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Official announcements, maintenance alerts, and warden directives.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddNotice(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Post Notice
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notices.map((n) => (
                    <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                            {n.category}
                          </span>
                          {n.isPinned && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              📌 Pinned
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-black text-slate-900 mt-2">{n.title}</h3>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{n.content}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
                        <span>By: {n.postedBy} • {n.date}</span>
                        <button
                          onClick={() => {
                            setNotices(notices.filter((item) => item.id !== n.id));
                            notify('Notice removed');
                          }}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= 9. TAB: SETTINGS & BACKUP ================= */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                  <h2 className="text-xl font-black text-slate-800 border-b pb-3">
                    Hostel Configuration & Zero-Setup Storage
                  </h2>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <p className="font-extrabold text-sm">Zero-Configuration Local Persistent Engine Active</p>
                      <p className="mt-1 opacity-90">
                        No external cloud databases or Atlas accounts needed. Data is automatically persisted to <code>server/data/hostel_database.json</code> with instant offline fallback.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800">Hostel Profile Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">Hostel Name</label>
                        <input
                          type="text"
                          value={hostelInfo.name}
                          onChange={(e) => setHostelInfo({ ...hostelInfo, name: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">Chief Warden</label>
                        <input
                          type="text"
                          value={hostelInfo.warden}
                          onChange={(e) => setHostelInfo({ ...hostelInfo, warden: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">Contact Phone</label>
                        <input
                          type="text"
                          value={hostelInfo.contactPhone}
                          onChange={(e) => setHostelInfo({ ...hostelInfo, contactPhone: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">Curfew Time</label>
                        <input
                          type="text"
                          value={hostelInfo.curfewTime}
                          onChange={(e) => setHostelInfo({ ...hostelInfo, curfewTime: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t flex flex-wrap gap-3">
                    <button
                      onClick={handleExportData}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
                    >
                      <Download className="w-4 h-4" />
                      Export Complete Backup (JSON)
                    </button>

                    <button
                      onClick={handleResetData}
                      className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reload Enterprise Dataset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= MODAL: QUICK ACTION (ADMIN) ================= */}
      {showQuickAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-extrabold text-slate-800 text-base">Quick Operational Actions</h3>
              <button onClick={() => setShowQuickAction(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => {
                  setShowQuickAction(false);
                  setShowAddStudent(true);
                }}
                className="p-3.5 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-left border border-indigo-100 transition"
              >
                <UserCheck className="w-5 h-5 text-indigo-600 mb-1.5" />
                <p className="font-bold text-xs text-indigo-900">Check-in Resident</p>
                <p className="text-[10px] text-indigo-600 mt-0.5">Register new resident & bed</p>
              </button>

              <button
                onClick={() => {
                  setShowQuickAction(false);
                  setShowAddFee(true);
                }}
                className="p-3.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-left border border-emerald-100 transition"
              >
                <CreditCard className="w-5 h-5 text-emerald-600 mb-1.5" />
                <p className="font-bold text-xs text-emerald-900">Issue Fee Bill</p>
                <p className="text-[10px] text-emerald-600 mt-0.5">Create room or mess invoice</p>
              </button>

              <button
                onClick={() => {
                  setShowQuickAction(false);
                  setShowAddComplaint(true);
                }}
                className="p-3.5 bg-rose-50 hover:bg-rose-100 rounded-xl text-left border border-rose-100 transition"
              >
                <AlertCircle className="w-5 h-5 text-rose-600 mb-1.5" />
                <p className="font-bold text-xs text-rose-900">Log Maintenance</p>
                <p className="text-[10px] text-rose-600 mt-0.5">Report room repair issue</p>
              </button>

              <button
                onClick={() => {
                  setShowQuickAction(false);
                  setShowAddLeave(true);
                }}
                className="p-3.5 bg-violet-50 hover:bg-violet-100 rounded-xl text-left border border-violet-100 transition"
              >
                <ShieldCheck className="w-5 h-5 text-violet-600 mb-1.5" />
                <p className="font-bold text-xs text-violet-900">Issue Gate Pass</p>
                <p className="text-[10px] text-violet-600 mt-0.5">Weekend or night curfew leave</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD ROOM (ADMIN) ================= */}
      {showAddRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-extrabold text-slate-800 text-base">Add New Room</h3>
              <button onClick={() => setShowAddRoom(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRoom} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 204"
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Floor Level</label>
                  <select
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom({ ...newRoom, floor: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="1">Floor 1</option>
                    <option value="2">Floor 2</option>
                    <option value="3">Floor 3</option>
                    <option value="4">Floor 4</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Type</label>
                  <select
                    value={newRoom.type}
                    onChange={(e) => {
                      const t = e.target.value;
                      const cap = t === 'Single Private' ? 1 : t === 'Triple Sharing' ? 3 : t.includes('Four') ? 4 : 2;
                      setNewRoom({ ...newRoom, type: t, capacity: cap });
                    }}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Single Private">Single Private (1 Bed)</option>
                    <option value="Double Sharing">Double Sharing (2 Beds)</option>
                    <option value="Triple Sharing">Triple Sharing (3 Beds)</option>
                    <option value="Four Sharing">Four Sharing (4 Beds)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={newRoom.rent}
                    onChange={(e) => setNewRoom({ ...newRoom, rent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hostel Block / Wing</label>
                <select
                  value={newRoom.block}
                  onChange={(e) => setNewRoom({ ...newRoom, block: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="Block A (Main Wing)">Block A (Main Wing)</option>
                  <option value="Block B (Deluxe Wing)">Block B (Deluxe Wing)</option>
                  <option value="Block C (Executive Wing)">Block C (Executive Wing)</option>
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoom(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD STUDENT (ADMIN) ================= */}
      {showAddStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-extrabold text-slate-800 text-base">Check-in Resident Student</h3>
              <button onClick={() => setShowAddStudent(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aryan Malhotra"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign Room *</label>
                  <select
                    required
                    value={newStudent.roomNumber}
                    onChange={(e) => {
                      const rNum = e.target.value;
                      const rObj = rooms.find((r) => r.roomNumber === rNum);
                      let fBed = '';
                      if (rObj && rObj.beds) {
                        const free = rObj.beds.find((b) => !b.studentId);
                        if (free) fBed = free.bedNumber;
                      }
                      setNewStudent({ ...newStudent, roomNumber: rNum, bedNumber: fBed });
                    }}
                    className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
                  >
                    <option value="">Select Room</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.roomNumber}>
                        Room {r.roomNumber} ({r.occupied}/{r.capacity} filled - {r.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bed Slot</label>
                  <input
                    type="text"
                    placeholder="e.g. 101-A"
                    value={newStudent.bedNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, bedNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">College / Course</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech Computer Science"
                    value={newStudent.college}
                    onChange={(e) => setNewStudent({ ...newStudent, college: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={newStudent.bloodGroup}
                    onChange={(e) => setNewStudent({ ...newStudent, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    placeholder="Parent / Guardian"
                    value={newStudent.guardianName}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guardian Phone</label>
                  <input
                    type="tel"
                    placeholder="Emergency Phone"
                    value={newStudent.guardianPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deposit Paid (₹)</label>
                  <input
                    type="number"
                    value={newStudent.depositPaid}
                    onChange={(e) => setNewStudent({ ...newStudent, depositPaid: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudent(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow"
                >
                  Complete Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD FEE INVOICE (ADMIN) ================= */}
      {showAddFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-extrabold text-slate-800 text-base">Issue Fee Invoice</h3>
              <button onClick={() => setShowAddFee(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddFee} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resident Student *</label>
                <select
                  required
                  value={newFee.studentName}
                  onChange={(e) => {
                    const name = e.target.value;
                    const st = students.find((s) => s.name === name);
                    setNewFee({
                      ...newFee,
                      studentName: name,
                      roomNumber: st ? st.roomNumber : '',
                      amount: st ? st.monthlyRent : 8500,
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
                >
                  <option value="">Select Resident</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} (Room {s.roomNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Category</label>
                  <select
                    value={newFee.category}
                    onChange={(e) => setNewFee({ ...newFee, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Hostel Rent">Hostel Rent</option>
                    <option value="Mess & Food Charges">Mess & Food Charges</option>
                    <option value="Caution Deposit">Caution Deposit</option>
                    <option value="Electricity / Utility">Electricity / Utility</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={newFee.amount}
                    onChange={(e) => setNewFee({ ...newFee, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Billing Month</label>
                <input
                  type="text"
                  value={newFee.month}
                  onChange={(e) => setNewFee({ ...newFee, month: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFee(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow"
                >
                  Issue Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD COMPLAINT (BOTH) ================= */}
      {showAddComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-extrabold text-slate-800 text-base">
                {isAdmin ? 'Log Maintenance Ticket' : 'Report Room Maintenance Issue'}
              </h3>
              <button onClick={() => setShowAddComplaint(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddComplaint} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    readOnly={!isAdmin}
                    placeholder="e.g. 101"
                    value={!isAdmin ? currentUser.roomNumber : newComplaint.roomNumber}
                    onChange={(e) => setNewComplaint({ ...newComplaint, roomNumber: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl font-semibold ${!isAdmin ? 'bg-slate-100 text-slate-600 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Wi-Fi & Network">Wi-Fi & Network</option>
                    <option value="Carpentry / Furniture">Carpentry / Furniture</option>
                    <option value="Housekeeping">Housekeeping</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newComplaint.priority}
                    onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Urgent">🔴 Urgent</option>
                    <option value="High">🟠 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isAdmin ? 'Assign Staff' : 'Preferred Assistance'}
                  </label>
                  <select
                    value={newComplaint.assignedStaff}
                    onChange={(e) => setNewComplaint({ ...newComplaint, assignedStaff: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Ramesh (Electrician)">Ramesh (Electrician)</option>
                    <option value="Suresh (Plumber)">Suresh (Plumber)</option>
                    <option value="Kiran (IT Admin)">Kiran (IT Admin)</option>
                    <option value="Gopal (Carpenter)">Gopal (Carpenter)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Description *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Describe the problem in detail..."
                  value={newComplaint.issue}
                  onChange={(e) => setNewComplaint({ ...newComplaint, issue: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-indigo-500"
                ></textarea>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddComplaint(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD VISITOR (ADMIN) ================= */}
      {showAddVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-extrabold text-slate-800 text-base">Security Gate Visitor Check-in</h3>
              <button onClick={() => setShowAddVisitor(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddVisitor} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={newVisitor.visitorName}
                  onChange={(e) => setNewVisitor({ ...newVisitor, visitorName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visitor Phone</label>
                  <input
                    type="tel"
                    placeholder="98XXXXXXXX"
                    value={newVisitor.visitorPhone}
                    onChange={(e) => setNewVisitor({ ...newVisitor, visitorPhone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={newVisitor.relation}
                    onChange={(e) => setNewVisitor({ ...newVisitor, relation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Delivery / Courier">Delivery / Courier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Resident Visiting *</label>
                  <input
                    type="text"
                    required
                    placeholder="Student Name"
                    value={newVisitor.residentName}
                    onChange={(e) => setNewVisitor({ ...newVisitor, residentName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room #</label>
                  <input
                    type="text"
                    placeholder="e.g. 101"
                    value={newVisitor.roomNumber}
                    onChange={(e) => setNewVisitor({ ...newVisitor, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  placeholder="e.g. Delivering study materials"
                  value={newVisitor.purpose}
                  onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVisitor(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow"
                >
                  Register Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD GATE PASS / LEAVE (BOTH) ================= */}
      {showAddLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-extrabold text-slate-800 text-base">
                {isAdmin ? 'Issue Digital Gate Pass' : 'Apply for Overnight Leave / Gate Pass'}
              </h3>
              <button onClick={() => setShowAddLeave(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddLeave} className="mt-4 space-y-4 text-xs">
              {isAdmin ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Resident Student *</label>
                  <select
                    required
                    value={newLeave.studentName}
                    onChange={(e) => {
                      const st = students.find((s) => s.name === e.target.value);
                      setNewLeave({
                        ...newLeave,
                        studentName: e.target.value,
                        roomNumber: st ? st.roomNumber : '',
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
                  >
                    <option value="">Select Resident</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} (Room {s.roomNumber})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 bg-violet-50 rounded-xl border border-violet-100 text-xs">
                  <span className="font-bold text-violet-900">Applying as: {currentUser.name}</span>
                  <span className="block text-violet-700 text-[11px]">Room {currentUser.roomNumber} ({currentUser.bedNumber})</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Departure Date</label>
                  <input
                    type="date"
                    value={newLeave.departureDate}
                    onChange={(e) => setNewLeave({ ...newLeave, departureDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected Return</label>
                  <input
                    type="text"
                    placeholder="e.g. Sunday 09:00 PM"
                    value={newLeave.expectedReturn}
                    onChange={(e) => setNewLeave({ ...newLeave, expectedReturn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination & Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Hometown (Jaipur) for family function"
                  value={newLeave.destination}
                  onChange={(e) => setNewLeave({ ...newLeave, destination: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-[11px]">Parental consent verified via registered phone</span>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeave(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow"
                >
                  {isAdmin ? 'Approve & Issue Pass' : 'Submit Leave Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRINT FORMAL TAX INVOICE / RECEIPT ================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div id="printable-receipt" className="space-y-6">
              <div className="border-b pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{hostelInfo.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{hostelInfo.address}</p>
                    <p className="text-xs text-slate-500">Phone: {hostelInfo.contactPhone} • Email: {hostelInfo.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded">
                      {selectedReceipt.invoiceNo}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">Date: {selectedReceipt.paymentDate || new Date().toISOString().split('T')[0]}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Billed To</span>
                  <span className="font-black text-slate-800 text-sm">{selectedReceipt.studentName}</span>
                  <span className="block text-slate-600 mt-0.5">Assigned Room: {selectedReceipt.roomNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Payment Status</span>
                  <span
                    className={`inline-block font-black text-sm px-2.5 py-0.5 rounded-full mt-0.5 ${selectedReceipt.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                  >
                    {selectedReceipt.status.toUpperCase()}
                  </span>
                  <span className="block text-slate-500 text-[11px] mt-1">
                    Mode: {selectedReceipt.paymentMode || 'UPI'}
                  </span>
                </div>
              </div>

              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                  <tr>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Billing Cycle</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {selectedReceipt.category || 'Monthly Room Rent'}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Includes electricity, high-speed Wi-Fi & facility maintenance
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{selectedReceipt.month}</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">
                      ₹{selectedReceipt.amount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="border-t-2 border-slate-200">
                  <tr>
                    <th colSpan="2" className="py-3 px-3 text-right font-bold text-slate-700">Total Paid</th>
                    <th className="py-3 px-3 text-right font-black text-base text-indigo-700">
                      ₹{selectedReceipt.amount.toLocaleString()}
                    </th>
                  </tr>
                </tfoot>
              </table>

              <div className="pt-6 border-t flex justify-between items-end text-[11px] text-slate-400">
                <div>
                  <p className="font-semibold text-slate-600">Verification Seal:</p>
                  <p className="text-emerald-600 font-bold">DIGITALLY VERIFIED BY HOSTEL PMS</p>
                  <p className="font-mono text-[10px]">{selectedReceipt.transactionId || 'TXN-9842109'}</p>
                </div>
                <div className="text-right">
                  <div className="border-b border-slate-400 w-36 mb-1"></div>
                  <p className="font-bold text-slate-700">Chief Warden Signature</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t flex justify-between items-center no-print">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow"
              >
                <Printer className="w-4 h-4" />
                Print Official Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DIGITAL RESIDENT ID CARD ================= */}
      {idCardStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h3 className="font-extrabold text-slate-800 text-sm">Resident Smart ID Card</h3>
              <button onClick={() => setIdCardStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-2xl p-5 shadow-xl border border-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>

              <div className="flex justify-between items-start border-b border-indigo-800/80 pb-3">
                <div>
                  <h4 className="font-black text-sm tracking-tight text-white">{hostelInfo.name}</h4>
                  <p className="text-[10px] text-indigo-300">Resident Digital Pass</p>
                </div>
                <span className="font-mono text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-1.5 py-0.5 rounded">
                  {idCardStudent.regNo}
                </span>
              </div>

              <div className="mt-4 flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-indigo-400/40">
                  {idCardStudent.name.charAt(0)}
                </div>

                <div className="text-xs">
                  <h5 className="font-black text-base text-white">{idCardStudent.name}</h5>
                  <p className="text-[11px] text-indigo-200 font-bold mt-0.5">
                    Room {idCardStudent.roomNumber} ({idCardStudent.bedNumber})
                  </p>
                  <p className="text-[10px] text-slate-300 mt-1 line-clamp-1">{idCardStudent.college}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-800/80 grid grid-cols-2 gap-2 text-[10px] text-indigo-200">
                <div>
                  <span className="text-slate-400 block">Blood Group:</span>
                  <span className="font-bold text-white">{idCardStudent.bloodGroup || 'O+'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Emergency:</span>
                  <span className="font-bold text-white">{idCardStudent.emergencyContact}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-800/80 flex justify-between items-center">
                <span className="text-[9px] text-indigo-300 font-mono">STATUS: ACTIVE VALID 2024-25</span>
                <span className="text-[10px] font-mono tracking-widest bg-white/10 px-2 py-0.5 rounded text-white">
                  ||||| ||| |||||||
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Pass
              </button>
              <button
                onClick={() => setIdCardStudent(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: STUDENT PROFILE DOSSIER (ADMIN) ================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h3 className="font-extrabold text-slate-800 text-base">Resident Dossier: {selectedStudent.name}</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Registration No</span>
                  <span className="font-mono font-bold text-indigo-700 text-sm">{selectedStudent.regNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Assigned Room & Bed</span>
                  <span className="font-bold text-slate-800 text-sm">Room {selectedStudent.roomNumber} ({selectedStudent.bedNumber})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Phone</span>
                  <span className="font-mono font-bold text-slate-800">{selectedStudent.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Email</span>
                  <span className="font-medium text-slate-800">{selectedStudent.email || '-'}</span>
                </div>
              </div>

              <div className="space-y-2 border-t pt-3">
                <h4 className="font-bold text-slate-800 text-xs">Guardian & Emergency Information</h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <p>Guardian: <strong>{selectedStudent.guardianName || 'Parent'}</strong> ({selectedStudent.guardianRelation || 'Father'})</p>
                  <p>Emergency Phone: <strong>{selectedStudent.guardianPhone}</strong></p>
                  <p>Blood Group: <strong>{selectedStudent.bloodGroup}</strong></p>
                  <p>ID Proof: <strong>{selectedStudent.idProofType} ({selectedStudent.idProofNumber || 'Verified'})</strong></p>
                </div>
              </div>

              <div className="space-y-2 border-t pt-3">
                <h4 className="font-bold text-slate-800 text-xs">Fee Ledger Summary</h4>
                <div className="space-y-1.5">
                  {fees
                    .filter((f) => f.studentName === selectedStudent.name)
                    .map((f) => (
                      <div key={f.id} className="flex justify-between p-2 bg-slate-50 rounded-lg text-xs">
                        <span>{f.invoiceNo} - {f.month} ({f.category})</span>
                        <span className={`font-bold ${f.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          ₹{f.amount.toLocaleString()} ({f.status})
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT DAY MENU (ADMIN) ================= */}
      {editingDayMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h3 className="font-extrabold text-slate-800 text-base">Edit {editingDayMenu.day} Menu</h3>
              <button onClick={() => setEditingDayMenu(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Breakfast Menu</label>
                <input
                  type="text"
                  value={editingDayMenu.breakfast}
                  onChange={(e) => setEditingDayMenu({ ...editingDayMenu, breakfast: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lunch Menu</label>
                <input
                  type="text"
                  value={editingDayMenu.lunch}
                  onChange={(e) => setEditingDayMenu({ ...editingDayMenu, lunch: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Evening Snacks</label>
                <input
                  type="text"
                  value={editingDayMenu.snacks}
                  onChange={(e) => setEditingDayMenu({ ...editingDayMenu, snacks: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dinner Menu</label>
                <input
                  type="text"
                  value={editingDayMenu.dinner}
                  onChange={(e) => setEditingDayMenu({ ...editingDayMenu, dinner: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  onClick={() => setEditingDayMenu(null)}
                  className="px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setMessMenu(messMenu.map((m) => (m.day === editingDayMenu.day ? editingDayMenu : m)));
                    notify(`${editingDayMenu.day} menu updated!`);
                    setEditingDayMenu(null);
                  }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow"
                >
                  Save Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NOTICE (ADMIN) ================= */}
      {showAddNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-extrabold text-slate-800 text-base">Publish Hostel Notice</h3>
              <button onClick={() => setShowAddNotice(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddNotice} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fire Drill Schedule"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Hostel Rules">Hostel Rules</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newNotice.isPinned}
                      onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="font-bold text-slate-700">Pin at top</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Content *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Enter notice details..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-indigo-500"
                ></textarea>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNotice(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
