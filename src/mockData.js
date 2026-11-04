// Advanced initial enterprise dataset for Elite Hostel Management System
// Clean zero-setup local persistent fallback

export const defaultHostelInfo = {
  name: 'Elite Palms Executive Residence',
  tagline: 'Smart Living, Premium Comfort & 24/7 Security',
  warden: 'Dr. V. K. Rao (Chief Warden)',
  contactPhone: '+91 98450 12345',
  email: 'admin@elitepalms.hostel',
  address: 'Plot 42, University Avenue, Knowledge City',
  currency: '₹',
  curfewTime: '10:00 PM',
};

export const initialRooms = [
  {
    id: 'rm-101',
    roomNumber: '101',
    block: 'Block A (Main Wing)',
    floor: 1,
    type: 'Double Sharing',
    capacity: 2,
    occupied: 2,
    rent: 8500,
    amenities: ['Air Conditioner', 'Attached Washroom', 'High-Speed Wi-Fi', 'Study Desks', 'Geyser'],
    cleaningStatus: 'Clean',
    status: 'Occupied',
    beds: [
      { bedNumber: '101-A', studentId: 'std-1', studentName: 'Aarav Sharma' },
      { bedNumber: '101-B', studentId: 'std-2', studentName: 'Rohan Verma' }
    ]
  },
  {
    id: 'rm-102',
    roomNumber: '102',
    block: 'Block A (Main Wing)',
    floor: 1,
    type: 'Single Private',
    capacity: 1,
    occupied: 1,
    rent: 14000,
    amenities: ['Air Conditioner', 'Private Balcony', 'Attached Washroom', 'High-Speed Wi-Fi', 'Smart TV', 'Refrigerator'],
    cleaningStatus: 'Clean',
    status: 'Occupied',
    beds: [
      { bedNumber: '102-A', studentId: 'std-3', studentName: 'Vikram Roy' }
    ]
  },
  {
    id: 'rm-103',
    roomNumber: '103',
    block: 'Block A (Main Wing)',
    floor: 1,
    type: 'Triple Sharing',
    capacity: 3,
    occupied: 2,
    rent: 6500,
    amenities: ['Attached Washroom', 'High-Speed Wi-Fi', 'Individual Wardrobes', 'Study Desks'],
    cleaningStatus: 'Needs Cleaning',
    status: 'Available',
    beds: [
      { bedNumber: '103-A', studentId: 'std-4', studentName: 'Aditya Nair' },
      { bedNumber: '103-B', studentId: 'std-5', studentName: 'Dev Patel' },
      { bedNumber: '103-C', studentId: null, studentName: null }
    ]
  },
  {
    id: 'rm-201',
    roomNumber: '201',
    block: 'Block B (Deluxe Wing)',
    floor: 2,
    type: 'Double Sharing',
    capacity: 2,
    occupied: 1,
    rent: 9000,
    amenities: ['Air Conditioner', 'Attached Washroom', 'High-Speed Wi-Fi', 'Balcony Garden View'],
    cleaningStatus: 'Clean',
    status: 'Available',
    beds: [
      { bedNumber: '201-A', studentId: 'std-6', studentName: 'Priya Iyer' },
      { bedNumber: '201-B', studentId: null, studentName: null }
    ]
  },
  {
    id: 'rm-202',
    roomNumber: '202',
    block: 'Block B (Deluxe Wing)',
    floor: 2,
    type: 'Single Private',
    capacity: 1,
    occupied: 0,
    rent: 13500,
    amenities: ['Air Conditioner', 'Attached Washroom', 'High-Speed Wi-Fi', 'Balcony', 'Geyser'],
    cleaningStatus: 'Clean',
    status: 'Available',
    beds: [
      { bedNumber: '202-A', studentId: null, studentName: null }
    ]
  },
  {
    id: 'rm-203',
    roomNumber: '203',
    block: 'Block B (Deluxe Wing)',
    floor: 2,
    type: 'Triple Sharing',
    capacity: 3,
    occupied: 0,
    rent: 6500,
    amenities: ['Attached Washroom', 'High-Speed Wi-Fi', 'Study Desks', 'Wardrobes'],
    cleaningStatus: 'Clean',
    status: 'Available',
    beds: [
      { bedNumber: '203-A', studentId: null, studentName: null },
      { bedNumber: '203-B', studentId: null, studentName: null },
      { bedNumber: '203-C', studentId: null, studentName: null }
    ]
  },
  {
    id: 'rm-301',
    roomNumber: '301',
    block: 'Block B (Deluxe Wing)',
    floor: 3,
    type: 'Four Sharing (Executive)',
    capacity: 4,
    occupied: 2,
    rent: 5500,
    amenities: ['Attached Washroom', 'Dual Study Desks', 'Wi-Fi 6', 'Balcony'],
    cleaningStatus: 'Clean',
    status: 'Available',
    beds: [
      { bedNumber: '301-A', studentId: 'std-7', studentName: 'Ananya Deshmukh' },
      { bedNumber: '301-B', studentId: 'std-8', studentName: 'Siddharth Rao' },
      { bedNumber: '301-C', studentId: null, studentName: null },
      { bedNumber: '301-D', studentId: null, studentName: null }
    ]
  },
  {
    id: 'rm-302',
    roomNumber: '302',
    block: 'Block B (Deluxe Wing)',
    floor: 3,
    type: 'Double Sharing',
    capacity: 2,
    occupied: 0,
    rent: 8500,
    amenities: ['Air Conditioner', 'Attached Washroom', 'High-Speed Wi-Fi'],
    cleaningStatus: 'Under Repair',
    status: 'Maintenance',
    beds: [
      { bedNumber: '302-A', studentId: null, studentName: null },
      { bedNumber: '302-B', studentId: null, studentName: null }
    ]
  }
];

