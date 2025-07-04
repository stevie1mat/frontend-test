"use client";

import React, { useEffect, useState } from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import dynamic from "next/dynamic";
import Image from "next/image";
// import TaskMap from "@/components/tasks/TasksMap";

const TaskMap = dynamic(() => import("@/components/tasks/TasksMap"), {
  ssr: false,
});

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_TASK_API_URL}/api/tasks/get/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const json = await res.json();
        setTasks(json.data || json);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  // Normalize tasks for list view (same as TasksMap)
  const normalizedTasks = tasks
    .map((t: any) => ({
      id: t.ID,
      title: t.Title,
      description: t.Description,
      location: t.Location,
      latitude: t.Latitude,
      longitude: t.Longitude,
      credits: t.Credits,
      locationType: t.LocationType,
      createdBy: t.CreatedBy,
      author: t.Author,
      availability: t.Availability,
    }))
    .filter((task: any) => task.latitude !== 0 && task.longitude !== 0);

  return (
    <ProtectedLayout>
      <div className="flex justify-end mb-4">
        <button
          className={`px-4 py-2 rounded-l ${view === 'map' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setView('map')}
        >
          Map View
        </button>
        <button
          className={`px-4 py-2 rounded-r ${view === 'list' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setView('list')}
        >
          List View
        </button>
      </div>
      {loading ? (
        <div className="text-center text-gray-600">Loading tasks...</div>
      ) : view === 'map' ? (
        <TaskMap tasks={tasks} />
      ) : (
        <div className="grid gap-4">
          {normalizedTasks.length === 0 ? (
            <div className="text-center text-gray-500">No tasks found.</div>
          ) : (
            normalizedTasks.map((task: any) => (
              <div key={task.id} className="bg-white/80 rounded-xl shadow p-4 border border-gray-200 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="font-semibold text-lg">{task.title}</div>
                  <div className="text-gray-500 text-sm mb-1">{task.location}</div>
                  <div className="text-yellow-600 font-medium text-sm mb-1">💰 {task.credits} credits</div>
                  {task.availability?.length > 0 && (
                    <div className="text-xs text-gray-500 mb-1">
                      📅 {task.availability[0].Date} — ⏰ {task.availability[0].TimeFrom} to {task.availability[0].TimeTo}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedTask(task)}
                  className="inline-block px-4 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600 text-sm font-semibold"
                >
                  View Task
                </button>
              </div>
            ))
          )}
        </div>
      )}
      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setSelectedTask(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={selectedTask.createdBy?.avatar?.trim() ? selectedTask.createdBy.avatar : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                width={48}
                height={48}
                className="rounded-full object-cover"
                alt={"avatar"}
              />
              <div>
                <p className="font-semibold text-sm">{selectedTask.author?.Name}</p>
                <p className="text-xs text-gray-500">{selectedTask.title}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-[13px] text-gray-600 mb-2">
              <span className="font-medium">Location</span>
              <span>{selectedTask.location}</span>
              <span className="font-medium">Type</span>
              <span>{selectedTask.locationType || "Unspecified"}</span>
            </div>
            {selectedTask.availability?.length > 0 && (
              <p className="text-xs text-gray-500 mb-1">
                📅 {selectedTask.availability[0].Date} — ⏰ {selectedTask.availability[0].TimeFrom} to {selectedTask.availability[0].TimeTo}
              </p>
            )}
            <p className="text-xs text-yellow-500 font-medium mb-2">
              💰 {selectedTask.credits} credits
            </p>
            {selectedTask.description && (
              <p className="text-gray-700 text-sm mb-2">{selectedTask.description}</p>
            )}
            <a
              href={`/tasks/view/${selectedTask.id}`}
              className="block w-full text-center text-sm py-2 px-3 rounded-lg bg-green-100 mt-2"
            >
              Go to Task Page ↗
            </a>
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}
