"use client";

import React, { useEffect, useState } from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import dynamic from "next/dynamic";
// import TaskMap from "@/components/tasks/TasksMap";

const TaskMap = dynamic(() => import("@/components/tasks/TasksMap"), {
  ssr: false,
});

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_TASK_API_URL}/api/tasks/get/user`,
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
