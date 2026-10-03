import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../context/employeecontext';

function ManageEmployees() {
  const navigate = useNavigate();
  const { employees, addEmployee, editEmployee, deleteEmployee } = useEmployees();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', position: '', password: '' });
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [confirmAction, setConfirmAction] = useState(null); 

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({ name: '', email: '', position: '', password: '' });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleAddClick = () => {
    if (showForm && !editingId) {
      resetForm();
      return;
    }
    setForm({ name: '', email: '', position: '', password: '' });
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const handleEditClick = (emp) => {
    setForm({ name: emp.name, email: emp.email, position: emp.position, password: '' });
    setEditingId(emp.id);
    setError('');
    setShowForm(true);
  };

  const validateForm = () => {
    const name = form.name.trim();
    const email = form.email.trim();
    const position = form.position.trim();

    if (!name || !email || !position) {
      setError('Please fill in all fields');
      return false;
    }
    if (!editingId && !form.password) {
      setError('Please set a password');
      return false;
    }
    if (!editingId && form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    const emailTaken = employees.some(
      (emp) => emp.email.toLowerCase() === email.toLowerCase() && emp.id !== editingId
    );
    if (emailTaken) {
      setError('An account with this email already exists');
      return false;
    }
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setConfirmAction({ type: 'save' });
  };

  const handleConfirmSave = () => {
    const name = form.name.trim();
    const email = form.email.trim();
    const position = form.position.trim();

    if (editingId) {
      editEmployee(editingId, { name, email, position });
    } else {
      addEmployee({ name, email, position });
    }
    setConfirmAction(null);
    resetForm();
  };

  const handleDeleteClick = (emp) => {
    setConfirmAction({ type: 'delete', target: emp });
  };

  const handleConfirmDelete = () => {
    deleteEmployee(confirmAction.target.id);
    setConfirmAction(null);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass = 'w-full p-2 border border-[#d1d5db] rounded-lg text-sm';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Manage Employees</h1>
        <button
          type="button"
          onClick={handleAddClick}
          className="bg-[#9333EA] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#7e22ce] transition"
        >
          {showForm && !editingId ? 'Cancel' : '+ Create Account'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4 text-[#1a1a1a]">
            {editingId ? 'Edit Employee' : 'New Employee Account'}
          </h2>
          {error && <p className="text-[#dc2626] text-sm mb-4">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              name="position"
              placeholder="Position (e.g. Developer)"
              value={form.position}
              onChange={handleChange}
              className={inputClass}
            />
            {!editingId && (
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={inputClass}
              />
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-[#9333EA] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#7e22ce] transition"
            >
              {editingId ? 'Save Changes' : 'Create Account'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-[#6b7280] border border-[#d1d5db] hover:bg-[#f3f4f6] transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">
            Employees ({filteredEmployees.length})
          </h2>
          <input
            type="text"
            placeholder="Search by name, email, or position"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-[#d1d5db] rounded-lg text-sm w-64"
          />
        </div>

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
              {filteredEmployees.map((emp) => (
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
                      type="button"
                      onClick={() => navigate(`/admin/employees/${emp.id}`)}
                      className="text-[#9333EA] text-sm font-medium mr-4 hover:underline"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditClick(emp)}
                      className="text-[#9333EA] text-sm font-medium mr-4 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(emp)}
                      className="text-sm font-medium text-[#dc2626] hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-[#6b7280]">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation modal — shared for Save and Delete */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            {confirmAction.type === 'save' ? (
              <>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">
                  {editingId ? 'Save changes?' : 'Create this account?'}
                </h3>
                <p className="text-sm text-[#6b7280] mb-6">
                  Are you sure you want to {editingId ? 'save these changes' : 'create this employee account'}?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmSave}
                    className="flex-1 bg-[#9333EA] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#7e22ce] transition"
                  >
                    Yes, {editingId ? 'save' : 'create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmAction(null)}
                    className="flex-1 border border-[#d1d5db] text-[#6b7280] py-2 rounded-lg text-sm font-semibold hover:bg-[#f3f4f6] transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Delete employee?</h3>
                <p className="text-sm text-[#6b7280] mb-6">
                  Are you sure you want to delete <span className="font-medium text-[#1a1a1a]">{confirmAction.target.name}</span>'s account? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="flex-1 bg-[#dc2626] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#b91c1c] transition"
                  >
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmAction(null)}
                    className="flex-1 border border-[#d1d5db] text-[#6b7280] py-2 rounded-lg text-sm font-semibold hover:bg-[#f3f4f6] transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageEmployees;