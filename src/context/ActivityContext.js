'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [attendances, setAttendances] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payslips, setPayslips] = useState([]);

  const fetchActivities = () => {
    fetch('/api/attendance')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAttendances(data);
      })
      .catch(err => console.error(err));

    fetch('/api/leave')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLeaves(data);
      })
      .catch(err => console.error(err));

    fetch('/api/payslip')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPayslips(data);
      })
      .catch(err => console.error(err));
  };

  // Load from API on mount
  useEffect(() => {
    fetchActivities();
  }, []);

  const checkIn = async (employee) => {
    const employeeId = employee.employeeId || employee.id;
    try {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      // Late if after 08:30
      const isLate = currentHour > 8 || (currentHour === 8 && currentMinute > 30);
      const status = isLate ? 'Terlambat' : 'Hadir';

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employeeId,
          date: now.toLocaleDateString('id-ID'),
          time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          status: status
        })
      });
      if (res.ok) {
        fetchActivities();
      }
    } catch (err) {
      console.error('Check in failed', err);
    }
  };

  const checkOut = async (employee) => {
    const employeeId = employee.employeeId || employee.id;
    try {
      const now = new Date();
      const res = await fetch('/api/attendance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employeeId,
          date: now.toLocaleDateString('id-ID'),
          checkOut: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        })
      });
      if (res.ok) {
        const updatedRecord = await res.json();
        setAttendances((prev) => prev.map(a => a.id === updatedRecord.id ? updatedRecord : a));
      }
    } catch (err) {
      console.error('Check out failed', err);
    }
  };

  const resetAttendance = async (id) => {
    try {
      const res = await fetch(`/api/attendance?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchActivities();
      }
    } catch (err) {
      console.error('Error resetting attendance', err);
    }
  };

  const submitLeave = async (employee, form) => {
    const employeeId = employee.employeeId || employee.id;
    try {
      const res = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employeeId,
          type: form.type,
          startDate: form.startDate,
          endDate: form.endDate,
          reason: form.reason
        })
      });
      if (res.ok) {
        const newLeave = await res.json();
        setLeaves((prev) => [newLeave, ...prev]);
      }
    } catch (err) {
      console.error('Submit leave failed', err);
    }
  };

  const updateLeaveStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/leave', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        fetchActivities();
      }
    } catch (err) {
      console.error('Update leave status failed', err);
    }
  };

  const generatePayslip = async (data) => {
    try {
      const res = await fetch('/api/payslip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const newPayslip = await res.json();
        setPayslips((prev) => [newPayslip, ...prev]);
      }
    } catch (err) {
      console.error('Generate payslip failed', err);
    }
  };

  return (
    <ActivityContext.Provider value={{ attendances, checkIn, checkOut, resetAttendance, leaves, submitLeave, updateLeaveStatus, payslips, generatePayslip, refreshActivities: fetchActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);
