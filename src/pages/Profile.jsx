import { useEffect, useState } from "react";
import { CheckCircle, Save, User, Loader2 } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import {
  getProfile,
  updateProfile,
} from "../services/profileService";

export default function Profile() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    bio: "",
    education: "",
    skills: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const profile = await getProfile(user.id);

      setForm({
        full_name: profile?.full_name || "",
        phone: profile?.phone || "",
        bio: profile?.bio || "",
        education: profile?.education || "",
        skills: profile?.skills || "",
      });
    } catch (err) {
      console.error("Profile loading error:", err);
      setError(err.message || "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    try {
      setSaving(true);

      const updatedProfile = await updateProfile(user.id, form);

      setForm({
        full_name: updatedProfile?.full_name || "",
        phone: updatedProfile?.phone || "",
        bio: updatedProfile?.bio || "",
        education: updatedProfile?.education || "",
        skills: updatedProfile?.skills || "",
      });

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={36}
            className="mx-auto animate-spin text-[#60A5FA]"
          />

          <p className="mt-4 text-sm text-[#94A3B8]">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB]/15">
            <User
              size={23}
              className="text-[#60A5FA]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#F8FAFC]">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-[#94A3B8]">
              Manage your personal information
            </p>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111827]">
        {/* Profile Top */}
        <div className="border-b border-[#1E293B] px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-2xl font-bold text-white">
              {form.full_name
                ? form.full_name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#F8FAFC]">
                {form.full_name || "Your Name"}
              </h2>

              <p className="mt-1 text-sm text-[#94A3B8]">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 sm:p-8"
        >
          {/* Error */}
          {error && (
            <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label
              htmlFor="full_name"
              className="mb-2 block text-sm font-medium text-[#F8FAFC]"
            >
              Full Name
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#F8FAFC]"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-[#1E293B] bg-[#1E293B]/40 px-4 py-3 text-[#64748B]"
            />

            <p className="mt-2 text-xs text-[#64748B]">
              Your login email is managed by your account.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-[#F8FAFC]"
            >
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full rounded-xl border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="mb-2 block text-sm font-medium text-[#F8FAFC]"
            >
              Bio
            </label>

            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell us a little about yourself..."
              className="w-full resize-none rounded-xl border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          {/* Education */}
          <div>
            <label
              htmlFor="education"
              className="mb-2 block text-sm font-medium text-[#F8FAFC]"
            >
              Education
            </label>

            <input
              id="education"
              name="education"
              type="text"
              value={form.education}
              onChange={handleChange}
              placeholder="e.g. Integrated M.Tech in Software Engineering"
              className="w-full rounded-xl border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          {/* Skills */}
          <div>
            <label
              htmlFor="skills"
              className="mb-2 block text-sm font-medium text-[#F8FAFC]"
            >
              Skills
            </label>

            <textarea
              id="skills"
              name="skills"
              rows={4}
              value={form.skills}
              onChange={handleChange}
              placeholder="e.g. React, JavaScript, Python, SQL..."
              className="w-full resize-none rounded-xl border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />

            <p className="mt-2 text-xs text-[#64748B]">
              Separate multiple skills with commas.
            </p>
          </div>

          {/* Save */}
          <div className="flex justify-end border-t border-[#1E293B] pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}