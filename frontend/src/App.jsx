import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EmployeeProvider } from './context/employeecontext';
import Login from './pages/Login';
import EmployeeHome from './pages/EmployeeHome';
import AdminLayout from './components/Adminlayout';
import AdminDashboard from './pages/AdminDashboard';
import ManageEmployees from './pages/ManageEmployee';
import EmployeeDetail from './pages/EmployeeDetail';

function App() {
  return (
    <EmployeeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/employee-home" element={<EmployeeHome />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<ManageEmployees />} />
            <Route path="employees/:id" element={<EmployeeDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </EmployeeProvider>
  );
}

export default App;