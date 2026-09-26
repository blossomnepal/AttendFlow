import Calendar from 'react-calendar';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';

const dummyAttendance = {
  '2026-09-24': 'present',
  '2026-09-25': 'late',
  '2026-09-26': 'absent',
};

function AttendanceCalendar() {
  const [date, setDate] = useState(new Date());

  const tileClassName = ({ date }) => {
    const key = date.toISOString().split('T')[0];
    const status = dummyAttendance[key];
    if (status === 'present') return 'bg-[#16a34a] text-white rounded';
    if (status === 'late') return 'bg-[#f59e0b] text-white rounded';
    if (status === 'absent') return 'bg-[#dc2626] text-white rounded';
    return null;
  };

  return (
    <div className="p-6 min-h-screen bg-[#f3f4f6]">
      <h1 className="text-2xl font-bold mb-6 text-[#1a1a1a]">My Attendance</h1>
      <div className="bg-white p-4 rounded-lg shadow-md max-w-md">
        <Calendar value={date} onChange={setDate} tileClassName={tileClassName} />
      </div>
    </div>
  );
}

export default AttendanceCalendar;