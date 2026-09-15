import { useEffect, useMemo, useState } from "react";
import {
  StickyNote,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";

export default function Notes() {
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingNote, setEditingNote] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    loadNotes();
  }, [user?.id]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getNotes(user.id);

      setNotes(data);
    } catch (err) {
      setError(
        err.message || "Failed to load notes."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingNote(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter a note title.");
      return;
    }

    if (!content.trim()) {
      setError("Please enter some note content.");
      return;
    }

    try {
      setSaving(true);

      if (editingNote) {
        const updated = await updateNote(
          editingNote.id,
          title,
          content
        );

        setNotes((previous) =>
          previous.map((note) =>
            note.id === updated.id
              ? updated
              : note
          )
        );

        setSuccess("Note updated successfully.");
      } else {
        const created = await createNote(
          user.id,
          title,
          content
        );

        setNotes((previous) => [
          created,
          ...previous,
        ]);

        setSuccess("Note created successfully.");
      }

      resetForm();
    } catch (err) {
      setError(
        err.message || "Failed to save note."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setShowForm(true);

    setError("");
    setSuccess("");
  };

  const handleDelete = async (noteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteNote(noteId);

      setNotes((previous) =>
        previous.filter(
          (note) => note.id !== noteId
        )
      );

      setSuccess("Note deleted successfully.");
    } catch (err) {
      setError(
        err.message || "Failed to delete note."
      );
    }
  };

  const filteredNotes = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) return notes;

    return notes.filter(
      (note) =>
        note.title
          ?.toLowerCase()
          .includes(search) ||
        note.content
          ?.toLowerCase()
          .includes(search)
    );
  }, [notes, searchTerm]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/15">
            <StickyNote
              size={25}
              className="text-[#60A5FA]"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#F8FAFC]">
              Notes
            </h1>

            <p className="mt-1 text-[#94A3B8]">
              Create and manage your personal notes
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={() => {
            setEditingNote(null);
            setTitle("");
            setContent("");
            setShowForm(true);
            setError("");
            setSuccess("");
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 font-semibold text-white transition hover:bg-[#1D4ED8]"
        >
          <Plus size={19} />
          New Note
        </button>

      </div>

      {/* Messages */}
      {error && (
        <div className="mb-5 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">
          {success}
        </div>
      )}

      {/* Search */}
      <div className="mb-6 rounded-2xl border border-[#1E293B] bg-[#111827] p-4">

        <div className="relative">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            placeholder="Search your notes..."
            className="w-full rounded-lg border border-[#1E293B] bg-[#0B1120] py-3 pl-11 pr-4 text-[#F8FAFC] outline-none transition placeholder:text-[#64748B] focus:border-[#2563EB]"
          />

        </div>

      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-[#1E293B] bg-[#111827]">

          <div className="flex items-center justify-between border-b border-[#1E293B] px-6 py-5">

            <div>
              <h2 className="text-lg font-semibold text-[#F8FAFC]">
                {editingNote
                  ? "Edit Note"
                  : "Create New Note"}
              </h2>

              <p className="mt-1 text-sm text-[#64748B]">
                {editingNote
                  ? "Update your note"
                  : "Save something for later"}
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg p-2 text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]"
            >
              <X size={20} />
            </button>

          </div>

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
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Enter note title"
                className="w-full rounded-lg border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none placeholder:text-[#64748B] focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
                Content
              </label>

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="Write your note here..."
                rows={6}
                className="w-full resize-none rounded-lg border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none placeholder:text-[#64748B] focus:border-[#2563EB]"
              />
            </div>

            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-[#1E293B] px-5 py-3 font-medium text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 font-semibold text-white hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />

                {saving
                  ? "Saving..."
                  : editingNote
                  ? "Update Note"
                  : "Save Note"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* Notes */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">

          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#1E293B] border-t-[#2563EB]" />

        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="rounded-2xl border border-[#1E293B] bg-[#111827] py-16 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB]/10">
            <StickyNote
              size={28}
              className="text-[#60A5FA]"
            />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-[#F8FAFC]">
            {searchTerm
              ? "No notes found"
              : "No notes yet"}
          </h2>

          <p className="mt-2 text-sm text-[#64748B]">
            {searchTerm
              ? "Try a different search term."
              : "Create your first note to get started."}
          </p>

          {!searchTerm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
            >
              <Plus size={17} />
              Create Note
            </button>
          )}

        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="group rounded-2xl border border-[#1E293B] bg-[#111827] transition hover:border-[#2563EB]/40"
            >

              <div className="p-5">

                <div className="flex items-start justify-between gap-4">

                  <h2 className="min-w-0 flex-1 break-words text-lg font-semibold text-[#F8FAFC]">
                    {note.title}
                  </h2>

                  <div className="flex shrink-0 gap-1">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(note)
                      }
                      className="rounded-lg p-2 text-[#64748B] hover:bg-[#2563EB]/10 hover:text-[#60A5FA]"
                      title="Edit note"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(note.id)
                      }
                      className="rounded-lg p-2 text-[#64748B] hover:bg-[#EF4444]/10 hover:text-[#FCA5A5]"
                      title="Delete note"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>

                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-[#94A3B8]">
                  {note.content}
                </p>

                <div className="mt-5 border-t border-[#1E293B] pt-4">

                  <p className="text-xs text-[#64748B]">
                    Updated{" "}
                    {formatDate(
                      note.updated_at ||
                        note.created_at
                    )}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}