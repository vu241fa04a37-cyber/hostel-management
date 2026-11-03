import React, { useState, useEffect } from 'react';
import { initialRooms, initialStudents, initialFees, initialComplaints } from './mockData';
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
  Database,
  HelpCircle,
  X,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

const API_BASE = '/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dbStatus, setDbStatus] = useState({ connected: false, checked: false, database: null });
  const [showMongoGuide, setShowMongoGuide] = useState(false);

  // States
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('simple_hostel_rooms');
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('simple_hostel_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [fees, setFees] = useState(() => {
    const saved = localStorage.getItem('simple_hostel_fees');
    return saved ? JSON.parse(saved) : initialFees;
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('simple_hostel_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  // Check MongoDB Atlas backend status & fetch data
  const checkBackendAndFetch = async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      const data = await res.json();
      setDbStatus({ connected: data.connected, checked: true, database: data.database });

      if (data.connected) {
        // Fetch live MongoDB Atlas data
        const [roomsRes, studentsRes, feesRes, complaintsRes] = await Promise.all([
          fetch(`${API_BASE}/rooms`),
          fetch(`${API_BASE}/students`),
          fetch(`${API_BASE}/fees`),
          fetch(`${API_BASE}/complaints`),
        ]);

        const roomsData = await roomsRes.json();
        const studentsData = await studentsRes.json();
        const feesData = await feesRes.json();
        const complaintsData = await complaintsRes.json();

        if (Array.isArray(roomsData) && roomsData.length > 0) setRooms(roomsData);
        if (Array.isArray(studentsData) && studentsData.length > 0) setStudents(studentsData);
        if (Array.isArray(feesData) && feesData.length > 0) setFees(feesData);
        if (Array.isArray(complaintsData) && complaintsData.length > 0) setComplaints(complaintsData);
      }
    } catch (err) {
      // Backend not running, use local state
      setDbStatus({ connected: false, checked: true, database: null });
    }
  };

  useEffect(() => {
    checkBackendAndFetch();
  }, []);

  // Save to localStorage as offline fallback
  useEffect(() => {
    if (!dbStatus.connected) {
      localStorage.setItem('simple_hostel_rooms', JSON.stringify(rooms));
    }
  }, [rooms, dbStatus.connected]);

  useEffect(() => {
    if (!dbStatus.connected) {
      localStorage.setItem('simple_hostel_students', JSON.stringify(students));
    }
  }, [students, dbStatus.connected]);

  useEffect(() => {
    if (!dbStatus.connected) {
      localStorage.setItem('simple_hostel_fees', JSON.stringify(fees));
    }
  }, [fees, dbStatus.connected]);

  useEffect(() => {
    if (!dbStatus.connected) {
      localStorage.setItem('simple_hostel_complaints', JSON.stringify(complaints));
    }
  }, [complaints, dbStatus.connected]);

  // Form states
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({ roomNumber: '', type: 'Double Sharing', capacity: 2, rent: 8000 });

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', phone: '', email: '', roomNumber: '', college: '' });

  const [showAddComplaint, setShowAddComplaint] = useState(false);
  const [newComplaint, setNewComplaint] = useState({ studentName: '', roomNumber: '', issue: '' });

  const [showAddFee, setShowAddFee] = useState(false);
  const [newFee, setNewFee] = useState({ studentName: '', roomNumber: '', month: 'November', amount: 8000 });

  // Calculations for Dashboard
  const totalBeds = rooms.reduce((sum, r) => sum + Number(r.capacity || 0), 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + Number(r.occupied || 0), 0);
  const availableBeds = Math.max(0, totalBeds - occupiedBeds);

  const totalPaidFees = fees.filter((f) => f.status === 'Paid').reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const totalPendingFees = fees.filter((f) => f.status === 'Pending').reduce((sum, f) => sum + Number(f.amount || 0), 0);

  const pendingComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;

  // Add Room
  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.roomNumber) return;

    const roomPayload = {
      roomNumber: newRoom.roomNumber,
      type: newRoom.type,
      capacity: Number(newRoom.capacity),
      occupied: 0,
      rent: Number(newRoom.rent),
      status: 'Available',
    };

    if (dbStatus.connected) {
      try {
        const res = await fetch(`${API_BASE}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roomPayload),
        });
        const saved = await res.json();
        setRooms([...rooms, saved]);
      } catch (err) {
        console.error(err);
      }
    } else {
      setRooms([...rooms, { ...roomPayload, id: Date.now() }]);
    }

    setNewRoom({ roomNumber: '', type: 'Double Sharing', capacity: 2, rent: 8000 });
    setShowAddRoom(false);
  };

  // Delete Room
  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete this room?')) return;

    if (dbStatus.connected) {
      try {
        await fetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' });
        setRooms(rooms.filter((r) => (r._id || r.id) !== id));
      } catch (err) {
        console.error(err);
      }
    } else {
      setRooms(rooms.filter((r) => (r._id || r.id) !== id));
    }
  };

  // Add Student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.roomNumber) return;

    const studentPayload = {
      name: newStudent.name,
      phone: newStudent.phone,
      email: newStudent.email,
      roomNumber: newStudent.roomNumber,
      college: newStudent.college,
    };

    if (dbStatus.connected) {
      try {
        const res = await fetch(`${API_BASE}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentPayload),
        });
        const saved = await res.json();
        setStudents([saved, ...students]);
        checkBackendAndFetch(); // Refresh rooms & fees from DB
      } catch (err) {
        console.error(err);
      }
    } else {
      setStudents([...students, { ...studentPayload, id: Date.now() }]);
      setRooms(
        rooms.map((r) => {
          if (r.roomNumber === newStudent.roomNumber) {
            const newOcc = r.occupied + 1;
            return { ...r, occupied: newOcc, status: newOcc >= r.capacity ? 'Occupied' : 'Available' };
          }
          return r;
        })
      );
      setFees([
        ...fees,
        {
          id: Date.now(),
          studentName: newStudent.name,
          roomNumber: newStudent.roomNumber,
          month: 'Current Month',
          amount: 8000,
          status: 'Pending',
        },
      ]);
    }

    setNewStudent({ name: '', phone: '', email: '', roomNumber: '', college: '' });
    setShowAddStudent(false);
  };

  // Delete Student
  const handleDeleteStudent = async (id) => {
    const student = students.find((s) => (s._id || s.id) === id);
    if (!window.confirm(`Remove resident student ${student?.name}?`)) return;

    if (dbStatus.connected) {
      try {
        await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
        setStudents(students.filter((s) => (s._id || s.id) !== id));
        checkBackendAndFetch();
      } catch (err) {
        console.error(err);
      }
    } else {
      if (student && student.roomNumber) {
        setRooms(
          rooms.map((r) => {
            if (r.roomNumber === student.roomNumber) {
              const newOcc = Math.max(0, r.occupied - 1);
              return { ...r, occupied: newOcc, status: newOcc >= r.capacity ? 'Occupied' : 'Available' };
            }
            return r;
          })
        );
      }
      setStudents(students.filter((s) => (s._id || s.id) !== id));
    }
  };

  // Toggle Fee Status
  const toggleFeeStatus = async (id) => {
    if (dbStatus.connected) {
      try {
        const res = await fetch(`${API_BASE}/fees/${id}`, { method: 'PUT' });
        const updated = await res.json();
        setFees(fees.map((f) => ((f._id || f.id) === id ? updated : f)));
      } catch (err) {
        console.error(err);
      }
    } else {
      setFees(
        fees.map((f) => {
          if ((f._id || f.id) === id) {
            return { ...f, status: f.status === 'Paid' ? 'Pending' : 'Paid' };
          }
          return f;
        })
      );
    }
  };

  // Add Fee
  const handleAddFee = async (e) => {
    e.preventDefault();
    if (!newFee.studentName) return;

    const feePayload = {
      studentName: newFee.studentName,
      roomNumber: newFee.roomNumber,
      month: newFee.month,
      amount: Number(newFee.amount),
      status: 'Pending',
    };

    if (dbStatus.connected) {
      try {
        const res = await fetch(`${API_BASE}/fees`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feePayload),
        });
        const saved = await res.json();
        setFees([saved, ...fees]);
      } catch (err) {
        console.error(err);
      }
    } else {
      setFees([...fees, { ...feePayload, id: Date.now() }]);
    }

    setNewFee({ studentName: '', roomNumber: '', month: 'November', amount: 8000 });
    setShowAddFee(false);
  };

  // Add Complaint
  const handleAddComplaint = async (e) => {
    e.preventDefault();
    if (!newComplaint.issue) return;

    const complaintPayload = {
      studentName: newComplaint.studentName || 'Resident',
      roomNumber: newComplaint.roomNumber || '101',
      issue: newComplaint.issue,
      status: 'Pending',
    };

    if (dbStatus.connected) {
      try {
        const res = await fetch(`${API_BASE}/complaints`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(complaintPayload),
        });
        const saved = await res.json();
        setComplaints([saved, ...complaints]);
      } catch (err) {
        console.error(err);
      }
    } else {
      setComplaints([...complaints, { ...complaintPayload, id: Date.now() }]);
    }

    setNewComplaint({ studentName: '', roomNumber: '', issue: '' });
    setShowAddComplaint(false);
  };

  // Toggle Complaint Status
  const toggleComplaintStatus = async (id) => {
    if (dbStatus.connected) {
      try {
        const res = await fetch(`${API_BASE}/complaints/${id}`, { method: 'PUT' });
        const updated = await res.json();
        setComplaints(complaints.map((c) => ((c._id || c.id) === id ? updated : c)));
      } catch (err) {
        console.error(err);
      }
    } else {
      setComplaints(
        complaints.map((c) => {
          if ((c._id || c.id) === id) {
            return { ...c, status: c.status === 'Resolved' ? 'Pending' : 'Resolved' };
          }
          return c;
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Top Navbar */}
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-300" />
            <span className="text-xl font-bold tracking-tight">Hostel Management System</span>
          </div>

          <div className="flex items-center gap-3">
            {/* MongoDB Atlas Status Pill */}
            <button
              onClick={() => setShowMongoGuide(true)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${
                dbStatus.connected
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400'
                  : 'bg-amber-500/20 text-amber-200 border-amber-400 hover:bg-amber-500/30'
              }`}
              title="Click for MongoDB Atlas connection status"
            >
              <span className={`w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
              <span>{dbStatus.connected ? `MongoDB Atlas: Connected (${dbStatus.database})` : 'MongoDB: Setup Required'}</span>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeTab === 'dashboard' ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-700 text-indigo-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('rooms')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeTab === 'rooms' ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-700 text-indigo-100'
                }`}
              >
                Rooms
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeTab === 'students' ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-700 text-indigo-100'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab('fees')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeTab === 'fees' ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-700 text-indigo-100'
                }`}
              >
                Fees
              </button>
              <button
                onClick={() => setActiveTab('complaints')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeTab === 'complaints' ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-700 text-indigo-100'
                }`}
              >
                Complaints
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex border-t border-indigo-700 px-4 py-2 overflow-x-auto gap-2">
          {['dashboard', 'rooms', 'students', 'fees', 'complaints'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1 rounded text-xs font-semibold capitalize ${
                activeTab === t ? 'bg-indigo-800 text-white' : 'text-indigo-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
              <button
                onClick={checkBackendAndFetch}
                className="flex items-center gap-1.5 text-xs text-indigo-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 font-semibold shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sync with DB
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Total Rooms</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{rooms.length}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{availableBeds} beds available</p>
                  </div>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <BedDouble className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Total Students</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{students.length}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{occupiedBeds} beds occupied</p>
                  </div>
                  <div className="p-3 bg-violet-50 text-violet-600 rounded-lg">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Fees Collected</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">₹{totalPaidFees.toLocaleString()}</p>
                    <p className="text-xs text-amber-600 mt-0.5">₹{totalPendingFees.toLocaleString()} pending</p>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Open Complaints</p>
                    <p className="text-2xl font-bold text-rose-600 mt-1">{pendingComplaintsCount}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Require attention</p>
                  </div>
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Summary Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Students */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Recent Enrolled Students</h3>
                  <button onClick={() => setActiveTab('students')} className="text-xs text-indigo-600 hover:underline font-semibold">
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {students.slice(0, 4).map((s) => (
                    <div key={s._id || s.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg text-sm">
                      <div>
                        <p className="font-semibold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.college || 'Resident'} • {s.phone || 'No phone'}</p>
                      </div>
                      <span className="bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded text-xs">
                        Room {s.roomNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Complaints */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Recent Complaints</h3>
                  <button onClick={() => setActiveTab('complaints')} className="text-xs text-indigo-600 hover:underline font-semibold">
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {complaints.slice(0, 4).map((c) => (
                    <div key={c._id || c.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg text-sm">
                      <div>
                        <p className="font-semibold text-slate-800">{c.issue}</p>
                        <p className="text-xs text-slate-500">By {c.studentName} (Room {c.roomNumber})</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded ${
                          c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ROOMS ================= */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Rooms Management</h2>
              <button
                onClick={() => setShowAddRoom(!showAddRoom)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition"
              >
                <Plus className="w-4 h-4" />
                {showAddRoom ? 'Cancel' : 'Add Room'}
              </button>
            </div>

            {/* Add Room Form */}
            {showAddRoom && (
              <form onSubmit={handleAddRoom} className="bg-white p-5 rounded-xl border border-indigo-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Add New Room</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Room Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 104"
                      value={newRoom.roomNumber}
                      onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Room Type</label>
                    <select
                      value={newRoom.type}
                      onChange={(e) => {
                        const type = e.target.value;
                        const cap = type === 'Single Private' ? 1 : type === 'Triple Sharing' ? 3 : 2;
                        setNewRoom({ ...newRoom, type, capacity: cap });
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500 bg-white"
                    >
                      <option value="Single Private">Single Private (1 Bed)</option>
                      <option value="Double Sharing">Double Sharing (2 Beds)</option>
                      <option value="Triple Sharing">Triple Sharing (3 Beds)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Capacity</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      value={newRoom.rent}
                      onChange={(e) => setNewRoom({ ...newRoom, rent: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                </div>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">
                  Save Room
                </button>
              </form>
            )}

            {/* Rooms Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {rooms.map((room) => {
                const id = room._id || room.id;
                return (
                  <div key={id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">Room {room.roomNumber}</h3>
                          <p className="text-xs text-slate-500">{room.type}</p>
                        </div>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            room.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {room.status}
                        </span>
                      </div>

                      <div className="mt-4 space-y-1 text-sm text-slate-600">
                        <p>Occupancy: <strong className="text-slate-800">{room.occupied} / {room.capacity} Beds</strong></p>
                        <p>Rent: <strong className="text-slate-800">₹{room.rent.toLocaleString()}/mo</strong></p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t flex justify-end">
                      <button
                        onClick={() => handleDeleteRoom(id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
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

        {/* ================= TAB 3: STUDENTS ================= */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-800">Students Directory</h2>
              <button
                onClick={() => setShowAddStudent(!showAddStudent)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition"
              >
                <Plus className="w-4 h-4" />
                {showAddStudent ? 'Cancel' : 'Register Student'}
              </button>
            </div>

            {/* Add Student Form */}
            {showAddStudent && (
              <form onSubmit={handleAddStudent} className="bg-white p-5 rounded-xl border border-indigo-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Register New Resident Student</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="student@gmail.com"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Assign Room *</label>
                    <select
                      required
                      value={newStudent.roomNumber}
                      onChange={(e) => setNewStudent({ ...newStudent, roomNumber: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500 bg-white"
                    >
                      <option value="">Select Room</option>
                      {rooms.map((r) => {
                        const id = r._id || r.id;
                        return (
                          <option key={id} value={r.roomNumber}>
                            Room {r.roomNumber} ({r.occupied}/{r.capacity} filled)
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">College / Course</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech Computer Science"
                      value={newStudent.college}
                      onChange={(e) => setNewStudent({ ...newStudent, college: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                </div>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">
                  Register Student
                </button>
              </form>
            )}

            {/* Students Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Room</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Course</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s) => {
                      const id = s._id || s.id;
                      return (
                        <tr key={id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-800">{s.name}</td>
                          <td className="py-3 px-4">
                            <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded text-xs">
                              Room {s.roomNumber}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{s.phone || '-'}</td>
                          <td className="py-3 px-4 text-slate-500">{s.email || '-'}</td>
                          <td className="py-3 px-4 text-slate-600">{s.college || '-'}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteStudent(id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                              title="Remove Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: FEES ================= */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Fee Payments</h2>
              <button
                onClick={() => setShowAddFee(!showAddFee)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition"
              >
                <Plus className="w-4 h-4" />
                {showAddFee ? 'Cancel' : 'Create Bill'}
              </button>
            </div>

            {/* Add Fee Form */}
            {showAddFee && (
              <form onSubmit={handleAddFee} className="bg-white p-5 rounded-xl border border-indigo-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Issue Fee Invoice</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Student Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Student Name"
                      value={newFee.studentName}
                      onChange={(e) => setNewFee({ ...newFee, studentName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Room</label>
                    <input
                      type="text"
                      placeholder="Room 101"
                      value={newFee.roomNumber}
                      onChange={(e) => setNewFee({ ...newFee, roomNumber: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Month</label>
                    <input
                      type="text"
                      value={newFee.month}
                      onChange={(e) => setNewFee({ ...newFee, month: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={newFee.amount}
                      onChange={(e) => setNewFee({ ...newFee, amount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                </div>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">
                  Save Invoice
                </button>
              </form>
            )}

            {/* Fees Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Room</th>
                      <th className="py-3 px-4">Month</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fees.map((fee) => {
                      const id = fee._id || fee.id;
                      return (
                        <tr key={id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-800">{fee.studentName}</td>
                          <td className="py-3 px-4 text-slate-600">Room {fee.roomNumber}</td>
                          <td className="py-3 px-4 text-slate-500">{fee.month}</td>
                          <td className="py-3 px-4 font-semibold text-slate-800">₹{fee.amount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                fee.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {fee.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => toggleFeeStatus(id)}
                              className={`px-3 py-1 rounded text-xs font-bold transition ${
                                fee.status === 'Paid'
                                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {fee.status === 'Paid' ? 'Mark Pending' : 'Mark Paid'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: COMPLAINTS ================= */}
        {activeTab === 'complaints' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Complaints & Maintenance</h2>
              <button
                onClick={() => setShowAddComplaint(!showAddComplaint)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition"
              >
                <Plus className="w-4 h-4" />
                {showAddComplaint ? 'Cancel' : 'New Complaint'}
              </button>
            </div>

            {/* Add Complaint Form */}
            {showAddComplaint && (
              <form onSubmit={handleAddComplaint} className="bg-white p-5 rounded-xl border border-indigo-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">Log New Complaint</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Student Name</label>
                    <input
                      type="text"
                      placeholder="Resident Name"
                      value={newComplaint.studentName}
                      onChange={(e) => setNewComplaint({ ...newComplaint, studentName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Room Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 101"
                      value={newComplaint.roomNumber}
                      onChange={(e) => setNewComplaint({ ...newComplaint, roomNumber: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Problem / Issue *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Water tap leaking in washroom"
                      value={newComplaint.issue}
                      onChange={(e) => setNewComplaint({ ...newComplaint, issue: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-indigo-500"
                    />
                  </div>
                </div>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">
                  Submit Issue
                </button>
              </form>
            )}

            {/* Complaints List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y">
              {complaints.map((c) => {
                const id = c._id || c.id;
                return (
                  <div key={id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{c.issue}</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Reported by <strong className="text-slate-700">{c.studentName}</strong> (Room {c.roomNumber})
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => toggleComplaintStatus(id)}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                          c.status === 'Resolved'
                            ? 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {c.status === 'Resolved' ? 'Reopen Issue' : 'Mark Resolved'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* MongoDB Atlas Setup Guide Modal */}
      {showMongoGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-base">MongoDB Atlas Connection Setup</h3>
              </div>
              <button onClick={() => setShowMongoGuide(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                dbStatus.connected ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${dbStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <div>
                  <p className="font-bold">
                    {dbStatus.connected
                      ? `Connected to MongoDB Atlas (${dbStatus.database})`
                      : 'Not connected to MongoDB Atlas yet'}
                  </p>
                  <p className="text-[11px] opacity-80">
                    {dbStatus.connected
                      ? 'All additions, edits, and deletions are saved directly to MongoDB Atlas!'
                      : 'The app is using local storage fallback. Follow the 3 steps below to connect your Atlas cluster.'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">3 Easy Steps to Connect MongoDB Atlas:</h4>

                <div className="p-3 bg-slate-50 rounded-xl border">
                  <p className="font-bold text-slate-800">1. Create a Free Cluster on MongoDB Atlas</p>
                  <p className="mt-1">Go to <a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-semibold">mongodb.com/cloud/atlas</a> and create a free M0 cluster.</p>
                  <p className="mt-1">In <strong>Network Access</strong>, add IP Address: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">0.0.0.0/0</code> (Allow Access from Anywhere).</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border">
                  <p className="font-bold text-slate-800">2. Copy your Connection String</p>
                  <p className="mt-1">Click <strong>Connect</strong> ➔ <strong>Drivers</strong> ➔ Copy your connection string:</p>
                  <code className="block bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-[11px] mt-1.5 overflow-x-auto">
                    mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.xxxx.mongodb.net/hostelDB?retryWrites=true&w=majority
                  </code>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border">
                  <p className="font-bold text-slate-800">3. Paste it in your <code className="bg-slate-200 px-1 rounded font-mono">.env</code> file</p>
                  <p className="mt-1">Open the <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">.env</code> file in this project and replace with your real password and URI.</p>
                  <p className="mt-2 text-indigo-700 font-semibold">Then start the full stack with:</p>
                  <code className="block bg-slate-900 text-amber-300 p-2 rounded-lg font-mono text-[11px] mt-1">
                    npm start
                  </code>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center pt-3 border-t">
              <button
                onClick={checkBackendAndFetch}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Connection
              </button>
              <button
                onClick={() => setShowMongoGuide(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
