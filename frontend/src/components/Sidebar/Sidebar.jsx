import React, { useState, useEffect } from "react";
import { ArrowDown, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import axiosInstance from "../../helper/axiosInstance";
import { VscTriangleDown } from "react-icons/vsc";


export default function Sidebar({ currentDate, onSelectDate }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [currentMonth, setCurrentMonth] = useState(new Date(currentDate));
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [createType, setCreateType] = useState(null); // "event" | "task"

  useEffect(() => {
    setCurrentMonth(new Date(currentDate));
  }, [currentDate]);

  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const prevDays = Array.from({ length: startDay }, () => null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    return [...prevDays, ...days];
  };

  const changeMonth = (offset) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    );
  };

  const handleSelectDay = (day) => {
    if (!day) return;
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onSelectDate(newDate);
  };

  const days = getMonthDays();
  const today = new Date();

  return (
    <>
      <aside  className="w-65 bg-black/1 px-4 py-5 flex flex-col justify-between relative">
        <div className="relative" onClick={() =>showCreateMenu && setShowCreateMenu(false)}>
          <button
            onClick={() => setShowCreateMenu((prev) => !prev)}
            className="flex max-w-[135px] h-[60px] items-center justify-center gap-2 bg-white  px-3 py-3 rounded-2xl   shadow-md shadow-gray-400 cursor-pointer  hover:shadow-md transition w-full"
          >
            <Plus size={20} /> Create <VscTriangleDown size={10} />

          </button>

          {showCreateMenu && (
            <div className="absolute top-17 left-0 max-w-[150px] bg-gray-200 shadow-lg rounded-md py-2 z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setCreateType("event");
                  setShowCreateMenu(false);
                }}
              >
                Event
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setCreateType("task");
                  setShowCreateMenu(false);
                }}
              >
                Task
              </button>
            </div>
          )}
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2 px-2">
            <span className="font-semibold text-gray-700">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <div className="flex gap-2">
              <button onClick={() => changeMonth(-1)} className="cursor-pointer transition-all  hover:bg-gray-400/75 rounded-full">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => changeMonth(1)} className="cursor-pointer rounded-full transition-all  hover:bg-gray-400/75">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-xs text-center text-gray-500 mb-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={`${d}-${i}`}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 text-sm text-center gap-y-1">
            {days.map((d, i) => {
              if (!d) return <div key={i}></div>;

              const isToday =
                d === today.getDate() &&
                currentMonth.getMonth() === today.getMonth() &&
                currentMonth.getFullYear() === today.getFullYear();

              const isSelected =
                d === currentDate.getDate() &&
                currentMonth.getMonth() === currentDate.getMonth() &&
                currentMonth.getFullYear() === currentDate.getFullYear();

              return (
                <div
                  key={i}
                  onClick={() => handleSelectDay(d)}
                  className={`py-1 rounded-full cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white font-semibold"
                      : isToday
                      ? "border border-blue-600 text-blue-600 font-semibold"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <button className="w-full bg-gray-100 rounded-lg py-2 flex items-center justify-center text-gray-600 hover:bg-gray-200">
            <i className="fa-solid fa-user-group mr-2"></i> Search for people
          </button>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center text-gray-700 font-medium mb-1">
            <span>Booking pages</span>
            <Plus size={16} />
          </div>
          <hr />
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center text-gray-700 font-medium mb-2">
            <span>My calendars</span>
            <span>˅</span>
          </div>
          <ul className="space-y-1 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="accent-blue-600" />
              <span>{user?.name || "My Calendar"}</span>
            </li>
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="accent-green-600"
              />
              <span>Birthdays</span>
            </li>
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="accent-blue-400"
              />
              <span>Tasks</span>
            </li>
          </ul>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center text-gray-700 font-medium mb-2">
            <span>Other calendars</span>
            <Plus size={16} />
          </div>
          <ul className="space-y-1 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="accent-green-700"
              />
              <span>Holidays in India</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          Terms – Privacy
        </div>
      </aside>

      {createType === "event" && (
        <EventModal onClose={() => setCreateType(null)} />
      )}
      {createType === "task" && (
        <TaskModal onClose={() => setCreateType(null)} />
      )}
    </>
  );
}




function EventModal({ onClose }) {
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    location: "",
    color: "#1E90FF",
    start: "",
    end: "",
    allDay: false,
    recurrence: { exdate: [] },
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        ...form,
        overrides: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await axiosInstance.post("/create-event", payload);

      console.log("✅ Event created:", res.data);
      alert("Event created successfully!");
      onClose();
    } catch (err) {
      console.error("❌ Error creating event:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">Add Event</h2>

        <div className="space-y-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Event title"
            className="w-full border p-2 rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded h-20"
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border p-2 rounded"
          />

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Color:</label>
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-10 h-8 border rounded"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="datetime-local"
              name="start"
              value={form.start}
              onChange={handleChange}
              className="w-1/2 border p-2 rounded"
            />
            <input
              type="datetime-local"
              name="end"
              value={form.end}
              onChange={handleChange}
              className="w-1/2 border p-2 rounded"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="allDay"
              checked={form.allDay}
              onChange={handleChange}
              className="accent-blue-600"
            />
            All-day event
          </label>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Excluded Dates (Recurrence):
            </label>
            <textarea
              value={form.recurrence.exdate.join(", ")}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  recurrence: {
                    ...prev.recurrence,
                    exdate: e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter((x) => x),
                  },
                }))
              }
              placeholder="YYYY-MM-DD, YYYY-MM-DD..."
              className="w-full border p-2 rounded text-sm"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleSave}
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 mt-4 rounded float-right ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}


function TaskModal({ onClose }) {
  const [form, setForm] = React.useState({
    title: "",
    dueDate: "",
    description: "",
    category: "My Tasks",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        ...form,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await axiosInstance.post("/create-task", payload);
      console.log("✅ Task created:", res.data);
      alert("Task created successfully!");
      onClose();
    } catch (err) {
      console.error("Error creating task:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white w-96 p-5 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Add Task</h2>

        <div className="space-y-3">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Add title"
            className="w-full border p-2 rounded"
          />

          <input
            type="datetime-local"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add description"
            className="w-full border p-2 rounded h-20"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>My Tasks</option>
            <option>Work</option>
            <option>Personal</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleSave}
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 mt-4 rounded float-right ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
