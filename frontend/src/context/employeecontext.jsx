import { createContext, useContext, useState, useEffect } from 'react';
import { initialEmployees } from '../data/attendanceData';

const EmployeeContext = createContext();
const STORAGE_KEY = 'attendflow_employees';

function loadEmployees() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialEmployees;
  } catch {
    return initialEmployees;
  }
}

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState(loadEmployees);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const addEmployee = ({ name, email, position }) => {
    const newEmployee = {
      id: Date.now(),
      name,
      email,
      position,
      active: true,
      attendance: {},
    };
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const editEmployee = (id, updates) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const toggleActive = (id) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e))
    );
  };

  const deleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <EmployeeContext.Provider
      value={{ employees, addEmployee, editEmployee, toggleActive, deleteEmployee }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  return useContext(EmployeeContext);
}