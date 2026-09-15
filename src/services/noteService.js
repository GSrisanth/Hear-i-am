import { supabase } from "../lib/supabase";

export async function getNotes(userId) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function createNote(userId, title, content) {
  const { data, error } = await supabase
    .from("notes")
    .insert([
      {
        user_id: userId,
        title: title.trim(),
        content: content.trim(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateNote(
  noteId,
  title,
  content
) {
  const { data, error } = await supabase
    .from("notes")
    .update({
      title: title.trim(),
      content: content.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", noteId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteNote(noteId) {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId);

  if (error) {
    throw error;
  }

  return true;
}