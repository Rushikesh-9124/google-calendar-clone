import { useState } from "react";
import axios from "axios";

export default function CreateEventModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    start: "",
    end: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/api/events/create-event", form);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[320px] shadow-xl">
        <h2 className="text-xl font-semibold mb-3">Add Event</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="datetime-local"
            name="start"
            value={form.start}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="datetime-local"
            name="end"
            value={form.end}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
