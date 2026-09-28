import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/employees', label: 'Manage Employees' },
];

function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <aside className="w-60 bg-white shadow-md p-5 flex flex-col">
        <h1 className="text-xl font-bold text-[#9333EA] mb-8">AttendFlow</h1>

        <nav className="flex flex-col gap-2 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#9333EA] text-white'
                    : 'text-[#6b7280] hover:bg-[#F5F0FC] hover:text-[#9333EA]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => navigate('/')}
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#dc2626] hover:bg-[#fee2e2] transition text-left"
        >
          Log Out
        </button>
      </aside>

      <main className="flex-1 p-6 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;