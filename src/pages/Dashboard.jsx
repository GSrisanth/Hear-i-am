import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useReminders } from "../hooks/useReminders";

export default function Dashboard() {
  const { user } = useAuth();

  const {
    reminders,
    loading,
  } = useReminders();

  const displayName =
  user?.user_metadata?.full_name || "Srisanth";

  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const todayReminders = reminders.filter(
    (reminder) =>
      reminder.reminder_date === todayString
  );

  const pendingReminders = reminders.filter(
    (reminder) => !reminder.completed
  );

  const completedReminders = reminders.filter(
    (reminder) => reminder.completed
  );

  const upcomingReminders = reminders
    .filter((reminder) => !reminder.completed)
    .sort((a, b) => {
      const first = `${a.reminder_date} ${a.reminder_time}`;
      const second = `${b.reminder_date} ${b.reminder_time}`;

      return first.localeCompare(second);
    })
    .slice(0, 5);

  const formatDate = (dateString) => {
    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString
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

  const getPriorityClasses = (priority) => {
    if (priority === "high") {
      return "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#FCA5A5]";
    }

    if (priority === "low") {
      return "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#86EFAC]";
    }

    return "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#FCD34D]";
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#F8FAFC]">
          Good evening, {displayName} 👋
        </h1>

        <p className="mt-2 text-[#94A3B8]">
          Here's what's happening with your personal
          assistant today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#111827] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#94A3B8]">
                Total Reminders
              </p>

              <p className="mt-2 text-3xl font-bold text-[#F8FAFC]">
                {loading ? "—" : reminders.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB]/15">
              <Bell
                size={21}
                className="text-[#60A5FA]"
              />
            </div>
          </div>
        </div>

        {/* Today */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#111827] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#94A3B8]">
                Today
              </p>

              <p className="mt-2 text-3xl font-bold text-[#F8FAFC]">
                {loading ? "—" : todayReminders.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F59E0B]/10">
              <CalendarDays
                size={21}
                className="text-[#F59E0B]"
              />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#111827] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#94A3B8]">
                Pending
              </p>

              <p className="mt-2 text-3xl font-bold text-[#F8FAFC]">
                {loading ? "—" : pendingReminders.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EF4444]/10">
              <Clock
                size={21}
                className="text-[#EF4444]"
              />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#111827] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#94A3B8]">
                Completed
              </p>

              <p className="mt-2 text-3xl font-bold text-[#F8FAFC]">
                {loading
                  ? "—"
                  : completedReminders.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22C55E]/10">
              <CheckCircle2
                size={21}
                className="text-[#22C55E]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Upcoming */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1E293B] bg-[#111827]">
          <div className="flex items-center justify-between border-b border-[#1E293B] px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-[#F8FAFC]">
                Upcoming Reminders
              </h2>

              <p className="mt-1 text-sm text-[#64748B]">
                Your next important tasks
              </p>
            </div>

            <Link
              to="/reminders"
              className="flex items-center gap-1 text-sm font-medium text-[#60A5FA] hover:text-[#93C5FD]"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1E293B] border-t-[#2563EB]" />
              </div>
            ) : upcomingReminders.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2563EB]/10">
                  <Bell
                    size={25}
                    className="text-[#60A5FA]"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-[#F8FAFC]">
                  No upcoming reminders
                </h3>

                <p className="mt-1 text-sm text-[#64748B]">
                  You're all caught up!
                </p>

                <Link
                  to="/reminders"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
                >
                  <Plus size={17} />
                  Create Reminder
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center gap-4 rounded-xl border border-[#1E293B] bg-[#0B1120] p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10">
                      <Bell
                        size={18}
                        className="text-[#60A5FA]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <h3 className="truncate font-medium text-[#F8FAFC]">
                          {reminder.title}
                        </h3>

                        <span
                          className={`w-fit rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${getPriorityClasses(
                            reminder.priority
                          )}`}
                        >
                          {reminder.priority}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-[#64748B]">
                        <span>
                          {formatDate(
                            reminder.reminder_date
                          )}
                        </span>

                        <span>
                          {formatTime(
                            reminder.reminder_time
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#111827]">
          <div className="border-b border-[#1E293B] px-6 py-5">
            <h2 className="text-lg font-semibold text-[#F8FAFC]">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-[#64748B]">
              Get things done quickly
            </p>
          </div>

          <div className="space-y-3 p-6">
            <Link
              to="/reminders"
              className="flex items-center gap-4 rounded-xl border border-[#1E293B] bg-[#0B1120] p-4 transition hover:border-[#2563EB]/50 hover:bg-[#2563EB]/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15">
                <Plus
                  size={19}
                  className="text-[#60A5FA]"
                />
              </div>

              <div>
                <p className="font-medium text-[#F8FAFC]">
                  Add Reminder
                </p>

                <p className="mt-0.5 text-xs text-[#64748B]">
                  Create a new task
                </p>
              </div>
            </Link>

            <Link
              to="/schedule"
              className="flex items-center gap-4 rounded-xl border border-[#1E293B] bg-[#0B1120] p-4 transition hover:border-[#2563EB]/50 hover:bg-[#2563EB]/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15">
                <CalendarDays
                  size={19}
                  className="text-[#60A5FA]"
                />
              </div>

              <div>
                <p className="font-medium text-[#F8FAFC]">
                  View Schedule
                </p>

                <p className="mt-0.5 text-xs text-[#64748B]">
                  See your upcoming tasks
                </p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-4 rounded-xl border border-[#1E293B] bg-[#0B1120] p-4 transition hover:border-[#2563EB]/50 hover:bg-[#2563EB]/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/15">
                <CheckCircle2
                  size={19}
                  className="text-[#60A5FA]"
                />
              </div>

              <div>
                <p className="font-medium text-[#F8FAFC]">
                  Update Profile
                </p>

                <p className="mt-0.5 text-xs text-[#64748B]">
                  Manage your information
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Today's Reminders */}
      <div className="mt-6 rounded-2xl border border-[#1E293B] bg-[#111827]">
        <div className="border-b border-[#1E293B] px-6 py-5">
          <h2 className="text-lg font-semibold text-[#F8FAFC]">
            Today's Reminders
          </h2>

          <p className="mt-1 text-sm text-[#64748B]">
            Tasks scheduled for today
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-sm text-[#64748B]">
              Loading...
            </p>
          ) : todayReminders.length === 0 ? (
            <div className="py-6 text-center">
              <CheckCircle2
                size={28}
                className="mx-auto text-[#22C55E]"
              />

              <p className="mt-3 text-sm text-[#94A3B8]">
                No reminders scheduled for today.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {todayReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="rounded-xl border border-[#1E293B] bg-[#0B1120] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3
                        className={`font-medium ${
                          reminder.completed
                            ? "text-[#64748B] line-through"
                            : "text-[#F8FAFC]"
                        }`}
                      >
                        {reminder.title}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-xs text-[#64748B]">
                        <Clock size={14} />
                        {formatTime(
                          reminder.reminder_time
                        )}
                      </div>
                    </div>

                    {reminder.completed && (
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-[#22C55E]"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}