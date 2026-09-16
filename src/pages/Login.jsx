import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      await login(
        form.email.trim(),
        form.password
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#eaf1ff] via-[#f8efff] to-[#edf8ff]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[550px] w-[550px] rounded-full bg-indigo-300/35 blur-[100px]" />

        <div className="absolute right-[-100px] top-[-100px] h-[500px] w-[500px] rounded-full bg-purple-300/35 blur-[110px]" />

        <div className="absolute bottom-[-180px] left-[30%] h-[500px] w-[500px] rounded-full bg-sky-300/35 blur-[110px]" />

        <div className="absolute right-[20%] top-[35%] h-[280px] w-[280px] rounded-full bg-pink-200/30 blur-[90px]" />

        {/* Decorative bubbles */}
        <div className="absolute left-[12%] top-[18%] h-10 w-10 rounded-full bg-white/40 blur-sm" />

        <div className="absolute left-[18%] top-[26%] h-4 w-4 rounded-full bg-purple-300/60" />

        <div className="absolute right-[16%] top-[22%] h-8 w-8 rounded-full bg-indigo-300/50" />

        <div className="absolute bottom-[20%] right-[12%] h-14 w-14 rounded-full bg-white/50 blur-sm" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1250px] items-center justify-center px-5 py-8">
        <div className="grid w-full max-w-[1050px] overflow-hidden rounded-[36px] border border-white/80 bg-white/45 shadow-[0_30px_100px_rgba(79,70,229,0.16)] backdrop-blur-2xl lg:grid-cols-2">
          {/* Left */}
          <div className="relative hidden min-h-[650px] overflow-hidden p-10 lg:flex lg:flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/70 via-purple-100/50 to-sky-100/70" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#A855F7] shadow-xl shadow-indigo-300/40">
                  <Sparkles
                    size={24}
                    className="text-white"
                  />
                </div>

                <div>
                  <h1 className="text-xl font-extrabold text-[#172554]">
                    Here I Am
                  </h1>

                  <p className="text-[10px] text-slate-500">
                    Your Personal Assistant
                  </p>
                </div>
              </div>

              <div className="mt-24">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-500">
                  Welcome to your space
                </p>

                <h2 className="mt-4 max-w-[400px] text-5xl font-black leading-[1.02] tracking-tight text-[#172554]">
                  Organize.
                  <br />
                  Focus.
                  <br />
                  <span className="bg-gradient-to-r from-[#4F46E5] to-[#A855F7] bg-clip-text text-transparent">
                    Achieve.
                  </span>
                </h2>

                <p className="mt-6 max-w-[390px] text-sm leading-6 text-slate-600">
                  Keep your reminders, notes, files,
                  schedule and personal information
                  together in one beautiful workspace.
                </p>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute bottom-12 left-10 rounded-2xl border border-white/80 bg-white/65 px-5 py-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100">
                  <CheckCircle2
                    size={19}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold text-[#172554]">
                    Stay organized
                  </p>

                  <p className="text-[10px] text-slate-500">
                    One step at a time.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute right-10 top-[46%] rounded-2xl border border-white/80 bg-white/65 px-4 py-3 shadow-xl backdrop-blur-xl">
              <p className="text-xs font-bold text-indigo-700">
                ✨ Ideas
              </p>

              <p className="text-[10px] text-slate-500">
                into action →
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex min-h-[650px] items-center bg-white/60 p-7 sm:p-10 lg:p-12">
            <div className="mx-auto w-full max-w-[390px]">
              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#A855F7] shadow-lg">
                    <Sparkles
                      size={22}
                      className="text-white"
                    />
                  </div>

                  <div>
                    <h1 className="text-lg font-extrabold text-[#172554]">
                      Here I Am
                    </h1>

                    <p className="text-[9px] text-slate-500">
                      Your Personal Assistant
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-indigo-500">
                  Welcome back 👋
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#172554]">
                  Sign in
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Continue to your personal workspace.
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#172554]">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-2xl border border-indigo-100 bg-white/80 px-4 text-sm text-[#172554] outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#172554]">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-12 w-full rounded-2xl border border-indigo-100 bg-white/80 px-4 pr-12 text-sm text-[#172554] outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-sm font-bold text-white shadow-xl shadow-indigo-300/35 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing in..."
                    : "Sign in"}

                  {!loading && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-xs text-slate-500">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-indigo-600 hover:text-purple-600"
                  >
                    Create account
                  </Link>
                </p>
              </div>

              <p className="mt-12 text-center text-[10px] text-slate-400">
                Your personal space. Your assistant.
                <br />
                Your progress. ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}