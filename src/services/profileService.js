import { supabase } from "../lib/supabase";

export async function getProfile(userId) {
  if (!userId) {
    throw new Error("User is not authenticated.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProfile(userId, profileData) {
  if (!userId) {
    throw new Error("User is not authenticated.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: profileData.full_name?.trim() || null,
      phone: profileData.phone?.trim() || null,
      bio: profileData.bio?.trim() || null,
      education: profileData.education?.trim() || null,
      skills: profileData.skills?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}