export const initialStudents = [
  {
    id: 'std-1',
    regNo: 'HST-2024-001',
    name: 'Aarav Sharma',
    phone: '9876543210',
    email: 'aarav.sharma@gmail.com',
    roomNumber: '101',
    bedNumber: '101-A',
    college: 'National Institute of Tech (B.Tech CSE - 3rd Yr)',
    guardianName: 'Rajesh Sharma',
    guardianPhone: '9811122233',
    guardianRelation: 'Father',
    bloodGroup: 'O+',
    idProofType: 'Aadhaar Card',
    idProofNumber: '4829-1234-9021',
    checkInDate: '2024-07-15',
    depositPaid: 15000,
    monthlyRent: 8500,
    status: 'Active',
    emergencyContact: '9811122233 (Father)'
  },
  {
    id: 'std-2',
    regNo: 'HST-2024-002',
    name: 'Rohan Verma',
    phone: '9823456789',
    email: 'rohan.verma@gmail.com',
    roomNumber: '101',
    bedNumber: '101-B',
    college: 'City University (B.Tech IT - 3rd Yr)',
    guardianName: 'Sanjay Verma',
    guardianPhone: '9822233344',
    guardianRelation: 'Father',
    bloodGroup: 'B+',
    idProofType: 'Aadhaar Card',
    idProofNumber: '7829-4567-1122',
    checkInDate: '2024-07-16',
    depositPaid: 15000,
    monthlyRent: 8500,
    status: 'Active',
    emergencyContact: '9822233344 (Father)'
  },
  {
    id: 'std-3',
    regNo: 'HST-2024-003',
    name: 'Vikram Roy',
    phone: '9712345678',
    email: 'vikram.roy@business.edu',
    roomNumber: '102',
    bedNumber: '102-A',
    college: 'Apex Business School (MBA Fin - 1st Yr)',
    guardianName: 'Manish Roy',
    guardianPhone: '9733344455',
    guardianRelation: 'Father',
    bloodGroup: 'A+',
    idProofType: 'Passport',
    idProofNumber: 'P8921094',
    checkInDate: '2024-08-01',
    depositPaid: 25000,
    monthlyRent: 14000,
    status: 'Active',
    emergencyContact: '9733344455 (Father)'
  },
  {
    id: 'std-4',
    regNo: 'HST-2024-004',
    name: 'Aditya Nair',
    phone: '9654321098',
    email: 'aditya.nair@gmail.com',
    roomNumber: '103',
    bedNumber: '103-A',
    college: 'St. Xavier Commerce (B.Com Hons - 2nd Yr)',
    guardianName: 'Suresh Nair',
    guardianPhone: '9644455566',
    guardianRelation: 'Father',
    bloodGroup: 'AB+',
    idProofType: 'Aadhaar Card',
    idProofNumber: '5511-9082-3344',
    checkInDate: '2024-08-05',
    depositPaid: 12000,
    monthlyRent: 6500,
    status: 'Active',
    emergencyContact: '9644455566 (Father)'
  },
  {
    id: 'std-5',
    regNo: 'HST-2024-005',
    name: 'Dev Patel',
    phone: '9543210987',
    email: 'dev.patel@eng.ac.in',
    roomNumber: '103',
    bedNumber: '103-B',
    college: 'Tech University (B.Tech Mech - 2nd Yr)',
    guardianName: 'Bharat Patel',
    guardianPhone: '9555566677',
    guardianRelation: 'Father',
    bloodGroup: 'O+',
    idProofType: 'College ID',
    idProofNumber: 'MECH-2023-89',
    checkInDate: '2024-08-10',
    depositPaid: 12000,
    monthlyRent: 6500,
    status: 'Active',
    emergencyContact: '9555566677 (Father)'
  },
  {
    id: 'std-6',
    regNo: 'HST-2024-006',
    name: 'Priya Iyer',
    phone: '9432109876',
    email: 'priya.iyer@med.edu',
    roomNumber: '201',
    bedNumber: '201-A',
    college: 'Apollo Medical Institute (MBBS - 2nd Yr)',
    guardianName: 'Dr. R. Iyer',
    guardianPhone: '9466677788',
    guardianRelation: 'Mother',
    bloodGroup: 'B-',
    idProofType: 'Aadhaar Card',
    idProofNumber: '2233-8899-7711',
    checkInDate: '2024-09-01',
    depositPaid: 18000,
    monthlyRent: 9000,
    status: 'Active',
    emergencyContact: '9466677788 (Mother)'
  },
  {
    id: 'std-7',
    regNo: 'HST-2024-007',
    name: 'Ananya Deshmukh',
    phone: '9321098765',
    email: 'ananya.deshmukh@design.in',
    roomNumber: '301',
    bedNumber: '301-A',
    college: 'National Design Academy (B.Des - 1st Yr)',
    guardianName: 'Sunil Deshmukh',
    guardianPhone: '9377788899',
    guardianRelation: 'Father',
    bloodGroup: 'A-',
    idProofType: 'Aadhaar Card',
    idProofNumber: '1122-3344-5566',
    checkInDate: '2024-09-15',
    depositPaid: 10000,
    monthlyRent: 5500,
    status: 'Active',
    emergencyContact: '9377788899 (Father)'
  },
  {
    id: 'std-8',
    regNo: 'HST-2024-008',
    name: 'Siddharth Rao',
    phone: '9210987654',
    email: 'siddharth.rao@lawschool.org',
    roomNumber: '301',
    bedNumber: '301-B',
    college: 'National Law School (BA LLB - 3rd Yr)',
    guardianName: 'V. K. Rao',
    guardianPhone: '9288899900',
    guardianRelation: 'Father',
    bloodGroup: 'O+',
    idProofType: 'Voter ID',
    idProofNumber: 'DL/09/2019/33',
    checkInDate: '2024-09-20',
    depositPaid: 10000,
    monthlyRent: 5500,
    status: 'Active',
    emergencyContact: '9288899900 (Father)'
  }
];

