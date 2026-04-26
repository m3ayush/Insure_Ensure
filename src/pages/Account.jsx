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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>

        {/* Profile */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-medium text-gray-500 w-36 inline-block">Name</span>{currentUser?.displayName || "—"}</p>
            <p><span className="font-medium text-gray-500 w-36 inline-block">Email</span>{currentUser?.email || "—"}</p>
            <p>
              <span className="font-medium text-gray-500 w-36 inline-block">Verified</span>
              {currentUser?.emailVerified
                ? <span className="text-green-600 font-medium">Yes</span>
                : <span className="text-amber-600 font-medium">No</span>}
            </p>
            <p><span className="font-medium text-gray-500 w-36 inline-block">Sign-in method</span>{isGoogle ? "Google" : "Email / Password"}</p>
          </div>
        </section>

        {/* Email verification */}
        {!currentUser?.emailVerified && (
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
            <h2 className="text-base font-semibold text-amber-800 mb-1">Email not verified</h2>
            <p className="text-sm text-amber-700 mb-4">
              Verify your email to keep your account secure.
            </p>
            {resendMsg && <p className="text-sm text-green-700 mb-2">{resendMsg}</p>}
            {resendError && <p className="text-sm text-red-600 mb-2">{resendError}</p>}
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition disabled:opacity-50 cursor-pointer"
            >
              {resendLoading ? "Sending…" : "Resend Verification Email"}
            </button>
          </section>
        )}

        {/* Change password */}
        {!isGoogle && (
          <section className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Password</h2>
            <p className="text-sm text-gray-500 mb-4">
              Changing your password will sign you out of all devices.
            </p>
            <Link
              to="/change-password"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition no-underline"
            >
              Change Password
            </Link>
          </section>
        )}

        {/* Delete account */}
        <section className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">
            Deleting your account disables access immediately. This action cannot be undone.
          </p>
          {deleteError && <p className="text-sm text-red-600 mb-3">{deleteError}</p>}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition cursor-pointer"
            >
              Delete Account
            </button>
          ) : (
            <div className="bg-red-50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-red-700">
                Are you sure? This will immediately sign you out and disable your account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {deleteLoading ? "Deleting…" : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition cursor-pointer"
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
