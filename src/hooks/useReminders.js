import { useCallback, useEffect, useState } from "react";

import { useAuth } from "./useAuth";

import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} from "../services/reminderService";

export function useReminders() {
  const { user } = useAuth();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReminders = useCallback(async () => {
    if (!user?.id) {
      setReminders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getReminders(user.id);

      setReminders(data);
    } catch (err) {
      console.error("Failed to load reminders:", err);
      setError(err.message || "Unable to load reminders.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const addReminder = async (reminder) => {
    if (!user?.id) {
      throw new Error("You must be logged in.");
    }

    const newReminder = await createReminder(
      user.id,
      reminder
    );

    setReminders((previous) =>
      [...previous, newReminder].sort((a, b) => {
        const first = `${a.reminder_date} ${a.reminder_time}`;
        const second = `${b.reminder_date} ${b.reminder_time}`;

        return first.localeCompare(second);
      })
    );

    return newReminder;
  };

  const toggleReminder = async (reminderId, completed) => {
    const updatedReminder = await updateReminder(
      reminderId,
      { completed }
    );

    setReminders((previous) =>
      previous.map((reminder) =>
        reminder.id === reminderId
          ? updatedReminder
          : reminder
      )
    );

    return updatedReminder;
  };

  const removeReminder = async (reminderId) => {
    await deleteReminder(reminderId);

    setReminders((previous) =>
      previous.filter(
        (reminder) => reminder.id !== reminderId
      )
    );
  };

  return {
    reminders,
    loading,
    error,
    addReminder,
    toggleReminder,
    removeReminder,
    reload: loadReminders,
  };
}