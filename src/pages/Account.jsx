import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { checkThrottle, recordFailure } from "../utils/authThrottle";

const RESEND_THROTTLE = { scope: "resend-verification", maxAttempts: 2, windowMs: 5 * 60_000 };

export default function Account() {
  const { currentUser, resendVerification, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();
  const [resendMsg, setResendMsg] = useState("");
  const [resendError, setResendError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const isGoogle = currentUser?.providerData?.some((p) => p.providerId === "google.com");

  async function handleResend() {
    setResendMsg("");
    setResendError("");
    const gate = checkThrottle({ ...RESEND_THROTTLE, key: currentUser.uid });
    if (!gate.allowed) {
      setResendError(`Too many requests. Try again in ${gate.retryAfterSec}s.`);
      return;
    }
    setResendLoading(true);
    try {
      await resendVerification();
      recordFailure({ scope: RESEND_THROTTLE.scope, key: currentUser.uid });
      setResendMsg("Verification email sent. Check your inbox.");
    } catch {
      setResendError("Failed to send. Please try again shortly.");
    }
    setResendLoading(false);
  }

  async function handleDelete() {
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await deleteAccount();
      navigate("/signin");
    } catch {
      setDeleteError("Failed to delete account. Please try again.");
      setDeleteLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#e8e4d9] dark:bg-black transition-colors duration-300">
      <Navbar />
      <div className="max-w-2xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 flex-grow">
        <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight mb-8">Account Settings</h1>

        {/* Profile */}
        <section className="bg-white dark:bg-[#111111] rounded-[2.5rem] border border-[#111] dark:border-[#333] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:shadow-[8px_8px_0px_0px_rgba(246,202,125,0.3)] p-6 sm:p-8 mb-6 transition-all duration-300">
          <h2 className="text-2xl font-black text-black dark:text-white mb-6 tracking-tight">Profile</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
            <p className="flex items-center"><span className="text-gray-500 dark:text-gray-400 w-36">Name</span><span className="font-bold">{currentUser?.displayName || "—"}</span></p>
            <p className="flex items-center"><span className="text-gray-500 dark:text-gray-400 w-36">Email</span><span className="font-bold">{currentUser?.email || "—"}</span></p>
            <p className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 w-36">Verified</span>
              {currentUser?.emailVerified
                ? <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full text-xs">Yes</span>
                : <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full text-xs">No</span>}
            </p>
            <p className="flex items-center"><span className="text-gray-500 dark:text-gray-400 w-36">Sign-in method</span><span className="font-bold">{isGoogle ? "Google" : "Email / Password"}</span></p>
          </div>
        </section>

        {/* Email verification */}
        {!currentUser?.emailVerified && (
          <section className="bg-[#f0eeb4] dark:bg-yellow-900/30 border border-[#111] dark:border-[#333] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:shadow-[8px_8px_0px_0px_rgba(246,202,125,0.3)] rounded-[2.5rem] p-6 sm:p-8 mb-6 transition-all duration-300">
            <h2 className="text-2xl font-black text-black dark:text-[#f6ca7d] mb-2 tracking-tight">Email not verified</h2>
            <p className="text-sm font-bold text-black/80 dark:text-white/80 mb-4">
              Verify your email to keep your account secure.
            </p>
            {resendMsg && <p className="text-sm text-green-700 mb-2">{resendMsg}</p>}
            {resendError && <p className="text-sm text-red-600 mb-2">{resendError}</p>}
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="bg-black text-white dark:bg-[#f6ca7d] dark:text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 dark:hover:bg-white transition disabled:opacity-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-none"
            >
              {resendLoading ? "Sending…" : "Resend Verification Email"}
            </button>
          </section>
        )}

        {/* Change password */}
        {!isGoogle && (
          <section className="bg-white dark:bg-[#111111] rounded-[2.5rem] border border-[#111] dark:border-[#333] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:shadow-[8px_8px_0px_0px_rgba(246,202,125,0.3)] p-6 sm:p-8 mb-6 transition-all duration-300">
            <h2 className="text-2xl font-black text-black dark:text-white mb-2 tracking-tight">Password</h2>
            <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-4">
              Changing your password will sign you out of all devices.
            </p>
            <Link
              to="/change-password"
              className="inline-block bg-black text-white dark:bg-[#f6ca7d] dark:text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 dark:hover:bg-white transition no-underline shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-none"
            >
              Change Password
            </Link>
          </section>
        )}

        {/* Delete account */}
        <section className="bg-[#ff4713]/10 dark:bg-[#ff4713]/5 rounded-[2.5rem] border border-[#ff4713] dark:border-[#ff4713]/50 shadow-[8px_8px_0px_0px_rgba(255,71,19,0.3)] p-6 sm:p-8 transition-all duration-300">
          <h2 className="text-2xl font-black text-[#ff4713] mb-2 tracking-tight">Danger Zone</h2>
          <p className="text-sm font-bold text-black/70 dark:text-white/60 mb-4">
            Deleting your account disables access immediately. This action cannot be undone.
          </p>
          {deleteError && <p className="text-sm font-bold text-red-600 mb-3">{deleteError}</p>}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-[#ff4713] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-red-700 transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-none border border-[#111] dark:border-transparent"
            >
              Delete Account
            </button>
          ) : (
            <div className="bg-white dark:bg-black rounded-2xl p-5 border border-[#111] dark:border-[#333] space-y-4">
              <p className="text-sm font-black text-[#ff4713]">
                Are you sure? This will immediately sign you out and disable your account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="bg-[#ff4713] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-red-700 transition disabled:opacity-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-none border border-[#111] dark:border-transparent"
                >
                  {deleteLoading ? "Deleting…" : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-[#e8e4d9] dark:bg-[#222] text-black dark:text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-white dark:hover:bg-[#333] transition cursor-pointer border border-[#111] dark:border-[#333]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
