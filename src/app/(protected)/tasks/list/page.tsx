"use client";

import { useEffect, useState } from "react";
import CreateListingModal from "../CreateTaskModal";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Availability {
  date: string;
  timeFrom: string;
  timeTo: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  locationType: string;
  credits: number;
  availability: Availability[];
  type?: string;
  status?: string;
}

function normalizeTask(raw: any): Task {
  return {
    id: raw.ID,
    title: raw.Title,
    description: raw.Description,
    location: raw.Location,
    latitude: raw.Latitude,
    longitude: raw.Longitude,
    locationType: raw.LocationType,
    credits: raw.Credits,
    availability: raw.Availability,
    type: raw.Type,
    status: raw.Status,
  };
}

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_TASK_API_URL || "http://localhost:8084";

  const fetchTasks = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE_URL}/api/tasks/get/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const normalized = (json.data || json).map(normalizeTask);
        setTasks(normalized);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/tasks/delete/${taskToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        toast.error("❌ Failed to delete task");
        return;
      }

      toast.success("🗑️ Task deleted");
      fetchTasks();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("❌ Network error");
    } finally {
      setShowConfirmModal(false);
      setTaskToDelete(null);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Community Listings</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow hover:scale-105 transition"
          >
            ➕ Create Listing
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl relative"
              >
                <button
                  onClick={() => {
                    setTaskToDelete(task.id);
                    setShowConfirmModal(true);
                  }}
                  className="absolute top-3 right-4 text-lg text-red-500 hover:text-red-700 font-bold"
                  title="Delete"
                >
                  ×
                </button>
                <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <p className="text-xs text-gray-500 mb-1">
                  📍 <strong>{task.location}</strong> ({task.locationType})
                </p>
                {task.availability?.length > 0 && (
                  <p className="text-xs text-gray-500 mb-1">
                    📅 {task.availability[0].date} — ⏰{" "}
                    {task.availability[0].TimeFrom} to{" "}
                    {task.availability[0].TimeTo}
                  </p>
                )}
                <p className="text-sm font-medium text-gray-700">
                  🪙 {task.credits} credits
                </p>
              </div>
            ))}
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
              <p className="text-sm text-gray-600 mb-6">
                This will permanently delete the task.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <CreateListingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            fetchTasks();
          }}
          showToast={(msg, type) => toast[type](msg)}
        />

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </ProtectedLayout>
  );
}
