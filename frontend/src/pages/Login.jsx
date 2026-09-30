import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('employee');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);

    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/employee-home');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0FC] font-[Poppins] px-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-[#1a1a1a]">AttendFlow</h1>

          {error && <p className="text-[#dc2626] text-sm mb-4">{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 p-2 border rounded border-[#d1d5db]"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-2 border rounded border-[#d1d5db]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded border-[#d1d5db]"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mb-6 p-2 border rounded border-[#d1d5db]"
          >
            <option value="employee">Login as Employee</option>
            <option value="admin">Login as Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-[#9333EA] text-white py-2 rounded font-semibold"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;