export const initialFees = [
  {
    id: 'inv-1001',
    invoiceNo: 'INV-2024-101',
    studentId: 'std-1',
    studentName: 'Aarav Sharma',
    roomNumber: '101',
    month: 'November 2024',
    category: 'Hostel Rent',
    amount: 8500,
    paidAmount: 8500,
    dueDate: '2024-11-05',
    paymentDate: '2024-11-02',
    paymentMode: 'UPI (Google Pay)',
    transactionId: 'UPI-98421092812',
    status: 'Paid',
    remarks: 'Paid on time via UPI'
  },
  {
    id: 'inv-1002',
    invoiceNo: 'INV-2024-102',
    studentId: 'std-2',
    studentName: 'Rohan Verma',
    roomNumber: '101',
    month: 'November 2024',
    category: 'Hostel Rent',
    amount: 8500,
    paidAmount: 0,
    dueDate: '2024-11-05',
    paymentDate: null,
    paymentMode: 'UPI / Cash',
    transactionId: '',
    status: 'Pending',
    remarks: 'Payment reminder sent to student'
  },
  {
    id: 'inv-1003',
    invoiceNo: 'INV-2024-103',
    studentId: 'std-3',
    studentName: 'Vikram Roy',
    roomNumber: '102',
    month: 'November 2024',
    category: 'Hostel Rent',
    amount: 14000,
    paidAmount: 14000,
    dueDate: '2024-11-05',
    paymentDate: '2024-11-01',
    paymentMode: 'Bank Transfer (NEFT)',
    transactionId: 'NEFT-AXIS-992019',
    status: 'Paid',
    remarks: 'Single Private Deluxe room'
  },
  {
    id: 'inv-1004',
    invoiceNo: 'INV-2024-104',
    studentId: 'std-4',
    studentName: 'Aditya Nair',
    roomNumber: '103',
    month: 'November 2024',
    category: 'Hostel Rent',
    amount: 6500,
    paidAmount: 0,
    dueDate: '2024-11-05',
    paymentDate: null,
    paymentMode: 'UPI',
    transactionId: '',
    status: 'Overdue',
    remarks: 'Pending clearance'
  },
  {
    id: 'inv-1005',
    invoiceNo: 'INV-2024-105',
    studentId: 'std-5',
    studentName: 'Dev Patel',
    roomNumber: '103',
    month: 'November 2024',
    category: 'Hostel Rent',
    amount: 6500,
    paidAmount: 6500,
    dueDate: '2024-11-05',
    paymentDate: '2024-11-04',
    paymentMode: 'UPI (PhonePe)',
    transactionId: 'UPI-77120938102',
    status: 'Paid',
    remarks: 'Receipt issued'
  },
  {
    id: 'inv-1006',
    invoiceNo: 'INV-2024-106',
    studentId: 'std-6',
    studentName: 'Priya Iyer',
    roomNumber: '201',
    month: 'November 2024',
    category: 'Hostel Rent',
    amount: 9000,
    paidAmount: 0,
    dueDate: '2024-11-05',
    paymentDate: null,
    paymentMode: 'Pending',
    transactionId: '',
    status: 'Pending',
    remarks: 'Invoice generated'
  },
  {
    id: 'inv-1007',
    invoiceNo: 'INV-2024-107',
    studentId: 'std-7',
    studentName: 'Ananya Deshmukh',
    roomNumber: '301',
    month: 'November 2024',
    category: 'Mess & Food Charges',
    amount: 3500,
    paidAmount: 3500,
    dueDate: '2024-11-07',
    paymentDate: '2024-11-03',
    paymentMode: 'UPI (Paytm)',
    transactionId: 'PAYTM-88291039',
    status: 'Paid',
    remarks: 'Quarterly mess dues'
  },
  {
    id: 'inv-1008',
    invoiceNo: 'INV-2024-108',
    studentId: 'std-8',
    studentName: 'Siddharth Rao',
    roomNumber: '301',
    month: 'November 2024',
    category: 'Hostel Rent',
    amount: 5500,
    paidAmount: 5500,
    dueDate: '2024-11-05',
    paymentDate: '2024-11-04',
    paymentMode: 'Cash',
    transactionId: 'CASH-REC-1092',
    status: 'Paid',
    remarks: 'Paid at hostel reception counter'
  }
];

