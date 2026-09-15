import { supabase } from "../lib/supabase";

const BUCKET_NAME = "user-files";

export async function getUserFiles(userId) {
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function uploadUserFile(userId, file) {
  if (!userId) {
    throw new Error("User is not authenticated.");
  }

  if (!file) {
    throw new Error("No file selected.");
  }

  // Create a safe filename
  const originalName = file.name;
  const extension = originalName.includes(".")
    ? originalName.substring(originalName.lastIndexOf("."))
    : "";

  const baseName = originalName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .substring(0, 80);

  const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${baseName}${extension}`;

  // Store every user's files inside their own folder
  const storagePath = `${userId}/${uniqueName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  // Store file information in database
  const { data, error: databaseError } = await supabase
    .from("files")
    .insert({
      user_id: userId,
      file_name: originalName,
      storage_path: storagePath,
      mime_type: file.type || null,
      file_size: file.size,
    })
    .select()
    .single();

  // If database insertion fails, remove uploaded file
  if (databaseError) {
    await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    throw databaseError;
  }

  return data;
}

export async function getFileUrl(storagePath) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, 3600);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}

export async function deleteUserFile(fileRecord) {
  if (!fileRecord?.storage_path) {
    throw new Error("Invalid file.");
  }

  // Delete from Storage
  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([fileRecord.storage_path]);

  if (storageError) {
    throw storageError;
  }

  // Delete database record
  const { error: databaseError } = await supabase
    .from("files")
    .delete()
    .eq("id", fileRecord.id);

  if (databaseError) {
    throw databaseError;
  }

  return true;
}

export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) {
    return "0 Bytes";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(
    index === 0 ? 0 : 2
  )} ${units[index] || "TB"}`;
}