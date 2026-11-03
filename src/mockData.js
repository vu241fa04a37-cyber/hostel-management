// Simple starter data for the hostel management system

export const initialRooms = [
  { id: 1, roomNumber: "101", type: "Double Sharing", capacity: 2, occupied: 2, rent: 8000, status: "Occupied" },
  { id: 2, roomNumber: "102", type: "Single Private", capacity: 1, occupied: 1, rent: 12000, status: "Occupied" },
  { id: 3, roomNumber: "103", type: "Triple Sharing", capacity: 3, occupied: 2, rent: 6000, status: "Available" },
  { id: 4, roomNumber: "201", type: "Double Sharing", capacity: 2, occupied: 1, rent: 7500, status: "Available" },
  { id: 5, roomNumber: "202", type: "Single Private", capacity: 1, occupied: 0, rent: 11000, status: "Available" },
  { id: 6, roomNumber: "203", type: "Triple Sharing", capacity: 3, occupied: 0, rent: 6000, status: "Available" },
];

export const initialStudents = [
  { id: 1, name: "Aarav Sharma", phone: "9876543210", email: "aarav@gmail.com", roomNumber: "101", college: "B.Tech CS" },
  { id: 2, name: "Rohan Verma", phone: "9823456789", email: "rohan@gmail.com", roomNumber: "101", college: "B.Tech IT" },
  { id: 3, name: "Vikram Roy", phone: "9712345678", email: "vikram@gmail.com", roomNumber: "102", college: "MBA" },
  { id: 4, name: "Aditya Nair", phone: "9654321098", email: "aditya@gmail.com", roomNumber: "103", college: "B.Com" },
  { id: 5, name: "Dev Patel", phone: "9543210987", email: "dev@gmail.com", roomNumber: "103", college: "B.Tech Mech" },
  { id: 6, name: "Priya Iyer", phone: "9432109876", email: "priya@gmail.com", roomNumber: "201", college: "MBBS" },
];

export const initialFees = [
  { id: 1, studentName: "Aarav Sharma", roomNumber: "101", month: "November", amount: 8000, status: "Paid" },
  { id: 2, studentName: "Rohan Verma", roomNumber: "101", month: "November", amount: 8000, status: "Pending" },
  { id: 3, studentName: "Vikram Roy", roomNumber: "102", month: "November", amount: 12000, status: "Paid" },
  { id: 4, studentName: "Aditya Nair", roomNumber: "103", month: "November", amount: 6000, status: "Pending" },
  { id: 5, studentName: "Dev Patel", roomNumber: "103", month: "November", amount: 6000, status: "Paid" },
  { id: 6, studentName: "Priya Iyer", roomNumber: "201", month: "November", amount: 7500, status: "Pending" },
];

export const initialComplaints = [
  { id: 1, studentName: "Aarav Sharma", roomNumber: "101", issue: "Ceiling fan making noise", status: "In Progress" },
  { id: 2, studentName: "Aditya Nair", roomNumber: "103", issue: "Bathroom tap leaking", status: "Pending" },
  { id: 3, studentName: "Vikram Roy", roomNumber: "102", issue: "Wi-Fi connection slow in room", status: "Resolved" },
  { id: 4, studentName: "Priya Iyer", roomNumber: "201", issue: "Study lamp socket not working", status: "Pending" },
];
