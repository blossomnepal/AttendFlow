import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/employeecontext';
import { formatDateKey, getDayStatus, calcHours } from '../data/attendanceData';

const cellStyles = {
  present: 'bg-[#dcfce7] text-[#16a34a]',
  late: 'bg-[#fef3c7] text-[#f59e0b]',
  leave: 'bg-[#f3e8ff] text-[#9333EA]',
  holiday: 'bg-[#fee2e2] text-[#dc2626]',
  absent: 'bg-[#fee2e2] text-[#dc2626]',
  weekend: 'bg-[#fee2e2] text-[#dc2626]',
  upcoming: 'bg-[#f9fafb] text-[#9ca3af]',
};

const labels = {
  present: 'Present',
  late: 'Late',
  leave: 'Leave',
  holiday: 'Holiday',
  absent: 'Absent',
};

function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, toggleActive } = useEmployees();
  const employee = employees.find((e) => e.id === Number(id));

  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const days = useMemo(() => {
    if (!employee) return [];
    const year = month.getFullYear();
    const m = month.getMonth();
    const count = new Date(year, m + 1, 0).getDate();
    return Array.from({ length: count }, (_, i) => {
      const date = new Date(year, m, i + 1);
      const key = formatDateKey(date);
      const record = employee.attendance[key];
      return {
        date,
        key,
        record,
        status: getDayStatus(date, record),
        hours: calcHours(record?.checkIn, record?.checkOut),
      };
    });
  }, [employee, month]);

  if (!employee) {
    return <p className="text-[#6b7280]">Employee not found.</p>;
  }

  const summary = {
    present: days.filter((d) => d.status === 'present').length,
    late: days.filter((d) => d.status === 'late').length,
    leave: days.filter((d) => d.status === 'leave').length,
    absent: days.filter((d) => d.status === 'absent').length,
    totalHours: days.reduce((sum, d) => sum + d.hours, 0).toFixed(1),
  };

  const monthLabel = month.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const firstDayOffset = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const workedDays = days.filter((d) => !['weekend', 'upcoming', 'holiday'].includes(d.status));

  const changeMonth = (step) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + step, 1));

  return (
    <div>
      <button
        onClick={() => navigate('/admin/employees')}
        className="text-sm text-[#9333EA] font-medium mb-4 hover:underline"
      >
        ← Back to employees
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">{employee.name}</h1>
          <p className="text-sm text-[#6b7280]">
            {employee.position} · {employee.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded text-xs font-medium ${
              employee.active ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#f3f4f6] text-[#6b7280]'
            }`}
          >
            {employee.active ? 'Active' : 'Inactive'}
          </span>
          <button
            onClick={() => toggleActive(employee.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${
              employee.active ? 'bg-[#dc2626]' : 'bg-[#16a34a]'
            }`}
          >
            {employee.active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-md">
          <p className="text-sm text-[#6b7280] mb-1">Present</p>
          <p className="text-3xl font-bold text-[#16a34a]">{summary.present}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <p className="text-sm text-[#6b7280] mb-1">Late</p>
          <p className="text-3xl font-bold text-[#f59e0b]">{summary.late}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <p className="text-sm text-[#6b7280] mb-1">Leave</p>
          <p className="text-3xl font-bold text-[#9333EA]">{summary.leave}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <p className="text-sm text-[#6b7280] mb-1">Absent</p>
          <p className="text-3xl font-bold text-[#dc2626]">{summary.absent}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <p className="text-sm text-[#9333EA] font-medium mb-1">Total Hours</p>
          <p className="text-3xl font-bold text-[#9333EA]">{summary.totalHours}h</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">{monthLabel}</h2>
          <div className="flex gap-2">
            <button onClick={() => changeMonth(-1)} className="px-3 py-1 border border-[#d1d5db] rounded-lg text-sm hover:bg-[#F5F0FC]">‹</button>
            <button onClick={() => changeMonth(1)} className="px-3 py-1 border border-[#d1d5db] rounded-lg text-sm hover:bg-[#F5F0FC]">›</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-[#6b7280] mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((d) => (
            <div
              key={d.key}
              className={`rounded-lg p-2 min-h-16 flex flex-col items-center justify-center ${cellStyles[d.status]}`}
            >
              <span className="text-sm font-semibold">{d.date.getDate()}</span>
              {d.hours > 0 && <span className="text-[10px]">{d.hours.toFixed(1)}h</span>}
              {d.status === 'leave' && <span className="text-[10px]">Leave</span>}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-xs text-[#6b7280]">
          {Object.entries(labels).map(([key, label]) => (
            <span key={key} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded ${cellStyles[key].split(' ')[0]}`}></span>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-[#1a1a1a]">Daily Record</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[#6b7280] border-b border-[#e5e7eb]">
                <th className="py-3 font-medium">Date</th>
                <th className="py-3 font-medium">Check-in</th>
                <th className="py-3 font-medium">Check-out</th>
                <th className="py-3 font-medium">Hours</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {workedDays.map((d) => (
                <tr key={d.key} className="border-b border-[#f3f4f6]">
                  <td className="py-3 text-[#1a1a1a]">
                    {d.date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </td>
                  <td className="py-3 text-[#6b7280]">{d.record?.checkIn || '-'}</td>
                  <td className="py-3 text-[#6b7280]">{d.record?.checkOut || '-'}</td>
                  <td className="py-3 text-[#6b7280]">{d.hours > 0 ? `${d.hours.toFixed(1)}h` : '-'}</td>
                  <td className="py-3">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${cellStyles[d.status]}`}>
                      {labels[d.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {workedDays.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-[#6b7280]">
                    No records for this month
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;