export const initialComplaints = [
  {
    id: 'tkt-101',
    ticketNo: 'TKT-301',
    studentName: 'Aarav Sharma',
    studentPhone: '9876543210',
    roomNumber: '101',
    category: 'Electrical',
    priority: 'Urgent',
    issue: 'High-speed ceiling fan making rhythmic metallic grinding sound',
    status: 'In Progress',
    assignedStaff: 'Ramesh (Electrician)',
    loggedAt: '2024-11-03 10:15 AM',
    resolvedAt: null,
    resolutionNotes: 'Bearing replacement scheduled for today afternoon'
  },
  {
    id: 'tkt-102',
    ticketNo: 'TKT-302',
    studentName: 'Aditya Nair',
    studentPhone: '9654321098',
    roomNumber: '103',
    category: 'Plumbing',
    priority: 'High',
    issue: 'Washroom hot water tap leaking water continuously',
    status: 'Open',
    assignedStaff: 'Suresh (Plumber)',
    loggedAt: '2024-11-04 08:30 AM',
    resolvedAt: null,
    resolutionNotes: 'Awaiting new rubber washer replacement'
  },
  {
    id: 'tkt-103',
    ticketNo: 'TKT-303',
    studentName: 'Vikram Roy',
    studentPhone: '9712345678',
    roomNumber: '102',
    category: 'Wi-Fi & Network',
    priority: 'Medium',
    issue: 'Floor 1 access point packet drops during video conferencing',
    status: 'Resolved',
    assignedStaff: 'Kiran (IT Admin)',
    loggedAt: '2024-11-01 02:20 PM',
    resolvedAt: '2024-11-02 04:00 PM',
    resolutionNotes: 'Router firmware upgraded and channel 6 configured'
  },
  {
    id: 'tkt-104',
    ticketNo: 'TKT-304',
    studentName: 'Priya Iyer',
    studentPhone: '9432109876',
    roomNumber: '201',
    category: 'Carpentry / Furniture',
    priority: 'Low',
    issue: 'Study desk drawer slide sticking on right side',
    status: 'Open',
    assignedStaff: 'Gopal (Carpenter)',
    loggedAt: '2024-11-04 11:45 AM',
    resolvedAt: null,
    resolutionNotes: 'Will be inspected during routine floor rounds'
  }
];

