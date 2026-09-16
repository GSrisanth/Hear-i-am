import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
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
    setSuccess("");

    if (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError(
        "Please fill in all fields."
      );
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const data = await register(
        form.email.trim(),
        form.password,
        form.fullName.trim()
      );

      if (data?.session) {
        navigate("/dashboard", {
          replace: true,
        });
      } else {
        setSuccess(
          "Account created successfully. Please check your email to confirm your account."
        );
      }
    } catch (err) {
      setError(
        err?.message ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#eaf1ff] via-[#f8efff] to-[#edf8ff]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[550px] w-[550px] rounded-full bg-indigo-300/35 blur-[100px]" />

        <div className="absolute right-[-100px] top-[-100px] h-[500px] w-[500px] rounded-full bg-purple-300/35 blur-[110px]" />

        <div className="absolute bottom-[-180px] left-[30%] h-[500px] w-[500px] rounded-full bg-sky-300/35 blur-[110px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1250px] items-center justify-center px-5 py-8">
        <div className="grid w-full max-w-[1050px] overflow-hidden rounded-[36px] border border-white/80 bg-white/45 shadow-[0_30px_100px_rgba(79,70,229,0.16)] backdrop-blur-2xl lg:grid-cols-2">
          {/* Left */}
          <div className="relative hidden min-h-[680px] overflow-hidden p-10 lg:flex lg:flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/70 via-purple-100/50 to-sky-100/70" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#A855F7] shadow-xl">
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
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
                  Start your journey
                </p>

                <h2 className="mt-4 text-5xl font-black leading-[1.02] text-[#172554]">
                  Your space.
                  <br />
                  Your plans.
                  <br />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Your progress.
                  </span>
                </h2>

                <p className="mt-6 max-w-[390px] text-sm leading-6 text-slate-600">
                  Create your personal workspace and
                  keep everything important within reach.
                </p>
              </div>
            </div>

            <div className="absolute bottom-12 left-10 rounded-2xl border border-white/80 bg-white/65 px-5 py-4 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                  <CheckCircle2
                    size={19}
                    className="text-indigo-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold text-[#172554]">
                    Everything in one place
                  </p>

                  <p className="text-[10px] text-slate-500">
                    Notes • Files • Reminders • Search
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex min-h-[680px] items-center bg-white/60 p-7 sm:p-10 lg:p-12">
            <div className="mx-auto w-full max-w-[390px]">
              <div className="mb-7 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#A855F7]">
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

              <p className="text-sm font-semibold text-indigo-500">
                Let's get started ✨
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#172554]">
                Create account
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create your personal assistant workspace.
              </p>

              {error && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-medium text-green-700">
                  {success}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#172554]">
                    Full Name
                  </label>

                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="h-11 w-full rounded-2xl border border-indigo-100 bg-white/80 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

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
                    className="h-11 w-full rounded-2xl border border-indigo-100 bg-white/80 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
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
                      placeholder="At least 6 characters"
                      className="h-11 w-full rounded-2xl border border-indigo-100 bg-white/80 px-4 pr-12 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#172554]">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showConfirm
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={
                        form.confirmPassword
                      }
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      className="h-11 w-full rounded-2xl border border-indigo-100 bg-white/80 px-4 pr-12 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirm(
                          !showConfirm
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showConfirm ? (
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
                  className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-sm font-bold text-white shadow-xl shadow-indigo-300/35 hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {loading
                    ? "Creating account..."
                    : "Create account"}

                  {!loading && (
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <p className="mt-7 text-center text-xs text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-indigo-600 hover:text-purple-600"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}