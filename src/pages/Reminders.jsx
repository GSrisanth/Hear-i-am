import { useEffect, useState } from "react";
import {
  Plus,
  Bell,
  CalendarDays,
  Clock,
  Check,
  Pencil,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import {
  getUserReminders,
  createReminder,
  updateReminder,
  toggleReminder,
  deleteReminder,
} from "../services/reminderService";

const emptyForm = {
  title: "",
  description: "",
  reminder_date: "",
  reminder_time: "",
};

function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(
    `${dateString}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timeString) {
  if (!timeString) return "";

  const [hours, minutes] = timeString.split(":");

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function isPast(reminder) {
  if (reminder.completed) return false;

  const reminderDateTime = new Date(
    `${reminder.reminder_date}T${reminder.reminder_time}`
  );

  return reminderDateTime < new Date();
}

export default function Reminders() {
  const { user } = useAuth();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] =
    useState(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadReminders = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const data = await getUserReminders(user.id);

      setReminders(data);
    } catch (error) {
      console.error("Error loading reminders:", error);
      toast.error(
        error.message || "Failed to load reminders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, [user?.id]);

  const openCreateModal = () => {
    setEditingReminder(null);

    setForm({
      ...emptyForm,
      reminder_date: new Date()
        .toISOString()
        .split("T")[0],
    });

    setShowModal(true);
  };

  const openEditModal = (reminder) => {
    setEditingReminder(reminder);

    setForm({
      title: reminder.title || "",
      description: reminder.description || "",
      reminder_date: reminder.reminder_date || "",
      reminder_time:
        reminder.reminder_time?.slice(0, 5) || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingReminder(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter a reminder title.");
      return;
    }

    if (!form.reminder_date) {
      toast.error("Please select a date.");
      return;
    }

    if (!form.reminder_time) {
      toast.error("Please select a time.");
      return;
    }

    try {
      setSaving(true);

      if (editingReminder) {
        await updateReminder(
          editingReminder.id,
          form
        );

        toast.success(
          "Reminder updated successfully."
        );
      } else {
        await createReminder(user.id, form);

        toast.success(
          "Reminder created successfully."
        );
      }

      closeModal();

      await loadReminders();
    } catch (error) {
      console.error("Reminder error:", error);

      toast.error(
        error.message || "Failed to save reminder."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (reminder) => {
    try {
      await toggleReminder(
        reminder.id,
        !reminder.completed
      );

      setReminders((previous) =>
        previous.map((item) =>
          item.id === reminder.id
            ? {
                ...item,
                completed: !item.completed,
              }
            : item
        )
      );

      toast.success(
        reminder.completed
          ? "Reminder marked as pending."
          : "Reminder completed!"
      );
    } catch (error) {
      console.error("Toggle error:", error);

      toast.error(
        error.message || "Failed to update reminder."
      );
    }
  };

  const handleDelete = async (reminder) => {
    const confirmed = window.confirm(
      `Delete "${reminder.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(reminder.id);

      await deleteReminder(reminder.id);

      setReminders((previous) =>
        previous.filter(
          (item) => item.id !== reminder.id
        )
      );

      toast.success("Reminder deleted.");
    } catch (error) {
      console.error("Delete error:", error);

      toast.error(
        error.message || "Failed to delete reminder."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const pendingReminders = reminders.filter(
    (reminder) => !reminder.completed
  );

  const completedReminders = reminders.filter(
    (reminder) => reminder.completed
  );

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">
            Reminders
          </h1>

          <p className="mt-1 text-sm text-[#94A3B8]">
            Keep track of your tasks and important events.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 font-semibold text-white transition hover:bg-[#1D4ED8]"
        >
          <Plus size={18} />
          New Reminder
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#1E293B] bg-[#111827] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#94A3B8]">
              Total
            </span>

            <Bell
              size={20}
              className="text-[#60A5FA]"
            />
          </div>

          <p className="mt-3 text-2xl font-bold text-[#F8FAFC]">
            {reminders.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#1E293B] bg-[#111827] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#94A3B8]">
              Pending
            </span>

            <Clock
              size={20}
              className="text-[#F59E0B]"
            />
          </div>

          <p className="mt-3 text-2xl font-bold text-[#F8FAFC]">
            {pendingReminders.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#1E293B] bg-[#111827] p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#94A3B8]">
              Completed
            </span>

            <Check
              size={20}
              className="text-[#22C55E]"
            />
          </div>

          <p className="mt-3 text-2xl font-bold text-[#F8FAFC]">
            {completedReminders.length}
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#1E293B] bg-[#111827]">
          <div className="text-center">
            <Loader2
              size={32}
              className="mx-auto animate-spin text-[#60A5FA]"
            />

            <p className="mt-3 text-sm text-[#94A3B8]">
              Loading reminders...
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && reminders.length === 0 && (
        <div className="rounded-2xl border border-[#1E293B] bg-[#111827] px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#60A5FA]">
            <Bell size={30} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-[#F8FAFC]">
            No reminders yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-[#94A3B8]">
            Create your first reminder to keep track of
            important tasks and events.
          </p>

          <button
            onClick={openCreateModal}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            <Plus size={18} />
            Create Reminder
          </button>
        </div>
      )}

      {/* Reminder List */}
      {!loading && reminders.length > 0 && (
        <div className="space-y-8">
          {/* Pending */}
          {pendingReminders.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-[#F8FAFC]">
                Upcoming Reminders
              </h2>

              <div className="space-y-3">
                {pendingReminders.map((reminder) => {
                  const overdue = isPast(reminder);

                  return (
                    <div
                      key={reminder.id}
                      className={`rounded-xl border bg-[#111827] p-5 transition ${
                        overdue
                          ? "border-[#EF4444]/40"
                          : "border-[#1E293B] hover:border-[#2563EB]/50"
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          <button
                            onClick={() =>
                              handleToggle(reminder)
                            }
                            title="Mark complete"
                            className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#475569] text-transparent transition hover:border-[#22C55E] hover:bg-[#22C55E]/10"
                          >
                            <Check size={14} />
                          </button>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-[#F8FAFC]">
                              {reminder.title}
                            </h3>

                            {reminder.description && (
                              <p className="mt-1 text-sm text-[#94A3B8]">
                                {reminder.description}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                              <span
                                className={`inline-flex items-center gap-1.5 ${
                                  overdue
                                    ? "text-[#F87171]"
                                    : "text-[#94A3B8]"
                                }`}
                              >
                                <CalendarDays
                                  size={14}
                                />
                                {formatDate(
                                  reminder.reminder_date
                                )}
                              </span>

                              <span className="inline-flex items-center gap-1.5 text-[#94A3B8]">
                                <Clock size={14} />
                                {formatTime(
                                  reminder.reminder_time
                                )}
                              </span>

                              {overdue && (
                                <span className="rounded-full bg-[#EF4444]/10 px-2 py-1 font-medium text-[#F87171]">
                                  Overdue
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:shrink-0">
                          <button
                            onClick={() =>
                              openEditModal(reminder)
                            }
                            title="Edit reminder"
                            className="rounded-lg border border-[#1E293B] p-2 text-[#94A3B8] transition hover:border-[#2563EB] hover:bg-[#2563EB]/10 hover:text-[#60A5FA]"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(reminder)
                            }
                            disabled={
                              deletingId === reminder.id
                            }
                            title="Delete reminder"
                            className="rounded-lg border border-[#1E293B] p-2 text-[#94A3B8] transition hover:border-[#EF4444]/40 hover:bg-[#EF4444]/10 hover:text-[#F87171] disabled:opacity-50"
                          >
                            {deletingId === reminder.id ? (
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Completed */}
          {completedReminders.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-[#F8FAFC]">
                Completed
              </h2>

              <div className="space-y-3">
                {completedReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="rounded-xl border border-[#1E293B] bg-[#111827] p-5 opacity-75"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <button
                          onClick={() =>
                            handleToggle(reminder)
                          }
                          title="Mark as pending"
                          className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white"
                        >
                          <Check size={14} />
                        </button>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-[#94A3B8] line-through">
                            {reminder.title}
                          </h3>

                          {reminder.description && (
                            <p className="mt-1 text-sm text-[#64748B]">
                              {reminder.description}
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays
                                size={14}
                              />
                              {formatDate(
                                reminder.reminder_date
                              )}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <Clock size={14} />
                              {formatTime(
                                reminder.reminder_time
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:shrink-0">
                        <button
                          onClick={() =>
                            openEditModal(reminder)
                          }
                          title="Edit reminder"
                          className="rounded-lg border border-[#1E293B] p-2 text-[#64748B] transition hover:border-[#2563EB] hover:text-[#60A5FA]"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(reminder)
                          }
                          disabled={
                            deletingId === reminder.id
                          }
                          title="Delete reminder"
                          className="rounded-lg border border-[#1E293B] p-2 text-[#64748B] transition hover:border-[#EF4444]/40 hover:text-[#F87171] disabled:opacity-50"
                        >
                          {deletingId === reminder.id ? (
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111827] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1E293B] px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-[#F8FAFC]">
                  {editingReminder
                    ? "Edit Reminder"
                    : "New Reminder"}
                </h2>

                <p className="mt-1 text-sm text-[#64748B]">
                  {editingReminder
                    ? "Update your reminder details."
                    : "Create a reminder for an important task or event."}
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-[#64748B] transition hover:bg-[#1E293B] hover:text-[#F8FAFC]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Submit assignment"
                  autoFocus
                  className="w-full rounded-lg border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition placeholder:text-[#475569] focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
                  Description{" "}
                  <span className="font-normal text-[#64748B]">
                    (optional)
                  </span>
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Add some details..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition placeholder:text-[#475569] focus:border-[#2563EB]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
                    Date
                  </label>

                  <input
                    type="date"
                    name="reminder_date"
                    value={form.reminder_date}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
                    Time
                  </label>

                  <input
                    type="time"
                    name="reminder_time"
                    value={form.reminder_time}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-[#1E293B] pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-[#1E293B] px-5 py-3 font-medium text-[#94A3B8] transition hover:bg-[#1E293B] hover:text-[#F8FAFC] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {saving
                    ? "Saving..."
                    : editingReminder
                    ? "Update Reminder"
                    : "Create Reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}