import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(form.email, form.password);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#F8FAFC]">
            Here <span className="text-[#60A5FA]">|</span> Am
          </h1>

          <p className="mt-2 text-[#94A3B8]">
            Your personal virtual assistant
          </p>
        </div>

        <div className="rounded-2xl border border-[#1E293B] bg-[#111827] p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-[#F8FAFC]">
            Welcome back
          </h2>

          <p className="mt-1 mb-6 text-sm text-[#94A3B8]">
            Sign in to your account
          </p>

          {error && (
            <div className="mb-5 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
                className="w-full rounded-lg border border-[#1E293B] bg-[#0B1120] px-4 py-3 text-[#F8FAFC] outline-none transition focus:border-[#2563EB]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#2563EB] px-4 py-3 font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#94A3B8]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-[#60A5FA] hover:text-[#93C5FD]"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}