import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDateKey } from '../data/attendanceData';

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

function getRecentActivity() {
  return Object.entries(rawAttendance)
    .filter(([, r]) => r.checkIn)
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
    .slice(0, 5);
}

function EmployeeHome() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || '');
  }, []);

  const handleCheckIn = () => {
    setCheckedIn(true);
    setCheckInTime(new Date().toLocaleTimeString());
    setCheckOutTime(null);
  };

  const handleCheckOut = () => {
    setCheckedIn(false);
    setCheckOutTime(new Date().toLocaleTimeString());
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/');
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

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveDate || !leaveReason) return;
    setLeaveSubmitted(true);
    setShowLeaveForm(false);
    setLeaveDate('');
    setLeaveReason('');
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

  const streak = useMemo(() => {
    let count = 0;
    const day = new Date();
    while (true) {
      const key = formatDateKey(day);
      const record = dummyAttendance[key];
      if (record && record.status !== 'absent') {
        count++;
        day.setDate(day.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, []);

  const recentActivity = getRecentActivity();
  const initial = userName ? userName.charAt(0).toUpperCase() : '?';

  const cardClass = 'bg-white p-6 rounded-xl shadow-sm border border-[#e5e7eb] h-full flex flex-col';

  return (
    <div className="p-6 min-h-screen bg-[#f3f4f6] font-[Poppins]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#9333EA] text-white flex items-center justify-center font-semibold">
            {initial}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a] leading-tight">{userName || 'Employee'}</h1>
            
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-[#dc2626] border border-[#dc2626] hover:bg-[#fee2e2] transition"
        >
          Log Out
        </button>
      </div>

      {/* Row 1: Today, Calendar, Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr_1.5fr] gap-6 mb-6">
        {/* Today */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold mb-4 text-[#1a1a1a]">Today</h2>

          <div className="flex items-center justify-between mb-4 bg-[#f9fafb] rounded-lg p-3">
            <span className="text-sm text-[#6b7280]">Status</span>
            <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
              checkedIn ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#f3f4f6] text-[#6b7280]'
            }`}>
              {checkedIn ? 'Checked In' : 'Not Checked In'}
            </span>
          </div>

          {(checkInTime || checkOutTime) && (
            <div className="mb-4 text-sm text-[#6b7280] space-y-1">
              {checkInTime && <p>Check-in: <span className="text-[#1a1a1a] font-medium">{checkInTime}</span></p>}
              {checkOutTime && <p>Check-out: <span className="text-[#1a1a1a] font-medium">{checkOutTime}</span></p>}
            </div>
          )}

          {!checkedIn ? (
            <button
              onClick={handleCheckIn}
              className="w-full bg-[#9333EA] text-white py-2.5 rounded-lg font-semibold hover:bg-[#7e22ce] transition"
            >
              Check In
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              className="w-full bg-[#dc2626] text-white py-2.5 rounded-lg font-semibold hover:bg-[#b91c1c] transition"
            >
              Check Out
            </button>
          )}

          
        </div>

        {/* Calendar */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold mb-3 text-[#1a1a1a]">Calendar</h2>
          <Calendar
            value={calendarDate}
            onChange={setCalendarDate}
            onClickDay={handleDayClick}
            tileClassName={tileClassName}
            className="w-full border-none"
          />
        </div>

        {/* Summary */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold mb-4 text-[#1a1a1a]">Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#e5e7eb] rounded-lg p-4">
              <p className="text-sm text-[#6b7280] mb-1">Present Days</p>
              <p className="text-2xl font-bold text-[#16a34a]">{stats.present}</p>
            </div>
            <div className="border border-[#e5e7eb] rounded-lg p-4">
              <p className="text-sm text-[#6b7280] mb-1">Late Days</p>
              <p className="text-2xl font-bold text-[#f59e0b]">{stats.late}</p>
            </div>
            <div className="border border-[#e5e7eb] rounded-lg p-4">
              <p className="text-sm text-[#6b7280] mb-1">Absent Days</p>
              <p className="text-2xl font-bold text-[#dc2626]">{stats.absent}</p>
            </div>
            <div className="border border-[#e5e7eb] rounded-lg p-4">
              <p className="text-sm text-[#9333EA] font-medium mb-1">Working Hrs</p>
              <p className="text-2xl font-bold text-[#9333EA]">{stats.totalHours}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Recent Activity, Leave, Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Activity */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold mb-4 text-[#1a1a1a]">Recent Activity</h2>
          <div className="flex flex-col divide-y divide-[#f3f4f6]">
            {recentActivity.map(([date, record]) => {
              const status = getStatus(record.checkIn);
              const dotColor =
                status === 'present' ? 'bg-[#16a34a]' :
                status === 'late' ? 'bg-[#f59e0b]' : 'bg-[#dc2626]';
              return (
                <div key={date} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${dotColor} shrink-0`}></div>
                    <span className="text-xs text-[#1a1a1a] font-medium">{date}</span>
                  </div>
                  <span className="text-xs text-[#6b7280] bg-[#f9fafb] px-2 py-1 rounded-full whitespace-nowrap">
                    {record.checkIn} → {record.checkOut || '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leave */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1a1a1a]">Leave</h2>
            <button
              onClick={() => setShowLeaveForm(!showLeaveForm)}
              className="text-sm font-semibold text-white bg-[#9333EA] px-3 py-1.5 rounded-lg hover:bg-[#7e22ce] transition"
            >
              {showLeaveForm ? 'Cancel' : '+ Request'}
            </button>
          </div>

          {leaveSubmitted && (
            <p className="text-sm text-[#16a34a] bg-[#dcfce7] px-3 py-2 rounded-lg mb-3">
              Leave request submitted for admin approval.
            </p>
          )}

          {showLeaveForm ? (
            <form onSubmit={handleLeaveSubmit} className="flex flex-col gap-3">
              <input
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                className="p-2 border border-[#d1d5db] rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Reason"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="p-2 border border-[#d1d5db] rounded-lg text-sm"
              />
              <button
                type="submit"
                className="bg-[#9333EA] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#7e22ce] transition"
              >
                Submit
              </button>
            </form>
          ) : (
            <p className="text-sm text-[#9ca3af]">No pending leave requests.</p>
          )}
        </div>

        {/* Attendance */}
        <div className={`${cardClass} items-center justify-center`}>
          <h2 className="text-lg font-semibold mb-4 text-[#1a1a1a] self-start">Attendance</h2>
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(#9333EA ${stats.attendancePercent * 3.6}deg, #f3e8ff 0deg)`,
            }}
          >
            <div className="absolute w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-[#9333EA]">{stats.attendancePercent}%</p>
            </div>
          </div>
          <p className="text-sm text-[#6b7280] mt-4 text-center">
            {stats.present + stats.late} of {stats.present + stats.late + stats.absent} working days
          </p>
        </div>
      </div>

      {/* Details section */}
      {selectedDayInfo && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e5e7eb]">
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
                <p className="text-sm text-[#6b7280] mb-1">Working Hours</p>
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