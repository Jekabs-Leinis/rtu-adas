"use client";

import { useEffect, useState } from "react";
import { fetchSchedules } from "../schedulingServices";
import { Shift } from "@/app/scheduling/schedulingModels";
import { Timestamp } from "@firebase/firestore";

export default function ScheduleListPage() {
  const [schedules, setSchedules] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedules() {
      try {
        const data = await fetchSchedules();
        setSchedules(data);

        console.log(data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSchedules();
  }, []);

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--color-text)] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Schedules</h1>
      {loading ? (
        <p className="text-[var(--color-text-light)]">Loading schedules...</p>
      ) : schedules.length === 0 ? (
        <p className="text-[var(--color-text-light)]">No schedules found.</p>
      ) : (
        <table className="w-full border-collapse border border-[var(--color-border)]">
          <thead>
            <tr>
              <th className="border p-2 text-[var(--color-text)]">Employee</th>
              <th className="border p-2 text-[var(--color-text)]">
                Shift Start
              </th>
              <th className="border p-2 text-[var(--color-text)]">Shift End</th>
              <th className="border p-2 text-[var(--color-text)]">Overtime</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="border p-2 text-[var(--color-text)]">
                  {schedule.employee.name}
                </td>
                <td className="border p-2 text-[var(--color-text)]">
                  {schedule.shiftStart instanceof Timestamp
                    ? schedule.shiftStart?.toDate().toTimeString()
                    : schedule.shiftStart.toTimeString()}
                </td>
                <td className="border p-2 text-[var(--color-text)]">
                  {schedule.shiftEnd instanceof Timestamp
                    ? schedule.shiftEnd?.toDate().toTimeString()
                    : schedule.shiftEnd.toTimeString()}
                </td>
                <td className="border p-2 text-[var(--color-text)]">
                  {schedule.isOvertime ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
