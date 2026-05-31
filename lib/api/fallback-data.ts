// Fallback data for when backend is unavailable

export const fallbackToppers = [
  {
    _id: '1',
    name: 'Suhani Pandey',
    percentage: '94.40%',
    rank: 1,
    image: '/images/topper-suhani.png',
    year: '2026-2027',
    attendanceRecord: '98%',
    batch: 'English Medium'
  },
  {
    _id: '2',
    name: 'Mayur Jaiswal',
    percentage: '92.60%',
    rank: 2,
    image: '/images/topper-mayur.png',
    year: '2026-2027',
    attendanceRecord: '97%',
    batch: 'English Medium'
  },
  {
    _id: '3',
    name: 'Ritu Kumawat',
    percentage: '90.00%',
    rank: 3,
    image: '/images/topper-ritu.png',
    year: '2026-2027',
    attendanceRecord: '96%',
    batch: 'Hindi Medium'
  },
  {
    _id: '4',
    name: 'Dhruv Bhanushali',
    percentage: '89.00%',
    rank: 4,
    image: '/images/topper-dhruv.png',
    year: '2026-2027',
    attendanceRecord: '95%',
    batch: 'English Medium'
  },
  {
    _id: '5',
    name: 'Meraj Shaikh',
    percentage: '88.20%',
    rank: 5,
    image: '/images/topper-meraj.png',
    year: '2026-2027',
    attendanceRecord: '94%',
    batch: 'Hindi Medium'
  }
];

export const fallbackToppers2024 = [
  {
    _id: '2024-1',
    name: 'Hardi Prajapati',
    percentage: '95.40%',
    rank: 1,
    image: '/images/2024/WhatsApp%20Image%202026-05-26%20at%2012.22.13%20AM.jpeg',
    year: '2024-2025',
    attendanceRecord: '99%',
    batch: 'English Medium'
  },
  {
    _id: '2024-2',
    name: 'Megha Vhatkar',
    percentage: '92.80%',
    rank: 2,
    image: '/images/2024/WhatsApp%20Image%202026-05-26%20at%2012.22.11%20AM.jpeg',
    year: '2024-2025',
    attendanceRecord: '97%',
    batch: 'English Medium'
  },
  {
    _id: '2024-3',
    name: 'Ansh Dubey',
    percentage: '90.60%',
    rank: 3,
    image: '/images/2024/WhatsApp%20Image%202026-05-26%20at%2012.22.12%20AM.jpeg',
    year: '2024-2025',
    attendanceRecord: '96%',
    batch: 'Hindi Medium'
  },
  {
    _id: '2024-4',
    name: 'Abhishek Chauvan',
    percentage: '90.40%',
    rank: 4,
    image: '/images/2024/WhatsApp%20Image%202026-05-26%20at%2012.22.07%20AM.jpeg',
    year: '2024-2025',
    attendanceRecord: '95%',
    batch: 'Hindi Medium'
  },
  {
    _id: '2024-5',
    name: 'Vishesh Giri',
    percentage: '89.60%',
    rank: 5,
    image: '/images/2024/WhatsApp%20Image%202026-05-26%20at%2012.22.09%20AM.jpeg',
    year: '2024-2025',
    attendanceRecord: '94%',
    batch: 'English Medium'
  },
  {
    _id: '2024-6',
    name: 'Khushi Vishwakarma',
    percentage: '88.40%',
    rank: 6,
    image: '/images/2024/WhatsApp%20Image%202026-05-26%20at%2012.22.06%20AM.jpeg',
    year: '2024-2025',
    attendanceRecord: '93%',
    batch: 'English Medium'
  },
  {
    _id: '2024-7',
    name: 'Ayush Singh',
    percentage: '87.40%',
    rank: 7,
    image: '/images/2024/WhatsApp%20Image%202026-05-26%20at%2012.22.08%20AM.jpeg',
    year: '2024-2025',
    attendanceRecord: '92%',
    batch: 'English Medium'
  }
];

export const fallbackFaculty = [
  {
    _id: '1',
    name: 'Prof. Prabhat',
    role: 'Founder & Director',
    subject: 'Commerce & Accounts',
    image: '/images/owner.png',
    experience: '15+ Years',
    description: 'Visionary educator with 15+ years of expertise in Commerce and Accounts. Leading Prabhat Classes with a commitment to student excellence.',
    isOwner: true,
    order: 1
  },
  {
    _id: '2',
    name: 'Mathematics Faculty',
    role: 'Senior Faculty',
    subject: 'Mathematics',
    image: '',
    experience: '10+ Years',
    description: 'Expert in making complex mathematical concepts simple and understandable.',
    isOwner: false,
    order: 2
  },
  {
    _id: '3',
    name: 'Language Faculty',
    role: 'Senior Faculty',
    subject: 'English & Hindi',
    image: '',
    experience: '8+ Years',
    description: 'Specialized in language proficiency and communication skills development.',
    isOwner: false,
    order: 3
  }
];

export const fallbackPrograms = {
  secondary: {
    batches: [
      {
        title: 'Evening Foundation Batch',
        timing: '06:00 PM to 09:00 PM Daily',
        description: 'Secondary School (Class IX & X)',
        subjects: ['Mathematics', 'English', 'History', 'Geography', 'Hindi', 'Marathi']
      }
    ]
  },
  commerce: {
    batches: [
      {
        title: 'Morning Batch (Hindi Medium)',
        timing: '08:00 AM to 11:00 AM Daily',
        description: 'Batch A - Vernacular Medium Specialized',
        subjects: ['Advanced Accountancy', 'Economics', 'Business Studies', 'Hindi', 'Marathi']
      },
      {
        title: 'Afternoon Batch (English Medium)',
        timing: '02:00 PM to 05:00 PM Daily',
        description: 'Batch B - English Medium Commerce/Accounts',
        subjects: ['Advanced Accountancy', 'Commerce Strategy', 'Economics Matrix', 'English', 'Electives']
      }
    ]
  }
};
