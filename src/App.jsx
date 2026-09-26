import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import EmployeeHome from './pages/EmployeeHome';
import AttendanceCalendar from './pages/AttendanceCalendar';
import AdminDashboard from './pages/AdminDashboard';
import AdminCalendar from './pages/AdminCalendar';
import EmployeeDetail from './pages/EmployeeDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employee-home" element={<EmployeeHome />} />
        <Route path="/attendance-calendar" element={<AttendanceCalendar />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-calendar" element={<AdminCalendar />} />
        <Route path="/employee-detail/:id" element={<EmployeeDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;