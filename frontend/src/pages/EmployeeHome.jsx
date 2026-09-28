import { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const LATE_CUTOFF = '10:00 AM';

function getStatus(checkInTime) {
  if (!checkInTime) return 'absent';
  const cutoff = new Date(`2026-01-01 ${LATE_CUTOFF}`);
  const actual = new Date(`2026-01-01 ${checkInTime}`);
  return actual > cutoff ? 'late' : 'present';
}

function calcHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const inTime = new Date(`2026-01-01 ${checkIn}`);
  const outTime = new Date(`2026-01-01 ${checkOut}`);
  return (outTime - inTime) / 1000 / 60 / 60;
}

const rawAttendance = {
  '2026-09-01': { checkIn: '09:00 AM', checkOut: '05:00 PM' },
  '2026-09-02': { checkIn: '09:05 AM', checkOut: '05:10 PM' },
  '2026-09-03': { checkIn: '10:15 AM', checkOut: '05:00 PM' },
  '2026-09-04': {},
  '2026-09-08': { checkIn: '08:55 AM', checkOut: '05:00 PM' },
  '2026-09-24': { checkIn: '09:10 AM', checkOut: '06:05 PM' },
  '2026-09-25': { checkIn: '10:30 AM', checkOut: '05:00 PM' },
  '2026-09-27': { checkIn: '09:30 AM', checkOut: '06:30 PM' },
};

const dummyAttendance = Object.fromEntries(
  Object.entries(rawAttendance).map(([date, record]) => [
    date,
    { ...record, status: getStatus(record.checkIn) },
  ])
);

function formatDateKey(date) {
  return date.toISOString().split('T')[0];
}

