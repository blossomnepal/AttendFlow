import Calendar from 'react-calendar';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';

function AdminCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-6 min-h-screen bg-[#f3f4f6]">
      <h1 className="text-2xl font-bold mb-6 text-[#1a1a1a]">Team Attendance Calendar</h1>
      <div className="bg-white p-4 rounded-lg shadow-md max-w-md">
        <Calendar value={date} onChange={setDate} />
      </div>
    </div>
  );
}

export default AdminCalendar;