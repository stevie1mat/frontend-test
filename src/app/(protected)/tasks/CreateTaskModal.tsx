"use client";

import { useState, useEffect } from "react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  showToast,
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

  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_TASK_API_URL || "http://localhost:8084";

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoibmVlbGFtZ2F1Y2hhbiIsImEiOiJjbWMwbzg0dXgwNGlnMmxwcmlncWVycnBnIn0.ARZnElbDY2SOiInY94w6aA";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/tasks/categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        showToast("❌ Failed to load categories.", "error");
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, showToast]);

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 6; hour <= 23; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${min
          .toString()
          .padStart(2, "0")}`;
        const label = new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        options.push(
          <option key={time} value={time}>
            {label}
          </option>
        );
      }
    }
    return options;
  };

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationInput = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = e.target.value;
    setFormData((prev) => ({ ...prev, location: query }));

    if (query.length > 2) {
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query + " Toronto"
        )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&country=CA&types=address&limit=5`;

        const res = await fetch(url);
        const data = await res.json();
        setLocationSuggestions(data.features);
      } catch (err) {
        console.error("Mapbox error:", err);
        showToast("❌ Failed to fetch locations.", "error");
      }
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleLocationSelect = (place: any) => {
    setFormData((prev) => ({
      ...prev,
      location: place.place_name,
      latitude: place.geometry.coordinates[1],
      longitude: place.geometry.coordinates[0],
    }));
    setLocationSuggestions([]);
  };

  const handleAvailabilityChange = (field: string, value: string) => {
    setFormData((prev) => {
      const availability = [...prev.availability];
      availability[0] = {
        ...availability[0],
        [field]: value,
      };
      return { ...prev, availability };
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { date, timeFrom, timeTo } = formData.availability[0];

    if (!date) {
      showToast("❌ Please select a date.", "error");
      return;
    }

    if (!timeFrom || !timeTo) {
      showToast("❌ Please select both start and end times.", "error");
      return;
    }

    if (timeFrom >= timeTo) {
      showToast("⏰ 'Time From' must be earlier than 'Time To'", "error");
      return;
    }

    const payload = {
      ...formData,
      category: selectedCategory,
      credits: Number(formData.credits),
    };
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        showToast("❌ Failed to create task.", "error");
      } else {
        showToast("✅ Task created successfully!", "success");
        onClose();
      }
    } catch (err) {
      console.error("Network error:", err);
      showToast("❌ Network error occurred.", "error");
    }
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
          <select
            name="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border px-4 py-2 rounded-xl"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

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
            <div className="relative">
              <input
                type="text"
                name="location"
                placeholder="Enter a Canadian location"
                className="border px-4 py-2 rounded-xl w-full"
                value={formData.location}
                onChange={handleLocationInput}
                required
              />
              {locationSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border rounded-xl mt-1 w-full max-h-48 overflow-y-auto shadow">
                  {locationSuggestions.map((place, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                      onClick={() => handleLocationSelect(place)}
                    >
                      {place.place_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

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
              required
            />

            <select
              value={formData.availability[0].timeFrom}
              onChange={(e) =>
                handleAvailabilityChange("timeFrom", e.target.value)
              }
              className="border px-4 py-2 rounded-xl"
              required
            >
              <option value="">From</option>
              {generateTimeOptions()}
            </select>

            <select
              value={formData.availability[0].timeTo}
              onChange={(e) =>
                handleAvailabilityChange("timeTo", e.target.value)
              }
              className="border px-4 py-2 rounded-xl"
              required
            >
              <option value="">To</option>
              {generateTimeOptions()}
            </select>
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
