import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { normalizeEmail, validateEmail } from "../utils/validators";
import { checkThrottle, recordFailure, clearThrottle } from "../utils/authThrottle";

const SIGNIN_THROTTLE = { scope: "signin", maxAttempts: 5, windowMs: 5 * 60_000 };

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const passwordReset = new URLSearchParams(location.search).get("reset") === "1";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const normalizedEmail = normalizeEmail(email);
    if (!validateEmail(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Invalid email or password.");
      return;
    }
    const gate = checkThrottle({ ...SIGNIN_THROTTLE, key: normalizedEmail });
    if (!gate.allowed) {
      setError(`Too many failed attempts. Try again in ${gate.retryAfterSec}s.`);
      return;
    }
    setLoading(true);
    try {
      await login(normalizedEmail, password);
      clearThrottle({ scope: SIGNIN_THROTTLE.scope, key: normalizedEmail });
      navigate("/home");
    } catch (err) {
      recordFailure({ scope: SIGNIN_THROTTLE.scope, key: normalizedEmail });
      if (err?.code === "account-disabled") {
        setError("This account has been disabled. Contact support.");
      } else {
        setError("Invalid email or password.");
      }
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setError("");
    try {
      await googleSignIn();
      navigate("/home");
    } catch {
      setError("Google sign-in failed.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8e4d9] dark:bg-black transition-colors duration-300 p-4">
      <div className="bg-white dark:bg-[#111111] rounded-[2.5rem] border border-[#111] dark:border-[#333] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:shadow-[8px_8px_0px_0px_rgba(246,202,125,0.3)] p-8 sm:p-10 w-full max-w-md transition-all duration-300">
        <h1 className="text-3xl font-black text-center tracking-tight text-black dark:text-[#f6ca7d] mb-2">
          InsureEnsure
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 font-bold mb-6">
          Sign in to your account
        </p>

        {passwordReset && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">
            Password reset successful. Please sign in with your new password.
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
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
              className="w-full px-5 py-3.5 bg-[#e8e4d9] dark:bg-black border border-[#111] dark:border-[#333] rounded-[1.5rem] focus:ring-0 outline-none transition font-bold text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:border-black dark:focus:border-[#f6ca7d] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-[#e8e4d9] dark:bg-black border border-[#111] dark:border-[#333] rounded-[1.5rem] focus:ring-0 outline-none transition font-bold text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:border-black dark:focus:border-[#f6ca7d] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-none"
              placeholder="Enter your password"
            />
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-bold text-black dark:text-white hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-[#f6ca7d] text-white dark:text-black py-3.5 rounded-full font-black hover:bg-gray-800 dark:hover:bg-white transition disabled:opacity-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-none border border-transparent dark:border-[#111] mt-2 tracking-wide uppercase"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#111] dark:border-[#333]" />
          </div>
          <div className="relative flex justify-center text-sm font-bold">
            <span className="px-4 bg-white dark:bg-[#111111] text-gray-500 dark:text-gray-400">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-black border border-[#111] dark:border-[#333] py-3.5 rounded-full font-bold text-black dark:text-white hover:bg-[#f0eeb4] dark:hover:bg-[#222] transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-none"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-sm font-bold text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-black dark:text-[#f6ca7d] font-black hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
