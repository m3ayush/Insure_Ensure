import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validatePassword } from "../utils/validators";

const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition";
const errorInputClass =
  "w-full px-4 py-2 border border-red-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-2">
          Change Password
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
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
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link to="/account" className="text-indigo-600 font-semibold hover:text-indigo-800">
            Back to Account
          </Link>
        </p>
      </div>
    </div>
  );
}