export const initialMessMenu = [
  {
    day: 'Monday',
    breakfast: 'Idli Sambar, Coconut Chutney, Boiled Eggs / Banana, Tea / Coffee',
    lunch: 'Paneer Butter Masala / Chicken Curry, Dal Tadka, Jeera Rice, Phulka, Curd, Salad',
    snacks: 'Vegetable Samosa with Mint Chutney, Masala Chai',
    dinner: 'Aloo Gobi, Rajma Masala, Steamed Basmati Rice, Roti, Gulab Jamun',
    type: 'Special North/South Blend'
  },
  {
    day: 'Tuesday',
    breakfast: 'Poha with Roasted Peanuts, Sprouted Moong, Boiled Eggs, Tea / Coffee',
    lunch: 'Chole Bhature / Steamed Rice, Yellow Dal, Boondi Raita, Onion Salad',
    snacks: 'Papad Chat & Hot Lemon Tea',
    dinner: 'Egg Curry / Dum Aloo, Dal Fry, Jeera Rice, Tawa Roti, Fruit Custard',
    type: 'Protein Special'
  },
  {
    day: 'Wednesday',
    breakfast: 'Aloo Paratha with Fresh Butter & Pickles, Curd, Tea / Coffee',
    lunch: 'Hyderabadi Veg Biryani / Chicken Biryani, Mirchi Ka Salan, Raita',
    snacks: 'Pav Bhaji with Buttered Pav, Filter Coffee',
    dinner: 'Mixed Veg Curry, Dal Makhani, Steamed Rice, Chapati, Ice Cream',
    type: 'Biryani Special Day'
  },
  {
    day: 'Thursday',
    breakfast: 'Medu Vada, Masala Upma, Sambar, Coconut Chutney, Tea / Coffee',
    lunch: 'Bhindi Masala, Kadi Pakoda, Steamed Rice, Roti, Roasted Papad',
    snacks: 'Crispy Veg Pakoda, Ginger Chai',
    dinner: 'Paneer Tikka Masala, Dal Palak, Jeera Rice, Butter Naan, Rasgulla',
    type: 'Traditional Delicacy'
  },
  {
    day: 'Friday',
    breakfast: 'Masala Dosa with Sambar & 2 Chutneys, Boiled Eggs, Tea / Coffee',
    lunch: 'Fish Curry / Malai Kofta, Sambar, Rasam, Steamed Rice, Appalam',
    snacks: 'Bun Maska / Cookies, Adrak Chai',
    dinner: 'Soya Chaap Masala, Dal Tadka, Ghee Rice, Roti, Moong Dal Halwa',
    type: 'Weekend Warmup Feast'
  },
  {
    day: 'Saturday',
    breakfast: 'Puri Bhaji (Aloo Curry), Halwa, Tea / Coffee',
    lunch: 'Veg Pulao, Paneer Do Pyaza, Dal Fry, Cucumber Raita, Papad',
    snacks: 'Corn Cheese Sandwiches, Cold Coffee',
    dinner: 'Chinese Night: Hakka Noodles, Veg Manchurian / Chilli Chicken, Fried Rice',
    type: 'Fusion Saturday'
  },
  {
    day: 'Sunday',
    breakfast: 'Bread Omelette / Veg Cheese Toast, French Fries, Juice, Coffee',
    lunch: 'Sunday Grand Feast: Mutton Curry / Shahi Paneer, Pulao, Naan, Kheer',
    snacks: 'Bhel Puri, Masala Tea',
    dinner: 'Light Khichdi / Roti Sabzi, Tomato Soup, Fruit Salad',
    type: 'Sunday Royal Feast'
  }
];

