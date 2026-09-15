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

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

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

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const upcomingReminders = [...reminders]
    .filter((reminder) => !reminder.completed)
    .sort((a, b) => {
      const first =
        `${a.reminder_date} ${a.reminder_time || ""}`;

      const second =
        `${b.reminder_date} ${b.reminder_time || ""}`;

      return first.localeCompare(second);
    });

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/15">
            <CalendarDays
              size={25}
              className="text-[#60A5FA]"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#F8FAFC]">
              Schedule
            </h1>

            <p className="mt-1 text-[#94A3B8]">
              View your reminders and upcoming tasks
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-[#1E293B] bg-[#111827] px-4 py-2 text-sm text-[#94A3B8]">
          {loading
            ? "Loading..."
            : `${reminders.length} reminder${
                reminders.length === 1 ? "" : "s"
              }`}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Calendar */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1E293B] bg-[#111827]">

          {/* Calendar Header */}
          <div className="flex items-center justify-between border-b border-[#1E293B] px-6 py-5">

            <button
              type="button"
              onClick={previousMonth}
              className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#1E293B] hover:text-[#F8FAFC]"
            >
              <ChevronLeft size={20} />
            </button>

            <h2 className="text-lg font-semibold text-[#F8FAFC]">
              {monthName}
            </h2>

            <button
              type="button"
              onClick={nextMonth}
              className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#1E293B] hover:text-[#F8FAFC]"
            >
              <ChevronRight size={20} />
            </button>

          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 border-b border-[#1E293B]">
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
                className="py-3 text-center text-xs font-medium text-[#64748B]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div className="grid grid-cols-7">

            {calendarDays.map((day, index) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[105px] border-b border-r border-[#1E293B]/70"
                  />
                );
              }

              const dateString =
                getDateString(day);

              const dayReminders =
                remindersByDate[dateString] || [];

              return (
                <div
                  key={day}
                  className={`min-h-[105px] border-b border-r border-[#1E293B]/70 p-2 transition hover:bg-[#0B1120] ${
                    isToday(day)
                      ? "bg-[#2563EB]/5"
                      : ""
                  }`}
                >

                  {/* Date */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                        isToday(day)
                          ? "bg-[#2563EB] font-bold text-white"
                          : "text-[#94A3B8]"
                      }`}
                    >
                      {day}
                    </span>

                    {dayReminders.length > 0 && (
                      <span className="text-[10px] text-[#60A5FA]">
                        {dayReminders.length}
                      </span>
                    )}
                  </div>

                  {/* Reminders */}
                  <div className="mt-2 space-y-1">
                    {dayReminders
                      .slice(0, 2)
                      .map((reminder) => (
                        <div
                          key={reminder.id}
                          className={`truncate rounded-md px-2 py-1 text-[10px] ${
                            reminder.completed
                              ? "bg-[#22C55E]/10 text-[#86EFAC] line-through"
                              : "bg-[#2563EB]/15 text-[#60A5FA]"
                          }`}
                          title={reminder.title}
                        >
                          {reminder.title}
                        </div>
                      ))}

                    {dayReminders.length > 2 && (
                      <p className="px-1 text-[10px] text-[#64748B]">
                        +{dayReminders.length - 2} more
                      </p>
                    )}
                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* Upcoming */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#111827]">

          <div className="border-b border-[#1E293B] px-6 py-5">
            <h2 className="text-lg font-semibold text-[#F8FAFC]">
              Upcoming
            </h2>

            <p className="mt-1 text-sm text-[#64748B]">
              Your pending reminders
            </p>
          </div>

          <div className="max-h-[600px] overflow-y-auto p-5">

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1E293B] border-t-[#2563EB]" />
              </div>
            ) : upcomingReminders.length === 0 ? (
              <div className="py-12 text-center">

                <CheckCircle2
                  size={32}
                  className="mx-auto text-[#22C55E]"
                />

                <h3 className="mt-4 font-medium text-[#F8FAFC]">
                  Nothing upcoming
                </h3>

                <p className="mt-1 text-sm text-[#64748B]">
                  You're all caught up!
                </p>

              </div>
            ) : (
              <div className="space-y-3">

                {upcomingReminders.map(
                  (reminder) => (
                    <div
                      key={reminder.id}
                      className="rounded-xl border border-[#1E293B] bg-[#0B1120] p-4"
                    >

                      <div className="flex gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10">
                          <Bell
                            size={17}
                            className="text-[#60A5FA]"
                          />
                        </div>

                        <div className="min-w-0 flex-1">

                          <h3 className="truncate font-medium text-[#F8FAFC]">
                            {reminder.title}
                          </h3>

                          {reminder.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-[#64748B]">
                              {reminder.description}
                            </p>
                          )}

                          <div className="mt-3 space-y-1">

                            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                              <CalendarDays size={13} />
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
                              <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                                <Clock size={13} />
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