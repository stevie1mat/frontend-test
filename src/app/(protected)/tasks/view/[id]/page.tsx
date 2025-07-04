"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import { PopupModal } from 'react-calendly';

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
  const router = useRouter();
  const [calendlyOpen, setCalendlyOpen] = useState(false);

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

  if (loading || !task) {
    return (
      <ProtectedLayout headerName="Task Details">
        <div className="min-h-screen bg-white flex justify-center items-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-3xl border border-gray-200 flex items-center justify-center" style={{ minHeight: 320 }}>
            <span className="text-lg text-gray-600 font-medium">
              {loading ? "Loading task..." : "Task not found."}
            </span>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout headerName="Task Details">
      <div className="min-h-screen bg-white flex justify-center items-start mt-20">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-3xl border border-gray-200 relative mt-8">
          <button
            onClick={() => router.push('/tasks/explore')}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full shadow border border-gray-200 text-sm font-medium transition mt-2 mb-10 ml-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Explore
          </button>
          <h1 className="text-3xl font-extrabold mb-2 text-emerald-700">{task.title}</h1>
          <p className="text-gray-700 mb-4 text-lg">{task.description}</p>
          <div className="grid gap-3 text-base text-gray-700 mb-6">
            <div>
              <span className="font-semibold">📍 Location:</span> {task.location} <span className="text-xs text-gray-500">({task.locationType})</span>
            </div>
            <div>
              <span className="font-semibold">🗓️ Availability:</span> {task.availability?.[0]?.date} from {task.availability?.[0]?.timeFrom} to {task.availability?.[0]?.timeTo}
            </div>
            <div>
              <span className="font-semibold">💰 Credits:</span> <span className="text-yellow-600 font-bold">{task.credits}</span>
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
          </div>
          {task.author && (
            <div className="flex items-center gap-4 mb-6 p-4 bg-white/70 rounded-xl border border-gray-100">
              <Image
                src={task.author.avatar?.trim() ? task.author.avatar : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                width={56}
                height={56}
                className="rounded-full object-cover border border-gray-200"
                alt="avatar"
              />
              <div>
                <div className="font-semibold text-lg text-gray-800">{task.author.name}</div>
                <div className="text-gray-500 text-sm">{task.author.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCalendlyOpen(true)}
            className="inline-block text-center w-full bg-emerald-500 text-white py-3 rounded-xl text-lg font-semibold hover:bg-emerald-600 transition"
          >
            <span role="img" aria-label="calendar">📅</span> Book Appointment
          </button>
          {typeof window !== 'undefined' && (
            <PopupModal
              url="https://calendly.com/yourname/meeting"
              onModalClose={() => setCalendlyOpen(false)}
              open={calendlyOpen}
              rootElement={document.body}
            />
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
