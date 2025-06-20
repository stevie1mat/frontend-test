"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";

interface Availability {
  date: string;
  timeFrom: string;
  timeTo: string;
}

interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  location: string;
  locationType: string;
  credits: number;
  availability: Availability[];
  author?: Author;
  createdAt?: number;
  completedAt?: number;
  status?: string;
  type?: string;
  acceptedBy?: string;
}

// Normalize raw API data with uppercase keys
function normalizeTask(raw: any): Task {
  return {
    id: raw.ID,
    title: raw.Title,
    description: raw.Description,
    location: raw.Location,
    locationType: raw.LocationType,
    credits: raw.Credits,
    availability: (raw.Availability || []).map((a: any) => ({
      date: a.Date,
      timeFrom: a.TimeFrom,
      timeTo: a.TimeTo,
    })),
    author: raw.Author
      ? {
          id: raw.Author.ID,
          name: raw.Author.Name,
          email: raw.Author.Email,
          avatar: raw.Author.Avatar,
        }
      : undefined,
    createdAt: raw.CreatedAt,
    completedAt: raw.CompletedAt,
    status: raw.Status,
    type: raw.Type,
    acceptedBy: raw.AcceptedBy,
  };
}

export default function ViewTaskPage() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_TASK_API_URL || "http://localhost:8084";

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem("token");
      if (!token || !id) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/tasks/get/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        setTask(normalizeTask(json.data || json));
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) return <p className="p-8 text-lg">Loading task...</p>;
  if (!task) return <p className="p-8 text-lg">Task not found.</p>;

  return (
    <ProtectedLayout headerName="Task Details">
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex justify-center items-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-4 text-purple-700">
            {task.title}
          </h1>
          <p className="text-gray-700 mb-4">{task.description}</p>
          <div className="grid gap-3 text-sm text-gray-600 mb-6">
            <div>
              <span className="font-semibold">📍 Location:</span>{" "}
              {task.location} ({task.locationType})
            </div>
            <div>
              <span className="font-semibold">🗓️ Availability:</span>{" "}
              {task.availability?.[0]?.date} from{" "}
              {task.availability?.[0]?.timeFrom} to{" "}
              {task.availability?.[0]?.timeTo}
            </div>
            <div>
              <span className="font-semibold">🪙 Credits:</span> {task.credits}
            </div>
            {task.type && (
              <div>
                <span className="font-semibold">📦 Type:</span> {task.type}
              </div>
            )}
            {task.status && (
              <div>
                <span className="font-semibold">📌 Status:</span> {task.status}
              </div>
            )}

            {task.author && (
              <div>
                <span className="font-semibold">👤 Listed by:</span>{" "}
                {task.author.name} ({task.author.email})
              </div>
            )}
          </div>
          <Link
            href={`/book-appointment`}
            className="inline-block text-center w-full bg-purple-600 text-white py-3 rounded-xl text-lg font-medium hover:bg-purple-700 transition"
          >
            📅 Book Appointment
          </Link>
        </div>
      </div>
    </ProtectedLayout>
  );
}
