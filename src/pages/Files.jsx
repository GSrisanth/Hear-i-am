import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  Download,
  Trash2,
  Search,
  X,
  Loader2,
  FolderOpen,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";
import {
  getUserFiles,
  uploadUserFile,
  getFileUrl,
  deleteUserFile,
  formatFileSize,
} from "../services/fileService";

export default function Files() {
  const { user } = useAuth();

  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadFiles = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const data = await getUserFiles(user.id);

      setFiles(data);
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error(error.message || "Failed to load files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [user?.id]);

  const handleUpload = async (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    if (!user?.id) {
      toast.error("Please log in first.");
      return;
    }

    try {
      setUploading(true);

      let uploadedCount = 0;

      for (const file of selectedFiles) {
        await uploadUserFile(user.id, file);
        uploadedCount++;
      }

      toast.success(
        uploadedCount === 1
          ? "File uploaded successfully!"
          : `${uploadedCount} files uploaded successfully!`
      );

      await loadFiles();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "File upload failed.");
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileInput = (event) => {
    handleUpload(event.target.files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);

    if (event.dataTransfer.files) {
      handleUpload(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);
  };

  const handleDownload = async (fileRecord) => {
    try {
      const url = await getFileUrl(fileRecord.storage_path);

      const link = document.createElement("a");

      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Unable to open file.");
    }
  };

  const handleDelete = async (fileRecord) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fileRecord.file_name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(fileRecord.id);

      await deleteUserFile(fileRecord);

      setFiles((previousFiles) =>
        previousFiles.filter(
          (file) => file.id !== fileRecord.id
        )
      );

      toast.success("File deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete file.");
    } finally {
      setDeletingId(null);
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith("image/")) {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#60A5FA]">
          <ImageIcon size={24} />
        </div>
      );
    }

    if (mimeType === "application/pdf") {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EF4444]/10 text-[#F87171]">
          <FileText size={24} />
        </div>
      );
    }

    if (
      mimeType?.includes("word") ||
      mimeType?.includes("document")
    ) {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#60A5FA]">
          <FileText size={24} />
        </div>
      );
    }

    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E293B] text-[#94A3B8]">
        <File size={24} />
      </div>
    );
  };

  const filteredFiles = files.filter((file) =>
    file.file_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">
            Files
          </h1>

          <p className="mt-1 text-sm text-[#94A3B8]">
            Store and manage your personal files and documents.
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={18} />
              Upload File
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.gif"
        />
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-8 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragActive
            ? "border-[#60A5FA] bg-[#2563EB]/10"
            : "border-[#1E293B] bg-[#111827] hover:border-[#2563EB]"
        }`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#60A5FA]">
          {uploading ? (
            <Loader2
              size={28}
              className="animate-spin"
            />
          ) : (
            <Upload size={28} />
          )}
        </div>

        <h3 className="mt-4 text-lg font-semibold text-[#F8FAFC]">
          {uploading
            ? "Uploading your files..."
            : "Drop files here"}
        </h3>

        <p className="mt-2 text-sm text-[#94A3B8]">
          or click anywhere to browse from your computer
        </p>

        <p className="mt-3 text-xs text-[#64748B]">
          Supported: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG,
          WEBP, GIF
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search files..."
            className="w-full rounded-lg border border-[#1E293B] bg-[#111827] py-3 pl-10 pr-10 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#64748B] focus:border-[#2563EB]"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#F8FAFC]"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <div className="text-sm text-[#94A3B8]">
          {files.length}{" "}
          {files.length === 1 ? "file" : "files"}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-[#1E293B] bg-[#111827]">
          <div className="text-center">
            <Loader2
              size={32}
              className="mx-auto animate-spin text-[#60A5FA]"
            />

            <p className="mt-3 text-sm text-[#94A3B8]">
              Loading your files...
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredFiles.length === 0 && (
        <div className="rounded-2xl border border-[#1E293B] bg-[#111827] px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E293B] text-[#64748B]">
            <FolderOpen size={30} />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-[#F8FAFC]">
            {searchQuery
              ? "No files found"
              : "No files yet"}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-[#94A3B8]">
            {searchQuery
              ? "Try searching with a different file name."
              : "Upload your first file to keep your documents and pictures organized."}
          </p>

          {!searchQuery && (
            <button
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              <Upload size={18} />
              Upload Your First File
            </button>
          )}
        </div>
      )}

      {/* File List */}
      {!loading && filteredFiles.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111827]">
          <div className="border-b border-[#1E293B] px-6 py-4">
            <h2 className="font-semibold text-[#F8FAFC]">
              Your Files
            </h2>
          </div>

          <div className="divide-y divide-[#1E293B]">
            {filteredFiles.map((fileRecord) => (
              <div
                key={fileRecord.id}
                className="flex flex-col gap-4 px-6 py-5 transition hover:bg-[#0B1120]/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  {getFileIcon(fileRecord.mime_type)}

                  <div className="min-w-0">
                    <h3
                      className="truncate font-medium text-[#F8FAFC]"
                      title={fileRecord.file_name}
                    >
                      {fileRecord.file_name}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748B]">
                      <span>
                        {formatFileSize(
                          fileRecord.file_size
                        )}
                      </span>

                      <span>•</span>

                      <span>
                        {new Date(
                          fileRecord.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                  <button
                    onClick={() =>
                      handleDownload(fileRecord)
                    }
                    title="Open / Download"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#1E293B] px-3 py-2 text-sm font-medium text-[#94A3B8] transition hover:border-[#2563EB] hover:bg-[#2563EB]/10 hover:text-[#60A5FA]"
                  >
                    <Download size={17} />
                    <span className="hidden sm:inline">
                      Open
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(fileRecord)
                    }
                    disabled={deletingId === fileRecord.id}
                    title="Delete"
                    className="inline-flex items-center justify-center rounded-lg border border-[#1E293B] p-2 text-[#94A3B8] transition hover:border-[#EF4444]/40 hover:bg-[#EF4444]/10 hover:text-[#F87171] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === fileRecord.id ? (
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}