export const initialVisitors = [
  {
    id: 'vis-1',
    visitorName: 'Rajesh Sharma',
    visitorPhone: '9811122233',
    residentName: 'Aarav Sharma',
    roomNumber: '101',
    relation: 'Father',
    inTime: '2024-11-04 04:30 PM',
    outTime: '2024-11-04 06:15 PM',
    purpose: 'Delivered study materials and winter wear',
    idVerified: true,
    status: 'Checked Out'
  },
  {
    id: 'vis-2',
    visitorName: 'Kunal Kapoor',
    visitorPhone: '9988776655',
    residentName: 'Vikram Roy',
    roomNumber: '102',
    relation: 'Colleague / Study Partner',
    inTime: '2024-11-04 05:00 PM',
    outTime: null,
    purpose: 'MBA Case Study preparation',
    idVerified: true,
    status: 'Currently Inside'
  }
];

export const initialAttendance = [
  {
    id: 'att-1',
    studentName: 'Rohan Verma',
    roomNumber: '101',
    type: 'Gate Pass / Weekend Leave',
    departureDate: '2024-11-08',
    expectedReturn: '2024-11-10 09:00 PM',
    actualReturn: null,
    destination: 'Hometown (Jaipur) for sister engagement',
    parentConsent: true,
    status: 'Approved'
  },
  {
    id: 'att-2',
    studentName: 'Dev Patel',
    roomNumber: '103',
    type: 'Late Entry Permission',
    departureDate: '2024-11-04',
    expectedReturn: '2024-11-04 11:30 PM',
    actualReturn: null,
    destination: 'College Tech Fest Hackathon submission',
    parentConsent: true,
    status: 'Approved'
  }
];

