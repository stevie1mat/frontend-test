"use client";

import { useState } from "react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    locationType: "in-person",
    credits: "",
    availability: [{ date: "", timeFrom: "", timeTo: "" }],
  });

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (field: string, value: string) => {
    const updated = [...formData.availability];
    updated[0][field] = value;
    setFormData((prev) => ({ ...prev, availability: updated }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Creating Task:", formData);
    onClose(); // close modal after submit
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-red-500"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-purple-700">
          📝 Create Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="w-full border px-4 py-2 rounded-xl"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            rows={2}
            className="w-full border px-4 py-2 rounded-xl"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="border px-4 py-2 rounded-xl"
              value={formData.location}
              onChange={handleChange}
            />
            <select
              name="locationType"
              className="border px-4 py-2 rounded-xl"
              value={formData.locationType}
              onChange={handleChange}
            >
              <option value="in-person">In-person</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="latitude"
              placeholder="Latitude (auto-fill)"
              className="border px-4 py-2 rounded-xl"
              value={formData.latitude}
              onChange={handleChange}
            />
            <input
              type="number"
              name="longitude"
              placeholder="Longitude (auto-fill)"
              className="border px-4 py-2 rounded-xl"
              value={formData.longitude}
              onChange={handleChange}
            />
          </div>

          <input
            type="number"
            name="credits"
            placeholder="Credits"
            className="w-full border px-4 py-2 rounded-xl"
            value={formData.credits}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="date"
              value={formData.availability[0].date}
              onChange={(e) => handleAvailabilityChange("date", e.target.value)}
              className="border px-4 py-2 rounded-xl"
            />
            <input
              type="time"
              value={formData.availability[0].timeFrom}
              onChange={(e) =>
                handleAvailabilityChange("timeFrom", e.target.value)
              }
              className="border px-4 py-2 rounded-xl"
            />
            <input
              type="time"
              value={formData.availability[0].timeTo}
              onChange={(e) =>
                handleAvailabilityChange("timeTo", e.target.value)
              }
              className="border px-4 py-2 rounded-xl"
            />
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
            >
              ✅ Submit Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
