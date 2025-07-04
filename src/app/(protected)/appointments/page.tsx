import React from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";

const mockAppointments = [
  {
    id: 1,
    title: "Teach Spanish Foundations",
    date: "2025-06-21",
    time: "10:00 - 12:00",
    location: "Seneca College Loop, North York",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Help with French Homework",
    date: "2025-06-22",
    time: "14:00 - 16:00",
    location: "Downtown Library",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Math Tutoring Session",
    date: "2025-06-23",
    time: "09:00 - 10:30",
    location: "Online",
    status: "upcoming",
  },
  {
    id: 4,
    title: "Science Project Help",
    date: "2025-06-24",
    time: "13:00 - 14:00",
    location: "Community Center",
    status: "upcoming",
  },
  {
    id: 6,
    title: "Help with French Homework",
    date: "2025-06-20",
    time: "14:00 - 16:00",
    location: "Downtown Library",
    status: "past",
  },
  {
    id: 7,
    title: "Career Coaching",
    date: "2025-06-15",
    time: "11:00 - 12:00",
    location: "Online",
    status: "past",
  },
  {
    id: 8,
    title: "SAT Prep Session",
    date: "2025-06-10",
    time: "15:00 - 16:30",
    location: "Community Center",
    status: "past",
  },
  {
    id: 9,
    title: "English Conversation Practice",
    date: "2025-06-05",
    time: "17:00 - 18:00",
    location: "Online",
    status: "past",
  }
];

export default function AppointmentsPage() {
  const upcoming = mockAppointments.filter((a) => a.status === "upcoming");
  const past = mockAppointments.filter((a) => a.status === "past");
  return (
    <ProtectedLayout>
      <div className="max-w-5xl pl-8 py-10 space-y-10">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-left">Upcoming Appointments</h2>
          {upcoming.length === 0 ? (
            <div className="text-gray-500">No upcoming appointments.</div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {upcoming.map((appt) => (
                <div key={appt.id} className="bg-white/80 rounded-xl shadow p-5 border border-gray-200 flex flex-col gap-2">
                  <div className="font-semibold text-lg text-emerald-700">{appt.title}</div>
                  <div className="text-gray-600 text-sm mb-1">📍 {appt.location}</div>
                  <div className="text-gray-500 text-sm">🗓️ {appt.date} &nbsp; ⏰ {appt.time}</div>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold self-start mt-2">Upcoming</span>
                </div>
              ))}
            </div>
          )}
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Past Appointments</h2>
          {past.length === 0 ? (
            <div className="text-gray-500">No past appointments.</div>
          ) : (
            <div className="space-y-4">
              {past.map((appt) => (
                <div key={appt.id} className="bg-white/80 rounded-xl shadow p-5 border border-gray-200 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-gray-700">{appt.title}</div>
                    <div className="text-gray-600 text-sm mb-1">📍 {appt.location}</div>
                    <div className="text-gray-500 text-sm">🗓️ {appt.date} &nbsp; ⏰ {appt.time}</div>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">Past</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </ProtectedLayout>
  );
} 