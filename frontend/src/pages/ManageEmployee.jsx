import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/employeecontext';

function ManageEmployees() {
  const navigate = useNavigate();
  const { employees, addEmployee, toggleActive } = useEmployees();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', position: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.position || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    if (employees.some((emp) => emp.email.toLowerCase() === form.email.toLowerCase())) {
      setError('An account with this email already exists');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    
    addEmployee({ name: form.name, email: form.email, position: form.position });
    setForm({ name: '', email: '', position: '', password: '' });
    setShowForm(false);
  };

  const inputClass = 'w-full p-2 border border-[#d1d5db] rounded-lg text-sm';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Manage Employees</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#9333EA] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#7e22ce] transition"
        >
          {showForm ? 'Cancel' : '+ Create Account'}
        </button>
      </div>

      {/* Create account form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4 text-[#1a1a1a]">New Employee Account</h2>
          {error && <p className="text-[#dc2626] text-sm mb-4">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} className={inputClass} />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputClass} />
            <input name="position" placeholder="Position (e.g. Developer)" value={form.position} onChange={handleChange} className={inputClass} />
            <input name="password" type="password" placeholder="Temporary password" value={form.password} onChange={handleChange} className={inputClass} />
          </div>

          <button
            type="submit"
            className="bg-[#9333EA] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#7e22ce] transition"
          >
            Create Account
          </button>
        </form>
      )}

      {/* Employee table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[#6b7280] border-b border-[#e5e7eb]">
                <th className="py-3 font-medium">Employee</th>
                <th className="py-3 font-medium">Email</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-[#f3f4f6]">
                  <td className="py-3">
                    <p className="font-medium text-[#1a1a1a]">{emp.name}</p>
                    <p className="text-xs text-[#6b7280]">{emp.position}</p>
                  </td>
                  <td className="py-3 text-[#6b7280]">{emp.email}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                        emp.active ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#f3f4f6] text-[#6b7280]'
                      }`}
                    >
                      {emp.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => navigate(`/admin/employees/${emp.id}`)}
                      className="text-[#9333EA] text-sm font-medium mr-4 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => toggleActive(emp.id)}
                      className={`text-sm font-medium hover:underline ${
                        emp.active ? 'text-[#dc2626]' : 'text-[#16a34a]'
                      }`}
                    >
                      {emp.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageEmployees;