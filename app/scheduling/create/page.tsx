"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../shceduling.css";
import { fetchEmployees, saveShift } from "../schedulingServices";
import { Employee, Shift } from "../schedulingModels";
import customSelectStyles from "@/app/styles/selectStyleConfig";

export default function SchedulingPage() {
  const [employees, setEmployees] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedEmployee, setSelectedEmployee] = useState<
    { label: string; value: string } | null | any
  >(null);
  const [shiftStart, setShiftStart] = useState<Date | null>(null);
  const [shiftEnd, setShiftEnd] = useState<Date | null>(null);
  const [isOvertime, setIsOvertime] = useState(false);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const employeeData = await fetchEmployees();
        setEmployees(employeeData.map((e) => ({ label: e.name, value: e.id })));
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
    loadEmployees();
  }, []);

  const handleSave = async () => {
    if (!selectedEmployee || !shiftStart || !shiftEnd) {
      alert("Please fill in all fields.");
      return;
    }
    if (shiftEnd <= shiftStart) {
      alert("Shift end time must be after shift start time.");
      return;
    }

    const shift = new Shift(
      "",
      new Employee(selectedEmployee.value, selectedEmployee.label),
      shiftStart,
      shiftEnd,
      isOvertime,
    );

    try {
      await saveShift(shift);
      alert("Shift saved successfully!");
      setSelectedEmployee(null);
      setShiftStart(null);
      setShiftEnd(null);
      setIsOvertime(false);
    } catch (error) {
      console.error("Error saving shift:", error);
      alert("Failed to save shift. Please try again.");
    }
  };

  const handleCancel = () => {
    setSelectedEmployee(null);
    setShiftStart(null);
    setShiftEnd(null);
    setIsOvertime(false);
  };

  return (
    <div className="sch-container">
      <h1>Schedule Employee Shift</h1>
      <div className="form-group">
        <label>Employee</label>
        <Select
          options={employees}
          value={selectedEmployee}
          onChange={setSelectedEmployee}
          placeholder="Select an employee"
          styles={customSelectStyles}
        />
      </div>
      <div className="form-group">
        <label>Shift Start</label>
        <DatePicker
          selected={shiftStart}
          onChange={(date) => setShiftStart(date)}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Select shift start time"
          className="w-full"
          wrapperClassName="w-full"
        />
      </div>
      <div className="form-group">
        <label>Shift End</label>
        <DatePicker
          selected={shiftEnd}
          onChange={(date) => setShiftEnd(date)}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Select shift end time"
          className="w-full"
          wrapperClassName="w-full"
        />
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={isOvertime}
            onChange={(e) => setIsOvertime(e.target.checked)}
          />
          Overtime
        </label>
      </div>
      <div className="form-group flex justify-end gap-3">
        <button className="cancel" onClick={handleCancel}>
          Cancel
        </button>
        <button className="save" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
