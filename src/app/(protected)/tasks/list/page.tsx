"use client";

import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import { useRouter } from "next/navigation";

export default function TaskListPage() {
  const router = useRouter();

  const tasks = [
    { title: "Fix login bug", status: "pending", credits: 20 },
    { title: "Write onboarding doc", status: "completed", credits: 30 },
    { title: "Add dark mode support", status: "completed", credits: 50 },
    { title: "Update API docs", status: "pending", credits: 10 },
  ];

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100 p-8">
        {/* Header + Create Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Tasks</h1>
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow hover:scale-105 transition"
            onClick={() => router.push("/tasks/create")}
          >
            ➕ Create Task
          </button>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
              <p
                className={`text-xs mb-2 inline-block px-3 py-1 rounded-full ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {task.status === "completed" ? "✅ Completed" : "🕒 Pending"}
              </p>
              <p className="text-sm font-medium text-gray-600 mb-4">
                Credits: {task.credits} 🪙
              </p>

              <div className="flex justify-end gap-2 text-sm">
                <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  );
}
