"use client";

import React, { useEffect, useState } from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import TaskMap from "@/components/tasks/TasksMap";

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_TASK_API_URL || "http://localhost:8084";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/tasks/get/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTasks();
    }
  }, [token]);

  return (
    <ProtectedLayout>
      {loading ? (
        <div className="text-center text-gray-600">Loading tasks...</div>
      ) : (
        <TaskMap tasks={tasks} /> // 👈 pass the tasks as props
      )}
    </ProtectedLayout>
  );
}