export const initialNotices = [
  {
    id: 'not-1',
    title: 'Water Tank Sanitization & Routine Maintenance',
    category: 'Maintenance',
    date: '2024-11-05',
    postedBy: 'Hostel Engineering Office',
    content: 'Please note that main overhead water tank cleaning will occur on Sunday between 10:00 AM and 01:00 PM. Please store sufficient drinking water beforehand.',
    isPinned: true
  },
  {
    id: 'not-2',
    title: 'Strict Curfew Guidelines & Biometric Check-in',
    category: 'Hostel Rules',
    date: '2024-11-02',
    postedBy: 'Chief Warden',
    content: 'All residents are required to punch their biometric roll-call before 10:00 PM sharp. Any late entries require pre-approved digital gate passes.',
    isPinned: true
  },
    {
      id: 'not-3',
      title: 'Diwali Celebration & Special Festive Dinner',
      category: 'Event',
      date: '2024-11-01',
      postedBy: 'Mess Committee',
      content: 'Grand festive dinner and cultural evening on the hostel courtyard this coming Friday at 07:30 PM. All residents and staff are cordially invited!',
      isPinned: false
    }
];

export const initialUsers = [
  {
    id: 'usr-admin-1',
    name: 'Dr. V. K. Rao',
    email: 'admin@hostel.com',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    title: 'Chief Warden & Hostel Director',
    avatar: 'VR'
  },
  {
    id: 'usr-admin-2',
    name: 'Mrs. Sunita Mehra',
    email: 'warden@hostel.com',
    username: 'warden',
    password: 'warden123',
    role: 'admin',
    title: 'Residential Warden',
    avatar: 'SM'
  },
  {
    id: 'usr-std-1',
    studentId: 'std-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    username: 'aarav',
    password: 'student123',
    role: 'student',
    roomNumber: '101',
    bedNumber: '101-A',
    regNo: 'HST-2024-001'
  },
  {
    id: 'usr-std-2',
    studentId: 'std-2',
    name: 'Rohan Verma',
    email: 'rohan.verma@gmail.com',
    username: 'rohan',
    password: 'student123',
    role: 'student',
    roomNumber: '101',
    bedNumber: '101-B',
    regNo: 'HST-2024-002'
  },
  {
    id: 'usr-std-3',
    studentId: 'std-3',
    name: 'Vikram Roy',
    email: 'vikram.roy@business.edu',
    username: 'vikram',
    password: 'student123',
    role: 'student',
    roomNumber: '102',
    bedNumber: '102-A',
    regNo: 'HST-2024-003'
  },
  {
    id: 'usr-std-6',
    studentId: 'std-6',
    name: 'Priya Iyer',
    email: 'priya.iyer@med.edu',
    username: 'priya',
    password: 'student123',
    role: 'student',
    roomNumber: '201',
    bedNumber: '201-A',
    regNo: 'HST-2024-006'
  }
];

export const demoAccounts = {
  admin: {
    email: 'admin@hostel.com',
    username: 'admin',
    password: 'admin123',
    name: 'Dr. V. K. Rao (Chief Warden)',
    role: 'admin'
  },
  students: [
    {
      email: 'aarav.sharma@gmail.com',
      username: 'aarav',
      password: 'student123',
      name: 'Aarav Sharma (Room 101)',
      roomNumber: '101',
      role: 'student'
    },
    {
      email: 'vikram.roy@business.edu',
      username: 'vikram',
      password: 'student123',
      name: 'Vikram Roy (Deluxe Room 102)',
      roomNumber: '102',
      role: 'student'
    },
    {
      email: 'priya.iyer@med.edu',
      username: 'priya',
      password: 'student123',
      name: 'Priya Iyer (Room 201)',
      roomNumber: '201',
      role: 'student'
    }
  ]
};

