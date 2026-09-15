import { supabase } from "../lib/supabase";

export async function getUserReminders(userId) {
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", userId)
    .order("reminder_date", { ascending: true })
    .order("reminder_time", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

// Compatibility function for the existing useReminders hook
export async function getReminders(userId) {
  return getUserReminders(userId);
}

export async function createReminder(
  userId,
  reminderData
) {
  if (!userId) {
    throw new Error("User is not authenticated.");
  }

  if (!reminderData.title?.trim()) {
    throw new Error("Reminder title is required.");
  }

  if (!reminderData.reminder_date) {
    throw new Error("Reminder date is required.");
  }

  if (!reminderData.reminder_time) {
    throw new Error("Reminder time is required.");
  }

  const { data, error } = await supabase
    .from("reminders")
    .insert({
      user_id: userId,
      title: reminderData.title.trim(),
      description:
        reminderData.description?.trim() || null,
      reminder_date: reminderData.reminder_date,
      reminder_time: reminderData.reminder_time,
      completed: false,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateReminder(
  reminderId,
  reminderData
) {
  const { data, error } = await supabase
    .from("reminders")
    .update({
      title: reminderData.title?.trim(),
      description:
        reminderData.description?.trim() || null,
      reminder_date: reminderData.reminder_date,
      reminder_time: reminderData.reminder_time,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reminderId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function toggleReminder(
  reminderId,
  completed
) {
  const { data, error } = await supabase
    .from("reminders")
    .update({
      completed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reminderId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteReminder(reminderId) {
  const { error } = await supabase
    .from("reminders")
    .delete()
    .eq("id", reminderId);

  if (error) {
    throw error;
  }

  return true;
}