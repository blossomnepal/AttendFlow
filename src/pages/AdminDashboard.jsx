import { useNavigate } from 'react-router-dom';

const dummyEmployees = [
  { id: 1, name: 'Sita', status: 'Present', time: '9:02 AM' },
  { id: 2, name: 'Ram', status: 'Present', time: '8:55 AM' },
  { id: 3, name: 'Hari', status: 'Absent', time: '-' },
  { id: 4, name: 'Gita', status: 'Late', time: '10:15 AM' },
];

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen bg-[#f3f4f6]">
      <h1 className="text-2xl font-bold mb-6 text-[#1a1a1a]">Admin Dashboard</h1>

      <div className="bg-white rounded-lg shadow-md p-4 max-w-2xl">
        {dummyEmployees.map((emp) => (
          <div
            key={emp.id}
            onClick={() => navigate(`/employee-detail/${emp.id}`)}
            className="flex justify-between items-center py-3 border-b border-[#e5e7eb] cursor-pointer"
          >
            <span className="text-[#1a1a1a] font-medium">{emp.name}</span>
            <span
              className={
                emp.status === 'Present'
                  ? 'text-[#16a34a]'
                  : emp.status === 'Late'
                  ? 'text-[#f59e0b]'
                  : 'text-[#dc2626]'
              }
            >
              {emp.status} ({emp.time})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;