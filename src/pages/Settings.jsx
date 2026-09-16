import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Bell,
  Save,
  LogOut,
  ShieldCheck,
  Check,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Settings() {
  const { user, logout } = useAuth();

  const [notifications, setNotifications] =
    useState(() => {
      return (
        localStorage.getItem(
          "here-i-am-notifications"
        ) !== "false"
      );
    });

  const [autoSave, setAutoSave] =
    useState(() => {
      return (
        localStorage.getItem(
          "here-i-am-autosave"
        ) !== "false"
      );
    });

  const [saving, setSaving] = useState(false);

  const displayName =
    user?.user_metadata?.full_name ||
    "Srisanth";

  const email =
    user?.email || "Not available";

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

      toast.success(
        "Settings saved successfully."
      );
    }, 500);
  };

  const handleLogout = async () => {
    try {
      await logout();

      toast.success(
        "Logged out successfully."
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Failed to logout."
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-6 pb-10">

      {/* =================================================
          HEADER
         ================================================= */}

      <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/65 px-6 py-7 shadow-[0_20px_55px_rgba(79,70,229,0.08)] backdrop-blur-2xl sm:px-8">

        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-300/20 blur-[80px]" />

        <div className="relative flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-200">
            <SettingsIcon size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#172554]">
              Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your Here I Am preferences
              and account.
            </p>
          </div>

        </div>
      </div>


      {/* =================================================
          ACCOUNT
         ================================================= */}

      <section className="settings-card overflow-hidden rounded-[26px] border border-white/85 bg-white/70 shadow-[0_18px_50px_rgba(79,70,229,0.08)] backdrop-blur-2xl">

        <div className="border-b border-indigo-100/70 px-6 py-5 sm:px-7">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <User size={21} />
            </div>

            <div>
              <h2 className="text-lg font-black text-[#172554]">
                Account
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Your account information
              </p>
            </div>

          </div>

        </div>


        <div className="p-6 sm:p-7">

          <div className="grid gap-5 md:grid-cols-2">

            {/* Full Name */}

            <div>

              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Full Name
              </label>

              <div className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-indigo-100/80 bg-white/75 px-4 shadow-sm">

                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                  <User size={16} />
                </div>

                <span className="text-sm font-bold text-[#172554]">
                  {displayName}
                </span>

              </div>

            </div>


            {/* Email */}

            <div>

              <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Email Address
              </label>

              <div className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-indigo-100/80 bg-white/75 px-4 shadow-sm">

                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                  <Mail size={16} />
                </div>

                <span className="truncate text-sm font-bold text-[#172554]">
                  {email}
                </span>

              </div>

            </div>

          </div>


          {/* Security */}

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <ShieldCheck size={19} />
            </div>

            <div>

              <p className="text-sm font-extrabold text-emerald-700">
                Account secured
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-600/70">
                Your account is protected by
                Supabase authentication.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          PREFERENCES
         ================================================= */}

      <section className="settings-card overflow-hidden rounded-[26px] border border-white/85 bg-white/70 shadow-[0_18px_50px_rgba(79,70,229,0.08)] backdrop-blur-2xl">

        <div className="border-b border-indigo-100/70 px-6 py-5 sm:px-7">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <Bell size={21} />
            </div>

            <div>

              <h2 className="text-lg font-black text-[#172554]">
                Preferences
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Control how Here I Am behaves
              </p>

            </div>

          </div>

        </div>


        <div className="px-6 sm:px-7">

          {/* Notifications */}

          <div className="flex items-center justify-between gap-5 border-b border-indigo-100/60 py-6">

            <div className="flex min-w-0 items-start gap-4">

              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                <Bell size={18} />
              </div>

              <div>

                <h3 className="text-sm font-extrabold text-[#172554]">
                  Notifications
                </h3>

                <p className="mt-1 max-w-[560px] text-xs leading-5 text-slate-400">
                  Enable reminder and application
                  notifications.
                </p>

              </div>

            </div>


            {/* Toggle */}

            <button
              type="button"
              onClick={() =>
                setNotifications(
                  !notifications
                )
              }
              className={`relative h-7 w-12 shrink-0 rounded-full p-0.5 transition-all duration-200 ${
                notifications
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md shadow-blue-200"
                  : "bg-slate-200"
              }`}
              aria-label="Toggle notifications"
            >

              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                  notifications
                    ? "left-6"
                    : "left-1"
                }`}
              />

            </button>

          </div>


          {/* Auto Save */}

          <div className="flex items-center justify-between gap-5 py-6">

            <div className="flex min-w-0 items-start gap-4">

              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                <Save size={18} />
              </div>

              <div>

                <h3 className="text-sm font-extrabold text-[#172554]">
                  Auto Save
                </h3>

                <p className="mt-1 max-w-[560px] text-xs leading-5 text-slate-400">
                  Keep application preferences
                  saved automatically.
                </p>

              </div>

            </div>


            {/* Toggle */}

            <button
              type="button"
              onClick={() =>
                setAutoSave(!autoSave)
              }
              className={`relative h-7 w-12 shrink-0 rounded-full p-0.5 transition-all duration-200 ${
                autoSave
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md shadow-blue-200"
                  : "bg-slate-200"
              }`}
              aria-label="Toggle auto save"
            >

              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                  autoSave
                    ? "left-6"
                    : "left-1"
                }`}
              />

            </button>

          </div>

        </div>


        {/* Save */}

        <div className="flex flex-col gap-4 border-t border-indigo-100/60 bg-indigo-50/25 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

          <div>

            <p className="text-xs font-bold text-[#172554]">
              Preferences
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Changes are saved locally on this device.
            </p>

          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >

            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}

          </button>

        </div>

      </section>


      {/* =================================================
          SIGN OUT
         ================================================= */}

      <section className="overflow-hidden rounded-[26px] border border-rose-100 bg-white/70 shadow-[0_18px_50px_rgba(244,63,94,0.06)] backdrop-blur-2xl">

        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <LogOut size={20} />
            </div>

            <div>

              <h2 className="text-base font-black text-[#172554]">
                Sign out
              </h2>

              <p className="mt-1 max-w-[600px] text-xs leading-5 text-slate-400">
                Sign out of your Here I Am account
                on this device.
              </p>

            </div>

          </div>


          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-extrabold text-rose-600 transition hover:-translate-y-0.5 hover:bg-rose-100 hover:shadow-md"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </section>


      {/* =================================================
          STATUS
         ================================================= */}

      <div className="flex items-center justify-center gap-2 pb-2 text-[10px] font-semibold text-slate-400">

        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
          <Check size={12} />
        </span>

        Your preferences are stored securely on this device.

      </div>

    </div>
  );
}