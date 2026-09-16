import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  Search,
  Upload,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useReminders } from "../hooks/useReminders";

export default function Dashboard() {
  const { user } = useAuth();

  const {
    reminders = [],
    loading,
  } = useReminders();

  const displayName =
    user?.user_metadata?.full_name || "Srisanth";

  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const todayReminders = reminders.filter(
    (reminder) =>
      reminder.reminder_date === todayString
  );

  const pendingReminders = reminders.filter(
    (reminder) => !reminder.completed
  );

  const upcomingReminders = reminders
    .filter((reminder) => !reminder.completed)
    .sort((a, b) => {
      const first =
        `${a.reminder_date} ${a.reminder_time || ""}`;

      const second =
        `${b.reminder_date} ${b.reminder_time || ""}`;

      return first.localeCompare(second);
    })
    .slice(0, 5);

  const formatDate = (dateString) => {
    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString
      .split(":")
      .map(Number);

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning,";
    if (hour < 17) return "Good Afternoon,";
    return "Good Evening,";
  };

  return (
    <div className="mx-auto w-full max-w-[1500px]">

      {/* =====================================================
          HERO
         ===================================================== */}

      <section className="relative mb-6 min-h-[390px] overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-br from-white/80 via-indigo-50/75 to-sky-50/80 shadow-[0_25px_70px_rgba(79,70,229,0.10)] backdrop-blur-2xl">

        {/* Background glow */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -left-32 -top-32 h-[430px] w-[430px] rounded-full bg-indigo-300/20 blur-[100px]" />

          <div className="absolute bottom-[-180px] left-[25%] h-[400px] w-[400px] rounded-full bg-pink-300/20 blur-[110px]" />

          <div className="absolute right-[-100px] top-[10%] h-[430px] w-[430px] rounded-full bg-sky-300/25 blur-[110px]" />

        </div>

        {/* =================================================
            LEFT SIDE
           ================================================= */}

        <div className="relative z-10 flex min-h-[390px] flex-col justify-center px-7 py-10 sm:px-10 lg:w-[56%] lg:px-12">

          <div className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.28em] text-indigo-600">
            <Sparkles size={14} />
            Your Personal Space
          </div>

          <h1 className="max-w-[620px] text-[43px] font-black leading-[0.98] tracking-[-0.045em] text-[#172554] sm:text-[52px] lg:text-[57px]">

            {getGreeting()}

            <br />

            <span className="inline-flex items-center gap-3">
              {displayName}

              <span className="animate-[waveHand_2.5s_ease-in-out_infinite] text-[42px] sm:text-[48px]">
                👋
              </span>
            </span>

          </h1>

          <h2 className="mt-5 text-xl font-extrabold text-[#172554] sm:text-2xl">
            You're doing great!
          </h2>

          <p className="mt-2 max-w-[550px] text-sm leading-6 text-slate-500 sm:text-base">
            Stay organized. Achieve more. One step at a time.
          </p>

          {/* Quick actions */}

          <div className="mt-7 flex max-w-[620px] flex-wrap gap-2.5">

            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/85 px-4 py-2.5 text-xs font-bold text-[#172554] shadow-sm hover:-translate-y-0.5 hover:shadow-md"
            >
              <CalendarDays
                size={15}
                className="text-blue-600"
              />
              Plan my day
            </Link>

            <Link
              to="/reminders"
              className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/85 px-4 py-2.5 text-xs font-bold text-[#172554] shadow-sm hover:-translate-y-0.5 hover:shadow-md"
            >
              <Bell
                size={15}
                className="text-rose-500"
              />
              Set a reminder
            </Link>

            <Link
              to="/notes"
              className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/85 px-4 py-2.5 text-xs font-bold text-[#172554] shadow-sm hover:-translate-y-0.5 hover:shadow-md"
            >
              <Search
                size={15}
                className="text-indigo-600"
              />
              Search notes
            </Link>

            <Link
              to="/files"
              className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/85 px-4 py-2.5 text-xs font-bold text-[#172554] shadow-sm hover:-translate-y-0.5 hover:shadow-md"
            >
              <Upload
                size={15}
                className="text-purple-600"
              />
              Upload a file
            </Link>

          </div>
        </div>

        {/* =================================================
            RIGHT INTERACTIVE ROBOT AREA
           ================================================= */}

        <div
          className="absolute bottom-0 right-0 top-0 hidden overflow-hidden lg:block lg:w-[44%]"
          onMouseMove={(event) => {
            const rect =
              event.currentTarget.getBoundingClientRect();

            const x =
              (event.clientX - rect.left) /
              rect.width;

            const y =
              (event.clientY - rect.top) /
              rect.height;

            const mouseX = Math.max(
              -1,
              Math.min(1, (x - 0.5) * 2)
            );

            const mouseY = Math.max(
              -1,
              Math.min(1, (y - 0.5) * 2)
            );

            event.currentTarget.style.setProperty(
              "--mouse-x",
              mouseX
            );

            event.currentTarget.style.setProperty(
              "--mouse-y",
              mouseY
            );
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.setProperty(
              "--mouse-x",
              "0"
            );

            event.currentTarget.style.setProperty(
              "--mouse-y",
              "0"
            );
          }}
          style={{
            "--mouse-x": 0,
            "--mouse-y": 0,
          }}
        >

          {/* Robot glow */}

          <div className="pointer-events-none absolute left-[24%] top-[25%] h-[280px] w-[280px] rounded-full bg-indigo-300/25 blur-[85px]" />

          <div className="pointer-events-none absolute right-[5%] top-[30%] h-[230px] w-[230px] rounded-full bg-sky-300/25 blur-[80px]" />

          {/* Orbit */}

          <div className="pointer-events-none absolute left-[23%] top-[28%] h-[280px] w-[280px] rounded-full border border-dashed border-indigo-300/30" />

          <div className="pointer-events-none absolute left-[23%] top-[28%] h-[280px] w-[280px] animate-[orbitCircle_14s_linear_infinite]">

            <div className="absolute left-1/2 top-[-5px] h-3 w-3 -translate-x-1/2 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />

          </div>

          {/* Floating check */}

          <div
            className="absolute right-[16%] top-[11%] flex h-12 w-12 items-center justify-center rounded-2xl bg-[#243b7a] text-white shadow-xl shadow-indigo-300/30 transition-transform duration-200"
            style={{
              transform:
                "translate(calc(var(--mouse-x) * -8px), calc(var(--mouse-y) * -5px)) rotate(-5deg)",
            }}
          >
            <CheckCircle2 size={22} />
          </div>

          {/* Document */}

          <div
            className="absolute right-[7%] top-[40%] flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-blue-600 shadow-lg transition-transform duration-200"
            style={{
              transform:
                "translate(calc(var(--mouse-x) * -12px), calc(var(--mouse-y) * -7px))",
            }}
          >
            <FileText size={21} />
          </div>

          {/* =================================================
              ROBOT
             ================================================= */}

          <div
            className="absolute left-[32%] top-[18%] h-[285px] w-[250px] transition-transform duration-150 ease-out"
            style={{
              transform:
                "translate(calc(var(--mouse-x) * 14px), calc(var(--mouse-y) * 10px)) rotateY(calc(var(--mouse-x) * 11deg)) rotateX(calc(var(--mouse-y) * -7deg))",
              transformStyle: "preserve-3d",
              perspective: "900px",
            }}
          >

            <div className="relative h-full w-full animate-[robotFloat_4.8s_ease-in-out_infinite]">

              {/* Antenna */}

              <div
                className="absolute left-1/2 top-[-22px] h-[32px] w-[3px] -translate-x-1/2 rounded-full bg-slate-500"
                style={{
                  transform:
                    "translateX(-50%) rotate(calc(var(--mouse-x) * 8deg))",
                }}
              />

              <div className="absolute left-1/2 top-[-34px] h-4 w-4 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.9)] animate-[antennaPulse_2s_ease-in-out_infinite]" />

              {/* Left arm */}

              <div
                className="absolute left-[-12px] top-[127px] h-[74px] w-[26px] rounded-full bg-gradient-to-b from-slate-100 to-slate-300 shadow-sm"
                style={{
                  transform:
                    "rotate(calc(28deg + var(--mouse-x) * -7deg))",
                }}
              />

              <div
                className="absolute left-[-29px] top-[178px] text-lg"
                style={{
                  transform:
                    "translate(calc(var(--mouse-x) * 3px), calc(var(--mouse-y) * 2px))",
                }}
              >
                👋
              </div>

              {/* Right arm */}

              <div
                className="absolute right-[-10px] top-[128px] h-[74px] w-[26px] rounded-full bg-gradient-to-b from-slate-100 to-slate-300 shadow-sm"
                style={{
                  transform:
                    "rotate(calc(-25deg + var(--mouse-x) * -7deg))",
                }}
              />

              <div className="absolute right-[-27px] top-[178px] text-lg">
                ✨
              </div>

              {/* Body */}

              <div className="absolute bottom-[18px] left-1/2 h-[112px] w-[155px] -translate-x-1/2 rounded-[45%] bg-gradient-to-br from-white via-slate-100 to-blue-100 shadow-[0_25px_50px_rgba(79,70,229,0.18)]">

                <div className="absolute left-1/2 top-[15px] h-[52px] w-[115px] -translate-x-1/2 rounded-[24px] bg-gradient-to-br from-[#12244d] to-[#1e397b] shadow-inner">

                  <div
                    className="absolute left-[30px] top-[18px] h-3.5 w-3.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.95)]"
                    style={{
                      transform:
                        "translate(calc(var(--mouse-x) * 5px), calc(var(--mouse-y) * 3px))",
                    }}
                  />

                  <div
                    className="absolute right-[30px] top-[18px] h-3.5 w-3.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.95)]"
                    style={{
                      transform:
                        "translate(calc(var(--mouse-x) * 5px), calc(var(--mouse-y) * 3px))",
                    }}
                  />

                  <div className="absolute bottom-[9px] left-1/2 h-2 w-6 -translate-x-1/2 rounded-b-full border-b-2 border-cyan-300" />

                </div>

              </div>

              {/* Head */}

              <div
                className="absolute left-1/2 top-[27px] h-[122px] w-[183px] -translate-x-1/2 rounded-[51px] border-[7px] border-white bg-gradient-to-br from-white to-slate-100 shadow-[0_25px_55px_rgba(79,70,229,0.2)]"
                style={{
                  transform:
                    "translateX(-50%) rotateY(calc(var(--mouse-x) * 8deg))",
                  transformStyle: "preserve-3d",
                }}
              >

                {/* Face */}

                <div className="absolute left-1/2 top-[20px] h-[76px] w-[130px] -translate-x-1/2 rounded-[32px] bg-gradient-to-br from-[#12244d] to-[#1c397b] shadow-inner">

                  {/* Left eye */}

                  <div
                    className="absolute left-[33px] top-[26px] h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.95)]"
                    style={{
                      transform:
                        "translate(calc(var(--mouse-x) * 7px), calc(var(--mouse-y) * 5px))",
                    }}
                  />

                  {/* Right eye */}

                  <div
                    className="absolute right-[33px] top-[26px] h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.95)]"
                    style={{
                      transform:
                        "translate(calc(var(--mouse-x) * 7px), calc(var(--mouse-y) * 5px))",
                    }}
                  />

                  {/* Smile */}

                  <div
                    className="absolute bottom-[13px] left-1/2 h-[10px] w-[28px] -translate-x-1/2 rounded-b-full border-b-2 border-cyan-300"
                  />

                </div>

                {/* Ears */}

                <div className="absolute -left-[18px] top-[45px] h-[44px] w-[21px] rounded-l-full bg-blue-400" />

                <div className="absolute -right-[18px] top-[45px] h-[44px] w-[21px] rounded-r-full bg-blue-400" />

              </div>

              {/* Laptop */}

              <div
                className="absolute bottom-[-2px] left-1/2 z-20 h-[80px] w-[133px] -translate-x-1/2 rounded-xl border-[6px] border-slate-300 bg-[#273b82] shadow-xl"
                style={{
                  transform:
                    "translateX(-50%) rotate(calc(-7deg + var(--mouse-x) * 5deg))",
                }}
              >

                <div className="flex h-full items-center justify-center">
                  <CheckCircle2
                    size={28}
                    className="text-cyan-300"
                  />
                </div>

              </div>

              {/* Laptop base */}

              <div className="absolute bottom-[-12px] left-1/2 z-10 h-3 w-[153px] -translate-x-1/2 rounded-full bg-slate-300 shadow-md" />

            </div>
          </div>

          {/* Ideas */}

          <div
            className="absolute left-[6%] top-[39%] w-[112px] rounded-2xl border border-white/90 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl transition-transform duration-200"
            style={{
              transform:
                "translate(calc(var(--mouse-x) * -7px), calc(var(--mouse-y) * -4px))",
            }}
          >
            <p className="text-[12px] font-extrabold leading-4 text-indigo-600">
              Ideas
              <br />
              Into
              <br />
              Action →
            </p>
          </div>

          {/* Progress */}

          <div
            className="absolute bottom-[11%] right-[7%] rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-white shadow-xl shadow-indigo-300/30 transition-transform duration-200"
            style={{
              transform:
                "translate(calc(var(--mouse-x) * -10px), calc(var(--mouse-y) * -6px))",
            }}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={15} />

              <div>
                <p className="text-[11px] font-extrabold">
                  Small steps.
                </p>

                <p className="text-[11px] font-extrabold">
                  Big progress. 🌱
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          STAT CARDS
         ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Link
          to="/schedule"
          className="group rounded-[24px] border border-white/80 bg-white/70 p-5 shadow-[0_18px_45px_rgba(79,70,229,0.07)] backdrop-blur-xl hover:-translate-y-1"
        >
          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <CalendarDays size={21} />
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:translate-x-1">
              <ArrowRight size={17} />
            </div>

          </div>

          <p className="mt-5 text-sm font-bold text-slate-500">
            Schedule
          </p>

          <p className="mt-1 text-3xl font-black text-[#172554]">
            {loading
              ? "—"
              : todayReminders.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            events today
          </p>
        </Link>

        <Link
          to="/reminders"
          className="group rounded-[24px] border border-white/80 bg-white/70 p-5 shadow-[0_18px_45px_rgba(79,70,229,0.07)] backdrop-blur-xl hover:-translate-y-1"
        >
          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
              <Bell size={21} />
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition group-hover:translate-x-1">
              <ArrowRight size={17} />
            </div>

          </div>

          <p className="mt-5 text-sm font-bold text-slate-500">
            Reminders
          </p>

          <p className="mt-1 text-3xl font-black text-[#172554]">
            {loading
              ? "—"
              : pendingReminders.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            pending
          </p>
        </Link>

        <Link
          to="/notes"
          className="group rounded-[24px] border border-white/80 bg-white/70 p-5 shadow-[0_18px_45px_rgba(79,70,229,0.07)] backdrop-blur-xl hover:-translate-y-1"
        >
          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <FileText size={21} />
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition group-hover:translate-x-1">
              <ArrowRight size={17} />
            </div>

          </div>

          <p className="mt-5 text-sm font-bold text-slate-500">
            Notes
          </p>

          <p className="mt-1 text-3xl font-black text-[#172554]">
            —
          </p>

          <p className="mt-1 text-xs text-slate-400">
            open workspace
          </p>
        </Link>

        <Link
          to="/files"
          className="group rounded-[24px] border border-white/80 bg-white/70 p-5 shadow-[0_18px_45px_rgba(79,70,229,0.07)] backdrop-blur-xl hover:-translate-y-1"
        >
          <div className="flex items-start justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <FolderIcon />
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-purple-600 transition group-hover:translate-x-1">
              <ArrowRight size={17} />
            </div>

          </div>

          <p className="mt-5 text-sm font-bold text-slate-500">
            Files
          </p>

          <p className="mt-1 text-3xl font-black text-[#172554]">
            —
          </p>

          <p className="mt-1 text-xs text-slate-400">
            open repository
          </p>
        </Link>

      </div>

      {/* =====================================================
          LOWER SECTION
         ===================================================== */}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.75fr_0.95fr]">

        {/* Today */}

        <div className="overflow-hidden rounded-[26px] border border-white/80 bg-white/70 shadow-[0_18px_45px_rgba(79,70,229,0.07)] backdrop-blur-xl">

          <div className="flex items-center justify-between border-b border-indigo-100/70 px-6 py-5">

            <div>
              <h2 className="text-lg font-black text-[#172554]">
                Today
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {today.toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </p>
            </div>

            <Link
              to="/schedule"
              className="flex items-center gap-1 text-xs font-bold text-indigo-600"
            >
              View All
              <ArrowRight size={14} />
            </Link>

          </div>

          <div className="p-5">

            {loading ? (

              <div className="py-12 text-center text-sm text-slate-400">
                Loading...
              </div>

            ) : todayReminders.length === 0 ? (

              <div className="py-10 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-500">
                  <CheckCircle2 size={28} />
                </div>

                <h3 className="mt-4 text-sm font-extrabold text-[#172554]">
                  No reminders today
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Enjoy a clear schedule.
                </p>

                <Link
                  to="/reminders"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md"
                >
                  Add reminder
                  <ArrowRight size={14} />
                </Link>

              </div>

            ) : (

              <div className="space-y-2">

                {todayReminders.map(
                  (reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center gap-3 rounded-2xl border border-indigo-100/70 bg-white/60 p-3"
                    >

                      <div className="w-[65px] shrink-0 text-xs font-semibold text-slate-400">
                        {formatTime(
                          reminder.reminder_time
                        )}
                      </div>

                      <div className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />

                      <div className="min-w-0 flex-1">

                        <p
                          className={`truncate text-sm font-bold ${
                            reminder.completed
                              ? "text-slate-400 line-through"
                              : "text-[#172554]"
                          }`}
                        >
                          {reminder.title}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          Reminder
                        </p>

                      </div>

                      {reminder.completed && (
                        <CheckCircle2
                          size={17}
                          className="text-emerald-500"
                        />
                      )}

                    </div>
                  )
                )}

              </div>
            )}

          </div>
        </div>

        {/* Motivation */}

        <div className="relative min-h-[300px] overflow-hidden rounded-[26px] border border-indigo-200/40 bg-gradient-to-br from-indigo-400 via-violet-400 to-blue-400 p-7 shadow-[0_18px_45px_rgba(79,70,229,0.13)]">

          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/15 blur-2xl" />

          <div className="absolute bottom-[-50px] left-[-20px] h-36 w-36 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">

            <Sparkles
              size={22}
              className="mb-5 text-white/80"
            />

            <p className="max-w-[280px] text-xl font-bold italic leading-8 text-white">
              "A more mindful you,
              every day."
            </p>

            <Link
              to="/schedule"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-6 py-3 text-xs font-bold text-white shadow-lg backdrop-blur-md"
            >
              Keep Going
              <ArrowRight size={15} />
            </Link>

          </div>
        </div>

        {/* Upcoming */}

        <div className="overflow-hidden rounded-[26px] border border-white/80 bg-white/70 shadow-[0_18px_45px_rgba(79,70,229,0.07)] backdrop-blur-xl">

          <div className="flex items-center justify-between border-b border-indigo-100/70 px-6 py-5">

            <div>
              <h2 className="text-lg font-black text-[#172554]">
                Upcoming
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Next reminders
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <Clock size={18} />
            </div>

          </div>

          <div className="p-5">

            {loading ? (

              <p className="py-8 text-center text-sm text-slate-400">
                Loading...
              </p>

            ) : upcomingReminders.length === 0 ? (

              <div className="py-10 text-center">

                <CheckCircle2
                  size={30}
                  className="mx-auto text-emerald-500"
                />

                <p className="mt-3 text-sm font-bold text-[#172554]">
                  You're all caught up
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  No upcoming reminders.
                </p>

              </div>

            ) : (

              <div className="space-y-2.5">

                {upcomingReminders.map(
                  (reminder) => (
                    <Link
                      key={reminder.id}
                      to="/reminders"
                      className="group block rounded-2xl border border-indigo-100/70 bg-white/60 p-3 hover:bg-indigo-50/70"
                    >

                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                          <Bell size={16} />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-xs font-extrabold text-[#172554]">
                            {reminder.title}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            {formatDate(
                              reminder.reminder_date
                            )}{" "}
                            ·{" "}
                            {formatTime(
                              reminder.reminder_time
                            )}
                          </p>

                        </div>

                        <ArrowRight
                          size={15}
                          className="mt-2 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500"
                        />

                      </div>

                    </Link>
                  )
                )}

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

function FolderIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
      <path d="M3 10h18" />
    </svg>
  );
}