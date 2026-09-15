import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const data = await register(
        form.email.trim(),
        form.password,
        form.name.trim()
      );

      if (data.session) {
        navigate("/dashboard", { replace: true });
      } else {
        setMessage(
          "Account created successfully! Please check your email to verify your account."
        );
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1120] px-4">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#F8FAFC]">
            Here <span className="text-[#60A5FA]">|</span> Am
          </h1>

          <p className="mt-2 text-[#94A3B8]">
            Create your personal assistant account
          </p>
        </div>

        <div className="rounded-2xl border border-[#1E293B] bg-[#111827] p-8 shadow-xl">

          <h2 className="text-2xl font-semibold text-[#F8FAFC]">
            Create account
          </h2>

          <p className="mb-6 mt-1 text-sm text-[#94A3B8]">
            Get started with Here I Am
          </p>

          {error && (
            <div className="mb-5 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
                Full name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full rounded-lg border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#F8FAFC]">
                Confirm password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full rounded-lg border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition focus:border-[#2563EB]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#2563EB] px-4 py-3 font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#94A3B8]">
            Already have an account?{" "}

            <Link
              to="/login"
              className="font-medium text-[#60A5FA] hover:text-[#93C5FD]"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}