function EmployeeHome() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);

  const handleCheckIn = () => {
    setCheckedIn(true);
    setCheckInTime(new Date().toLocaleTimeString());
    setCheckOutTime(null);
  };

  const handleCheckOut = () => {
    setCheckedIn(false);
    setCheckOutTime(new Date().toLocaleTimeString());
  };

  const tileClassName = ({ date }) => {
    const key = formatDateKey(date);
    const today = formatDateKey(new Date()) === key;
    if (today) return 'calendar-today';
    return null;
  };

  const handleDayClick = (clickedDate) => {
    const key = formatDateKey(clickedDate);
    const record = dummyAttendance[key];
    if (record) {
      setSelectedDayInfo({ date: key, hasRecord: true, ...record });
    } else {
      setSelectedDayInfo({ date: key, hasRecord: false });
    }
  };

  const stats = useMemo(() => {
    const records = Object.values(dummyAttendance);
    const present = records.filter((r) => r.status === 'present').length;
    const late = records.filter((r) => r.status === 'late').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const totalHours = records
      .reduce((sum, r) => sum + calcHours(r.checkIn, r.checkOut), 0)
      .toFixed(1);

    const totalDays = present + late + absent;
    const attendancePercent = totalDays > 0
      ? Math.round(((present + late) / totalDays) * 100)
      : 0;

    return { present, late, absent, totalHours, attendancePercent };
  }, []);

  return (
    <div className="p-6 min-h-screen bg-[#f3f4f6]">
      <h1 className="text-2xl font-bold mb-6 text-[#1a1a1a]">Employee Home</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Box 1: Today */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-72">
          <h2 className="text-lg font-semibold mb-4 text-[#1a1a1a]">Today</h2>
          <p className="mb-2 text-[#1a1a1a]">
            Status:{' '}
            <span className={`font-semibold ${checkedIn ? 'text-[#16a34a]' : 'text-[#6b7280]'}`}>
              {checkedIn ? 'Checked In' : 'Not Checked In'}
            </span>
          </p>
          {checkInTime && <p className="text-sm text-[#6b7280] mb-1">Check-in: {checkInTime}</p>}
          {checkOutTime && <p className="text-sm text-[#6b7280] mb-4">Check-out: {checkOutTime}</p>}

          {!checkedIn ? (
            <button
              onClick={handleCheckIn}
              className="w-full bg-[#9333EA] text-white py-2.5 rounded-lg font-semibold mt-4 hover:bg-[#7e22ce] transition"
            >
              Check In
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              className="w-full bg-[#dc2626] text-white py-2.5 rounded-lg font-semibold mt-4"
            >
              Check Out
            </button>
          )}
        </div>

        {/* Box 2: Calendar */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full lg:w-80">
          <h2 className="text-lg font-semibold mb-3 text-[#1a1a1a]">Calendar</h2>
          <Calendar
            value={calendarDate}
            onChange={setCalendarDate}
            onClickDay={handleDayClick}
            tileClassName={tileClassName}
            className="w-full"
          />
        </div>

        {/* Right column: Summary box + Attendance box, matching card style */}
        <div className="w-full lg:flex-1 flex flex-col gap-6">
          {/* Box 3: Summary — each stat in its own mini-box */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-[#1a1a1a]">Summary</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-[#e5e7eb] rounded-lg p-3">
                <p className="text-sm text-[#6b7280] mb-1">Total Present Days</p>
                <p className="text-2xl font-bold text-[#16a34a]">{stats.present}</p>
              </div>
              <div className="border border-[#e5e7eb] rounded-lg p-3">
                <p className="text-sm text-[#6b7280] mb-1">Total Late Days</p>
                <p className="text-2xl font-bold text-[#f59e0b]">{stats.late}</p>
              </div>
              <div className="border border-[#e5e7eb] rounded-lg p-3">
                <p className="text-sm text-[#6b7280] mb-1">Total Absent Days</p>
                <p className="text-2xl font-bold text-[#dc2626]">{stats.absent}</p>
              </div>
              <div className="border border-[#e5e7eb] rounded-lg p-3">
                <p className="text-sm text-[#9333EA] font-medium mb-1">Total Working Hrs</p>
                <p className="text-2xl font-bold text-[#9333EA]">{stats.totalHours}h</p>
              </div>
            </div>
          </div>

          {/* Box 4: Attendance % */}
          <div className="bg-white p-6 rounded-lg shadow-md flex-1 flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-3 text-[#1a1a1a] self-start">Attendance</h2>
            <div
              className="relative w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(#9333EA ${stats.attendancePercent * 3.6}deg, #f3e8ff 0deg)`,
              }}
            >
              <div className="absolute w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-[#9333EA]">{stats.attendancePercent}%</p>
              </div>
            </div>
            <p className="text-sm text-[#6b7280] mt-3 text-center">
              {stats.present + stats.late} of {stats.present + stats.late + stats.absent} working days
            </p>
          </div>
        </div>
      </div>

      {/* Details section */}
      {selectedDayInfo && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <p className="text-sm text-[#9333EA] font-medium mb-1">Selected Date</p>
              <p className="text-lg font-semibold text-[#1a1a1a] mb-3">{selectedDayInfo.date}</p>

              {!selectedDayInfo.hasRecord ? (
                <span className="inline-block px-3 py-1 rounded bg-[#f3f4f6] text-[#6b7280] text-sm font-medium">
                  No Record
                </span>
              ) : selectedDayInfo.status === 'absent' ? (
                <span className="inline-block px-3 py-1 rounded bg-[#fee2e2] text-[#dc2626] text-sm font-medium">
                  Absent
                </span>
              ) : (
                <>
                  <p className="text-sm text-[#6b7280]">Check-in: {selectedDayInfo.checkIn || '-'}</p>
                  <p className="text-sm text-[#6b7280] mb-2">Check-out: {selectedDayInfo.checkOut || '-'}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      selectedDayInfo.status === 'present'
                        ? 'bg-[#dcfce7] text-[#16a34a]'
                        : 'bg-[#fef3c7] text-[#f59e0b]'
                    }`}
                  >
                    {selectedDayInfo.status === 'present' ? 'Present' : 'Late'}
                  </span>
                </>
              )}
            </div>

            {selectedDayInfo.hasRecord && selectedDayInfo.checkIn && (
              <div className="text-right">
                <p className="text-sm text-[#6b7280] mb-1"> Total Working Hours</p>
                <p className="text-2xl font-bold text-[#9333EA]">
                  {calcHours(selectedDayInfo.checkIn, selectedDayInfo.checkOut).toFixed(1)}h
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeHome;