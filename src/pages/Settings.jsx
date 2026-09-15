import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Bell,
  Save,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Settings() {
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("here-i-am-notifications") !== "false";
  });

  const [autoSave, setAutoSave] = useState(() => {
    return localStorage.getItem("here-i-am-autosave") !== "false";
  });

  const [saving, setSaving] = useState(false);

  const displayName =
    user?.user_metadata?.full_name || "Srisanth";

  const email = user?.email || "Not available";

  useEffect(() => {
    localStorage.setItem(
      "here-i-am-notifications",
      String(notifications)
    );
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(
      "here-i-am-autosave",
      String(autoSave)
    );
  }, [autoSave]);

  const handleSave = () => {
    setSaving(true);

    localStorage.setItem(
      "here-i-am-notifications",
      String(notifications)
    );

    localStorage.setItem(
      "here-i-am-autosave",
      String(autoSave)
    );

    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully.");
    }, 500);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error(
        error.message || "Failed to logout."
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your Here I Am preferences and account.
        </p>
      </div>

      {/* Account */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/10 p-3">
            <User
              size={22}
              className="text-blue-400"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Account
            </h2>

            <p className="text-sm text-slate-500">
              Your account information
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Full Name
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
              <User
                size={18}
                className="text-slate-500"
              />

              <span className="text-slate-200">
                {displayName}
              </span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
              <Mail
                size={18}
                className="text-slate-500"
              />

              <span className="truncate text-slate-200">
                {email}
              </span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <ShieldCheck
            size={20}
            className="text-green-400"
          />

          <div>
            <p className="text-sm font-medium text-green-400">
              Account secured
            </p>

            <p className="text-xs text-slate-500">
              Your account is protected by Supabase
              authentication.
            </p>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/10 p-3">
            <Bell
              size={22}
              className="text-blue-400"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Preferences
            </h2>

            <p className="text-sm text-slate-500">
              Control how Here I Am behaves
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {/* Notifications */}
          <div className="flex items-center justify-between gap-5 py-5 first:pt-0">
            <div className="flex items-start gap-4">
              <Bell
                size={19}
                className="mt-1 text-slate-500"
              />

              <div>
                <h3 className="font-medium text-white">
                  Notifications
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Enable reminder and application
                  notifications.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setNotifications(!notifications)
              }
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                notifications
                  ? "bg-blue-600"
                  : "bg-slate-700"
              }`}
              aria-label="Toggle notifications"
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  notifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Auto Save */}
          <div className="flex items-center justify-between gap-5 py-5 last:pb-0">
            <div className="flex items-start gap-4">
              <Save
                size={19}
                className="mt-1 text-slate-500"
              />

              <div>
                <h3 className="font-medium text-white">
                  Auto Save
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Keep application preferences saved
                  automatically.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setAutoSave(!autoSave)
              }
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                autoSave
                  ? "bg-blue-600"
                  : "bg-slate-700"
              }`}
              aria-label="Toggle auto save"
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  autoSave
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 border-t border-slate-800 pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>

      {/* Logout */}
      <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-white">
              Sign out
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sign out of your Here I Am account on this
              device.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </section>
    </div>
  );
}