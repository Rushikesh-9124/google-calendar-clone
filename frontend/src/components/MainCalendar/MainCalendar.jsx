import React, { useEffect, useState } from "react";
import axiosInstance from "../../helper/axiosInstance";

export default function MainCalendar({ currentDate, currentView }) {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);

  // modal / selected event state
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState("");

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayName = currentDate.toLocaleDateString("en-US", { weekday: "short" });
  const dayNumber = currentDate.getDate();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });
  const year = currentDate.getFullYear();

  const fetchAll = async () => {
    try {
      const [eventRes, taskRes] = await Promise.all([
        axiosInstance.get("/get-events"),
        axiosInstance.get("/get-tasks"),
      ]);
      setEvents(eventRes.data || []);
      setTasks(taskRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getStartOfWeek = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return start;
  };
  const getDays = (date, daysCount) =>
    Array.from({ length: daysCount }, (_, i) => {
      const d = new Date(date);
      d.setDate(d.getDate() + i);
      return d;
    });
  const getWeekDays = (date) => getDays(getStartOfWeek(date), 7);

  const filterByDate = (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dayEvents = events.filter(
      (e) => new Date(e.start) <= endOfDay && new Date(e.end) >= startOfDay
    );

    const dayTasks = tasks.filter(
      (t) =>
        new Date(t.dueDate) >= startOfDay && new Date(t.dueDate) <= endOfDay
    );

    return { dayEvents, dayTasks };
  };

  useEffect(() => {
    if (!selectedEventId) {
      setEventDetails(null);
      setEventLoading(false);
      setEventError("");
      return;
    }

    const fetchEventById = async (id) => {
      setEventLoading(true);
      setEventError("");
      try {
        try {
          const res = await axiosInstance.get(`/get-event/${id}`);
          setEventDetails(res.data);
        } catch (err) {
          const found = events.find((ev) => String(ev._id) === String(id));
          if (found) setEventDetails(found);
          else throw err;
        }
      } catch (err) {
        console.error("Error fetching event by id:", err);
        setEventError("Failed to load event details.");
      } finally {
        setEventLoading(false);
      }
    };

    fetchEventById(selectedEventId);
  }, [selectedEventId, events]);

  const handleUpdateEvent = async (updated) => {
    try {
      await axiosInstance.put(`/update-event/${updated._id}`, updated);
      await fetchAll();
      setSelectedEventId(null);
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axiosInstance.delete(`/delete-event/${id}`);
      await fetchAll();
      setSelectedEventId(null);
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const renderDayView = () => {
    const { dayEvents, dayTasks } = filterByDate(currentDate);
    return (
      <div className="flex-1 rounded-4xl overflow-y-auto bg-white">
        <div className="flex items-center px-6 py-3 ">
          <div className="flex flex-col items-center justify-center gap-1 ml-5  rounded-full  text-white">
            <span className="text-sm text-blue-600">{dayName}</span>
            <span className="text-lg font-bold bg-blue-600 w-10 h-10 flex items-center justify-center rounded-full">
              {dayNumber}
            </span>
          </div>
        </div>

        <div className="px-8 relative">
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex items-center border-t h-12 text-black text-xs relative"
            >
              <div className="w-16 text-right pr-3">
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? "12 PM"
                  : `${hour - 12} PM`}
              </div>
              <div className="flex-1 border-l h-full relative"></div>
            </div>
          ))}

          {dayEvents.map((e, i) => (
            <div
              key={`event-${i}`}
              onClick={() => setSelectedEventId(e._id)}
              className={`absolute left-24 right-4  border-l-4 border-blue-600 text-sm px-2 py-1 rounded shadow cursor-pointer hover:bg-blue-200 transition `}
              style={{
                top: `${(new Date(e.start).getHours() / 24) * 100}%`,backgroundColor: e.color,
              }}
            >
              <strong>{e.title}</strong>
              <div className="text-xs text-gray-600">
                {new Date(e.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(e.end).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}

          {dayTasks.map((t, i) => (
            <div
              key={`task-${i}`}
              onClick={() => setSelectedTaskId(t._id)}
              className="absolute flex flex-col  left-24 right-4 bg-green-100 border-l-4 border-green-600 text-sm px-2 py-0.5 rounded shadow"
              style={{
                top: `${(new Date(t.dueDate).getHours() / 24) * 100}%`,
              }}
            >
              <p className="font-bold text-md">{t.title}</p>
              <span>
                {new Date(t.dueDate).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMultiDayView = (daysCount) => {
    const daysArray =
      daysCount === 7
        ? getWeekDays(currentDate)
        : getDays(currentDate, daysCount);

    return (
      <div className="flex-1 rounded-4xl bg-white  overflow-y-auto">
        <div
          className="grid border-b  text-center"
          style={{ gridTemplateColumns: `repeat(${daysArray.length}, 1fr)` }}
        >
          {daysArray.map((d, idx) => (
            <div key={idx} className="py-5 space-y-1 text-sm">
              <p className="font-light">{d.toLocaleDateString("en-US", { weekday: "short" })}{" "}</p>
              <p className="font-blod text-lg md:text-2xl">{d.getDate()}</p>
            </div>
          ))}
        </div>

        <div
          className="grid divide-x relative"
          style={{ gridTemplateColumns: `repeat(${daysArray.length}, 1fr)` }}
        >
          {daysArray.map((d, idx) => {
            const { dayEvents, dayTasks } = filterByDate(d);
            return (
              <div key={idx} className="relative border-l">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="border-t h-12 text-gray-400 text-xs flex items-center justify-center"
                  >
                    {hour === 0
                      ? "12 AM"
                      : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                      ? "12 PM"
                      : `${hour - 12} PM`}
                  </div>
                ))}

                {dayEvents.map((e, i) => (
                  <div
                    key={`event-${i}`}
                    onClick={() => setSelectedEventId(e._id)}
                    className="absolute left-1 right-1 bg-blue-200 text-blue-900 text-xs px-2 py-1 rounded cursor-pointer"
                    style={{
                      top: `${(new Date(e.start).getHours() / 24) * 100}%`, backgroundColor: e.color
                    }}
                  >
                    {e.title}
                  </div>
                ))}

                {dayTasks.map((t, i) => (
                  <div
                    key={`task-${i}`}
                    className="absolute left-1 right-1 bg-green-200 text-green-900 text-xs px-2 py-1 rounded"
                    style={{
                      top: `${(new Date(t.dueDate).getHours() / 24) * 100}%`,
                    }}
                  >
                    ✅ {t.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const firstDay = new Date(year, currentDate.getMonth(), 1);
    const startDay = firstDay.getDay();
    const totalDays = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: startDay + totalDays }, (_, i) =>
      i >= startDay ? i - startDay + 1 : null
    );

    return (
      <div className="flex-1 bg-white rounded-4xl overflow-y-auto">
        <h2 className="text-center text-xl font-semibold py-3 border-b">
          {monthName} {year}
        </h2>

        <div className="grid grid-cols-7 text-center font-medium border-b">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2 text-gray-500">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 text-center">
          {days.map((d, i) => {
            if (!d) return <div key={i} className="h-20 border p-1"></div>;
            const dateObj = new Date(year, currentDate.getMonth(), d);
            const { dayEvents, dayTasks } = filterByDate(dateObj);

            return (
              <div
                key={i}
                className={`h-20 border p-1 text-left text-xs ${
                  d === dayNumber ? "bg-blue-100 font-bold" : ""
                }`}
              >
                <div className="text-right text-gray-600 text-sm">{d}</div>

                {dayEvents.slice(0, 2).map((e, idx) => (
                  <div
                    key={`event-${idx}`}
                    onClick={() => setSelectedEventId(e._id)}
                    style={{
                      backgroundColor: e.color
                    }}
                    className="truncate bg-blue-100 text-blue-900 rounded px-1 mt-1 cursor-pointer"
                  >
                    {e.title}
                  </div>
                ))}

                {dayTasks.slice(0, 2).map((t, idx) => (
                  <div
                    key={`task-${idx}`}
                    className="truncate bg-green-100 text-green-900 rounded px-1 mt-1"
                  >
                    ✅ {t.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return (
      <div className="flex-1 bg-white rounded-4xl overflow-y-auto p-6">
        <h2 className="text-center text-2xl font-semibold mb-4">{year}</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
          {months.map((m) => {
            const daysInMonth = new Date(year, m + 1, 0).getDate();
            const startDay = new Date(year, m, 1).getDay();
            const days = Array.from(
              { length: startDay + daysInMonth },
              (_, i) => (i >= startDay ? i - startDay + 1 : null)
            );
            return (
              <div
                key={m}
                className="border rounded-lg p-3 shadow-sm bg-gray-50"
              >
                <h3 className="text-center font-medium mb-2">
                  {new Date(year, m).toLocaleString("en-US", {
                    month: "short",
                  })}
                </h3>
                <div className="grid grid-cols-7 text-center text-[11px] gap-y-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d} className="text-gray-400">
                      {d}
                    </div>
                  ))}
                  {days.map((d, i) => (
                    <div
                      key={i}
                      className={`h-6 flex items-center justify-center text-gray-700 ${
                        d === dayNumber && m === currentDate.getMonth()
                          ? "bg-blue-200 rounded-full font-semibold"
                          : ""
                      }`}
                    >
                      {d || ""}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  function EventModalInline({ eventId, onClose }) {
    const [evt, setEvt] = useState(null);
    const [loadingEvt, setLoadingEvt] = useState(true);
    const [errEvt, setErrEvt] = useState("");

    useEffect(() => {
      if (!eventId) return;
      const load = async () => {
        setLoadingEvt(true);
        setErrEvt("");
        try {
          try {
            const res = await axiosInstance.get(`/get-event/${eventId}`);
            setEvt(res.data);
          } catch (e) {
            // fallback to local cache
            const local = events.find((x) => String(x._id) === String(eventId));
            if (local) setEvt(local);
            else throw e;
          }
        } catch (e) {
          console.error("Failed to load event:", e);
          setErrEvt("Failed to load event data.");
        } finally {
          setLoadingEvt(false);
        }
      };
      load();
    }, [eventId, events]);

    const handleChangeLocal = (field, value) =>
      setEvt((p) => ({ ...p, [field]: value }));

    const handleSaveLocal = async () => {
      try {
        await axiosInstance.put(`/update-event/${evt._id}`, evt);
        await fetchAll();
        onClose();
      } catch (e) {
        console.error(e);
        alert("Update failed");
      }
    };

    const handleDeleteLocal = async () => {
      if (!window.confirm("Delete this event?")) return;
      try {
        await axiosInstance.delete(`/delete-event/${evt._id}`);
        await fetchAll();
        onClose();
      } catch (e) {
        console.error(e);
        alert("Delete failed");
      }
    };

    if (loadingEvt)
      return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded">Loading...</div>
        </div>
      );
    if (errEvt || !evt) return null;

    return (
      <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
        <div className="bg-white w-96 p-5 rounded-lg shadow-lg relative">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-500 hover:text-black"
          >
            ✕
          </button>
          <h2 className="text-lg font-semibold mb-3">Edit Event</h2>

          <div className="space-y-3">
            <input
              value={evt.title || ""}
              onChange={(e) => handleChangeLocal("title", e.target.value)}
              className="w-full border p-2 rounded"
            />
            <textarea
              value={evt.description || ""}
              onChange={(e) => handleChangeLocal("description", e.target.value)}
              className="w-full border p-2 rounded h-20"
            />
            <label className="text-sm text-gray-600">Start</label>
            <input
              type="datetime-local"
              value={
                evt.start ? new Date(evt.start).toISOString().slice(0, 16) : ""
              }
              onChange={(e) =>
                handleChangeLocal(
                  "start",
                  new Date(e.target.value).toISOString()
                )
              }
              className="w-full border p-2 rounded"
            />
            <label className="text-sm text-gray-600">End</label>
            <input
              type="datetime-local"
              value={
                evt.end ? new Date(evt.end).toISOString().slice(0, 16) : ""
              }
              onChange={(e) =>
                handleChangeLocal("end", new Date(e.target.value).toISOString())
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={handleDeleteLocal}
              className="bg-red-500 text-white px-3 py-2 rounded"
            >
              Delete
            </button>
            <button
              onClick={handleSaveLocal}
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  function TaskModalInline({ taskId, onClose }) {
    const [tsk, setTsk] = useState(null);
    const [loadingTsk, setLoadingTsk] = useState(true);
    const [errTsk, setErrTsk] = useState("");

    useEffect(() => {
      if (!taskId) return;
      const load = async () => {
        setLoadingTsk(true);
        setErrTsk("");
        try {
          // try single-task endpoint
          try {
            const res = await axiosInstance.get(`/get-task/${taskId}`);
            setTsk(res.data);
          } catch (e) {
            const local = tasks.find((x) => String(x._id) === String(taskId));
            if (local) setTsk(local);
            else throw e;
          }
        } catch (e) {
          console.error("Failed to load task:", e);
          setErrTsk("Failed to load task data.");
        } finally {
          setLoadingTsk(false);
        }
      };
      load();
    }, [taskId, tasks]);

    const handleChangeLocal = (field, value) =>
      setTsk((p) => ({ ...p, [field]: value }));

    const handleSaveLocal = async () => {
      try {
        await axiosInstance.put(`/update-task/${tsk._id}`, tsk);
        await fetchAll();
        onClose();
      } catch (e) {
        console.error(e);
        alert("Update failed");
      }
    };

    const handleDeleteLocal = async () => {
      if (!window.confirm("Delete this task?")) return;
      try {
        await axiosInstance.delete(`/delete-task/${tsk._id}`);
        await fetchAll();
        onClose();
      } catch (e) {
        console.error(e);
        alert("Delete failed");
      }
    };

    if (loadingTsk)
      return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded">Loading...</div>
        </div>
      );
    if (errTsk || !tsk) return null;

    return (
      <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
        <div className="bg-white w-96 p-5 rounded-lg shadow-lg relative">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-500 hover:text-black"
          >
            ✕
          </button>
          <h2 className="text-lg font-semibold mb-3">Edit Task</h2>

          <div className="space-y-3">
            <input
              value={tsk.title || ""}
              onChange={(e) => handleChangeLocal("title", e.target.value)}
              className="w-full border p-2 rounded"
            />
            <textarea
              value={tsk.description || ""}
              onChange={(e) => handleChangeLocal("description", e.target.value)}
              className="w-full border p-2 rounded h-20"
            />
            <label className="text-sm text-gray-600">Due Date</label>
            <input
              type="datetime-local"
              value={
                tsk.dueDate
                  ? new Date(tsk.dueDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                handleChangeLocal(
                  "dueDate",
                  new Date(e.target.value).toISOString()
                )
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={handleDeleteLocal}
              className="bg-red-500 text-white px-3 py-2 rounded"
            >
              Delete
            </button>
            <button
              onClick={handleSaveLocal}
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  switch (currentView) {
    case "Day":
      return (
        <>
          {renderDayView()}
          {selectedEventId && (
            <EventModalInline
              eventId={selectedEventId}
              onClose={() => setSelectedEventId(null)}
            />
          )}
          {selectedTaskId && (
            <TaskModalInline
              taskId={selectedTaskId}
              onClose={() => setSelectedTaskId(null)}
            />
          )}
        </>
      );
    case "4 Days":
      return (
        <>
          {renderMultiDayView(4)}
          {selectedEventId && (
            <EventModalInline
              eventId={selectedEventId}
              onClose={() => setSelectedEventId(null)}
            />
          )}
          {selectedTaskId && (
            <TaskModalInline
              taskId={selectedTaskId}
              onClose={() => setSelectedTaskId(null)}
            />
          )}
        </>
      );
    case "Week":
      return (
        <>
          {renderMultiDayView(7)}
          {selectedEventId && (
            <EventModalInline
              eventId={selectedEventId}
              onClose={() => setSelectedEventId(null)}
            />
          )}
          {selectedTaskId && (
            <TaskModalInline
              taskId={selectedTaskId}
              onClose={() => setSelectedTaskId(null)}
            />
          )}
        </>
      );
    case "Month":
      return (
        <>
          {renderMonthView()}
          {selectedEventId && (
            <EventModalInline
              eventId={selectedEventId}
              onClose={() => setSelectedEventId(null)}
            />
          )}
          {selectedTaskId && (
            <TaskModalInline
              taskId={selectedTaskId}
              onClose={() => setSelectedTaskId(null)}
            />
          )}
        </>
      );
    case "Year":
      return (
        <>
          {renderYearView()}
          {selectedEventId && (
            <EventModalInline
              eventId={selectedEventId}
              onClose={() => setSelectedEventId(null)}
            />
          )}
          {selectedTaskId && (
            <TaskModalInline
              taskId={selectedTaskId}
              onClose={() => setSelectedTaskId(null)}
            />
          )}
        </>
      );
    default:
      return (
        <div className="">
          {renderDayView()}
          {selectedEventId && (
            <EventModalInline
              eventId={selectedEventId}
              onClose={() => setSelectedEventId(null)}
            />
          )}
          {selectedTaskId && (
            <TaskModalInline
              taskId={selectedTaskId}
              onClose={() => setSelectedTaskId(null)}
            />
          )}
        </div>
      );
  }
}
