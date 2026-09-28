import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/employeecontext';
import { formatDateKey, parseDateKey, getDayStatus, calcHours } from '../data/attendanceData';

const statusStyles = {
  present: { label: 'Present', badge: 'bg-[#dcfce7] text-[#16a34a]' },
  late: { label: 'Late', badge: 'bg-[#fef3c7] text-[#f59e0b]' },
  leave: { label: 'Leave', badge: 'bg-[#f3e8ff] text-[#9333EA]' },
  absent: { label: 'Absent', badge: 'bg-[#fee2e2] text-[#dc2626]' },
  weekend: { label: 'Weekend', badge: 'bg-[#f3f4f6] text-[#6b7280]' },
  upcoming: { label: 'Upcoming', badge: 'bg-[#f3f4f6] text-[#6b7280]' },
};

function AdminDashboard() {
  const navigate = useNavigate();
  const { employees } = useEmployees();
  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // One row per active employee for the selected date
  const rows = useMemo(() => {
    const dateObj = parseDateKey(selectedDate);
    return employees
      .filter((emp) => emp.active)
      .map((emp) => {
        const record = emp.attendance[selectedDate];
        return {
          id: emp.id,
          name: emp.name,
          position: emp.position,
          checkIn: record?.checkIn || '-',
          checkOut: record?.checkOut || '-',
          hours: calcHours(record?.checkIn, record?.checkOut),
          status: getDayStatus(dateObj, record),
        };
      });
  }, [employees, selectedDate]);

  const counts = useMemo(
    () => ({
      total: rows.length,
      present: rows.filter((r) => r.status === 'present').length,
      late: rows.filter((r) => r.status === 'late').length,
      leave: rows.filter((r) => r.status === 'leave').length,
      absent: rows.filter((r) => r.status === 'absent').length,
    }),
    [rows]
  );

  const filteredRows = rows.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm text-[#6b7280]">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border border-[#d1d5db] rounded-lg bg-white text-sm"
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-md">
          <p className="text-sm text-[#6b7280] mb-1">Active Employees</p>
          <p className="text-3xl font-bold text-[#1a1a1a]">{counts.total}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <p className="text-sm text-[#6b7280] mb-1">Present</p>
          <p className="text-3xl font-bold text-[#16a34a]">{counts.present}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <p className="text-sm text-[#6b7280] mb-1">Late</p>
          <p className="text-3xl font-bold text-[#f59e0b]">{counts.late}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <p className="text-sm text-[#6b7280] mb-1">On Leave</p>
          <p className="text-3xl font-bold text-[#9333EA]">{counts.leave}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <p className="text-sm text-[#6b7280] mb-1">Absent</p>
          <p className="text-3xl font-bold text-[#dc2626]">{counts.absent}</p>
        </div>
      </div>

      {/* Attendance table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">Employee Attendance</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search employee"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border border-[#d1d5db] rounded-lg text-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-[#d1d5db] rounded-lg text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="leave">Leave</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[#6b7280] border-b border-[#e5e7eb]">
                <th className="py-3 font-medium">Employee</th>
                <th className="py-3 font-medium">Check-in</th>
                <th className="py-3 font-medium">Check-out</th>
                <th className="py-3 font-medium">Hours</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => navigate(`/admin/employees/${row.id}`)}
                  className="border-b border-[#f3f4f6] cursor-pointer hover:bg-[#F5F0FC] transition"
                >
                  <td className="py-3">
                    <p className="font-medium text-[#1a1a1a]">{row.name}</p>
                    <p className="text-xs text-[#6b7280]">{row.position}</p>
                  </td>
                  <td className="py-3 text-[#6b7280]">{row.checkIn}</td>
                  <td className="py-3 text-[#6b7280]">{row.checkOut}</td>
                  <td className="py-3 text-[#6b7280]">
                    {row.hours > 0 ? `${row.hours.toFixed(1)}h` : '-'}
                  </td>
                  <td className="py-3">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${statusStyles[row.status].badge}`}>
                      {statusStyles[row.status].label}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-[#6b7280]">
                    No employees found
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

export default AdminDashboard;