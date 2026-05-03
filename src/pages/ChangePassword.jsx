import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validatePassword } from "../utils/validators";

const inputClass =
  "w-full px-5 py-3.5 bg-[#e8e4d9] dark:bg-black border border-[#111] dark:border-[#333] rounded-[1.5rem] focus:ring-0 outline-none transition font-bold text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:border-black dark:focus:border-[#f6ca7d] shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-none";
const errorInputClass =
  "w-full px-5 py-3.5 bg-[#ff4713]/10 dark:bg-[#ff4713]/10 border border-[#ff4713] dark:border-[#ff4713] rounded-[1.5rem] focus:ring-0 outline-none transition font-bold text-black dark:text-white shadow-[2px_2px_0px_0px_rgba(255,71,19,0.3)] dark:shadow-none";

export default function ChangePassword() {
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const errors = {};
    if (!currentPassword) errors.currentPassword = "Current password is required.";
    if (!validatePassword(newPassword)) {
      errors.newPassword = "At least 8 characters, with letters and numbers.";
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (newPassword === currentPassword && currentPassword) {
      errors.newPassword = "New password must differ from current password.";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      // changePassword signs out after revoking sessions
      navigate("/signin?reset=1");
    } catch (err) {
      if (
        err?.code === "auth/wrong-password" ||
        err?.code === "auth/invalid-credential"
      ) {
        setFormError("Current password is incorrect.");
      } else if (err?.code === "auth/requires-recent-login") {
        setFormError("Session expired. Please sign in again before changing your password.");
      } else {
        setFormError("Failed to change password. Please try again.");
      }
      setLoading(false);
    }
  }

  function renderError(key) {
    if (!fieldErrors[key]) return null;
    return <p className="mt-1 text-xs text-red-600">{fieldErrors[key]}</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8e4d9] dark:bg-black transition-colors duration-300 p-4">
      <div className="bg-white dark:bg-[#111111] rounded-[2.5rem] border border-[#111] dark:border-[#333] shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] dark:shadow-[8px_8px_0px_0px_rgba(246,202,125,0.3)] p-8 sm:p-10 w-full max-w-md transition-all duration-300">
        <h1 className="text-3xl font-black text-center tracking-tight text-black dark:text-[#f6ca7d] mb-2">
          Change Password
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 font-bold mb-6 text-sm">
          After changing your password, you will be signed out of all devices.
        </p>

        {formError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={fieldErrors.currentPassword ? errorInputClass : inputClass}
              placeholder="Enter current password"
            />
            {renderError("currentPassword")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={fieldErrors.newPassword ? errorInputClass : inputClass}
              placeholder="At least 8 characters, letters + numbers"
            />
            {renderError("newPassword")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={fieldErrors.confirmPassword ? errorInputClass : inputClass}
              placeholder="Re-enter new password"
            />
            {renderError("confirmPassword")}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-[#f6ca7d] text-white dark:text-black py-3.5 rounded-full font-black hover:bg-gray-800 dark:hover:bg-white transition disabled:opacity-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] dark:shadow-none border border-transparent dark:border-[#111] mt-4 tracking-wide uppercase"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-center text-sm font-bold text-gray-600 dark:text-gray-400 mt-6">
          <Link to="/account" className="text-black dark:text-[#f6ca7d] font-black hover:underline">
            Back to Account
          </Link>
        </p>
      </div>
    </div>
  );
}
