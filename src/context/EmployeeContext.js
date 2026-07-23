'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch from Neon DB via API
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Failed to fetch employees', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addEmployee = async (employee) => {
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      if (res.ok) {
        const newEmp = await res.json();
        setEmployees((prev) => [newEmp, ...prev]);
      }
    } catch (error) {
      console.error('Error adding employee', error);
    }
  };

  const editEmployee = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const updated = await res.json();
        setEmployees((prev) => prev.map(emp => emp.id === id ? updated : emp));
      }
    } catch (error) {
      console.error('Error updating employee', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setEmployees((prev) => prev.filter(emp => emp.id !== id));
      }
    } catch (error) {
      console.error('Error deleting employee', error);
    }
  };

  // Utility to format IDR
  const formatIDR = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <EmployeeContext.Provider value={{ employees, isLoading, addEmployee, editEmployee, deleteEmployee, formatIDR, refreshData: fetchEmployees }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => useContext(EmployeeContext);
