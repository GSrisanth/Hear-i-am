import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Bell,
  CheckCircle2,
} from "lucide-react";

import { useReminders } from "../hooks/useReminders";

export default function Schedule() {
  const { reminders, loading } = useReminders();

  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const today = new Date();

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const getDateString = (day) => {
    return [
      year,
      String(month + 1).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");
  };

  const remindersByDate = useMemo(() => {
    const grouped = {};

    reminders.forEach((reminder) => {
      const date = reminder.reminder_date;

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(reminder);
    });

    return grouped;
  }, [reminders]);

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time
      .split(":")
      .map(Number);

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  const upcomingReminders = [...reminders]
    .filter(
      (reminder) =>
        !reminder.completed
    )
    .sort((a, b) => {
      const first =
        `${a.reminder_date} ${
          a.reminder_time || ""
        }`;

      const second =
        `${b.reminder_date} ${
          b.reminder_time || ""
        }`;

      return first.localeCompare(second);
    });

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(day);
  }

  return (
    <div className="mx-auto max-w-7xl">

      {/* ================= HEADER ================= */}

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm">
            <CalendarDays
              size={25}
            />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#172554]">
              Schedule
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View your reminders and upcoming tasks
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm backdrop-blur-xl">
          {loading
            ? "Loading..."
            : `${reminders.length} reminder${
                reminders.length === 1
                  ? ""
                  : "s"
              }`}
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ================= CALENDAR ================= */}

        <div className="lg:col-span-2 overflow-hidden rounded-3xl border border-indigo-100 bg-white/65 shadow-[0_20px_55px_rgba(79,70,229,0.08)] backdrop-blur-xl">

          {/* Calendar Header */}

          <div className="flex items-center justify-between border-b border-indigo-100/80 px-5 py-5 sm:px-6">

            <button
              type="button"
              onClick={previousMonth}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-white/70 text-slate-500 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
              aria-label="Previous month"
            >
              <ChevronLeft
                size={20}
              />
            </button>

            <h2 className="text-lg font-bold text-[#172554]">
              {monthName}
            </h2>

            <button
              type="button"
              onClick={nextMonth}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-white/70 text-slate-500 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
              aria-label="Next month"
            >
              <ChevronRight
                size={20}
              />
            </button>

          </div>

          {/* ================= WEEKDAYS ================= */}

          <div className="grid grid-cols-7 border-b border-indigo-100 bg-indigo-50/35">

            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-bold text-slate-500"
              >
                {day}
              </div>
            ))}

          </div>

          {/* ================= CALENDAR ================= */}

          <div className="grid grid-cols-7 bg-white/35">

            {calendarDays.map(
              (day, index) => {

                /* EMPTY CELL */

                if (!day) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="min-h-[105px] border-b border-r border-indigo-100/70 bg-white/20"
                    />
                  );
                }

                const dateString =
                  getDateString(day);

                const dayReminders =
                  remindersByDate[
                    dateString
                  ] || [];

                const todayCell =
                  isToday(day);

                return (
                  <div
                    key={day}
                    className={`
                      group
                      min-h-[105px]
                      border-b
                      border-r
                      border-indigo-100/70
                      p-2
                      transition-all
                      duration-200
                      ${
                        todayCell
                          ? "bg-indigo-50/70"
                          : "bg-white/30"
                      }
                      hover:bg-indigo-50/60
                    `}
                  >

                    {/* ================= DATE ================= */}

                    <div className="flex items-center justify-between">

                      <span
                        className={`
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          text-sm
                          transition-all
                          ${
                            todayCell
                              ? "bg-gradient-to-br from-blue-500 to-indigo-600 font-black text-white shadow-md shadow-indigo-200"
                              : "font-medium text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700"
                          }
                        `}
                      >
                        {day}
                      </span>

                      {dayReminders.length >
                        0 && (
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-500">
                          {
                            dayReminders.length
                          }
                        </span>
                      )}

                    </div>

                    {/* ================= REMINDERS ================= */}

                    <div className="mt-2 space-y-1">

                      {dayReminders
                        .slice(0, 2)
                        .map(
                          (reminder) => (
                            <div
                              key={
                                reminder.id
                              }
                              className={`
                                truncate
                                rounded-lg
                                border
                                px-2
                                py-1.5
                                text-[10px]
                                font-semibold
                                ${
                                  reminder.completed
                                    ? "border-emerald-100 bg-emerald-50 text-emerald-600 line-through"
                                    : "border-blue-100 bg-blue-50 text-blue-600"
                                }
                              `}
                              title={
                                reminder.title
                              }
                            >
                              {
                                reminder.title
                              }
                            </div>
                          )
                        )}

                      {dayReminders.length >
                        2 && (
                        <p className="px-1 text-[10px] font-semibold text-slate-400">
                          +
                          {dayReminders.length -
                            2}{" "}
                          more
                        </p>
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>
        </div>

        {/* ================= UPCOMING ================= */}

        <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-white/65 shadow-[0_20px_55px_rgba(79,70,229,0.08)] backdrop-blur-xl">

          <div className="border-b border-indigo-100/80 px-6 py-5">

            <h2 className="text-lg font-bold text-[#172554]">
              Upcoming
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your pending reminders
            </p>

          </div>

          <div className="max-h-[600px] overflow-y-auto p-5">

            {loading ? (
              <div className="flex justify-center py-12">

                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500" />

              </div>
            ) : upcomingReminders.length ===
              0 ? (

              <div className="py-12 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">

                  <CheckCircle2
                    size={30}
                  />

                </div>

                <h3 className="mt-4 font-bold text-[#172554]">
                  Nothing upcoming
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  You're all caught up!
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {upcomingReminders.map(
                  (reminder) => (

                    <div
                      key={
                        reminder.id
                      }
                      className="rounded-2xl border border-indigo-100 bg-white/70 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-md"
                    >

                      <div className="flex gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">

                          <Bell
                            size={17}
                          />

                        </div>

                        <div className="min-w-0 flex-1">

                          <h3 className="truncate font-bold text-[#172554]">
                            {
                              reminder.title
                            }
                          </h3>

                          {reminder.description && (
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                              {
                                reminder.description
                              }
                            </p>
                          )}

                          <div className="mt-3 space-y-1.5">

                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

                              <CalendarDays
                                size={13}
                                className="text-indigo-500"
                              />

                              {new Date(
                                `${reminder.reminder_date}T00:00:00`
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}

                            </div>

                            {reminder.reminder_time && (
                              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

                                <Clock
                                  size={13}
                                  className="text-indigo-500"
                                />

                                {formatTime(
                                  reminder.reminder_time
                                )}

                              </div>
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </div>
    </div>
  );
}