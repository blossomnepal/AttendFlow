import { createContext, useContext, useState } from 'react';
import { initialEmployees } from '../data/attendanceData';

const EmployeeContext = createContext();

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState(initialEmployees);

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

  const toggleActive = (id) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e))
    );
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, toggleActive }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  return useContext(EmployeeContext);
}