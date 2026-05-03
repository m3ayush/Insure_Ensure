import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { normalizeEmail, validateEmail } from "../utils/validators";
import { checkThrottle, recordFailure } from "../utils/authThrottle";

const GENERIC_SUCCESS =
  "If an account with that email exists, a password reset link has been sent.";

const RESET_THROTTLE = { scope: "reset", maxAttempts: 3, windowMs: 10 * 60_000 };

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    const normalizedEmail = normalizeEmail(email);
    if (!validateEmail(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    const gate = checkThrottle({ ...RESET_THROTTLE, key: normalizedEmail });
    if (!gate.allowed) {
      setMessage(GENERIC_SUCCESS);
      return;
    }
    recordFailure({ scope: RESET_THROTTLE.scope, key: normalizedEmail });
    setLoading(true);
    const continueUrl = `${window.location.origin}/signin?reset=1`;
    try {
      await resetPassword(normalizedEmail, continueUrl);
    } catch (err) {
      if (
        err?.code &&
        err.code !== "auth/user-not-found" &&
        err.code !== "auth/invalid-email"
      ) {
        setError("Something went wrong. Please try again shortly.");
        setLoading(false);
        return;
      }
    }
    setMessage(GENERIC_SUCCESS);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] dark:bg-[#0f172a] transition-colors duration-300 p-4">
      <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] border border-gray-200 dark:border-slate-700/60 shadow-xl p-8 sm:p-10 w-full max-w-md transition-all duration-300">
        <h1 className="text-3xl font-black text-center tracking-tight text-indigo-600 dark:text-indigo-400 mb-2">
          InsureEnsure
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 font-medium mb-6">Reset your password</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer mt-4"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <Link
            to="/signin"
            className="text-indigo-600 font-semibold hover:text-indigo-800"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
