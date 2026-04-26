import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateDOB,
  normalizeEmail,
  isDisposableEmail,
  formatContactWithCountryCode,
} from "../utils/validators";

const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition";
const errorInputClass =
  "w-full px-4 py-2 border border-red-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function runValidation() {
    const errors = {};
    if (!validateName(firstName)) {
      errors.firstName = "Letters, spaces, hyphens, and apostrophes only.";
    }
    if (!validateName(lastName)) {
      errors.lastName = "Letters, spaces, hyphens, and apostrophes only.";
    }
    const normalizedEmail = normalizeEmail(email);
    if (!validateEmail(normalizedEmail)) {
      errors.email = "Enter a valid email address.";
    } else if (isDisposableEmail(normalizedEmail)) {
      errors.email = "Disposable email addresses are not allowed.";
    }
    const formattedContact = formatContactWithCountryCode(contact);
    if (!formattedContact) {
      errors.contact = "Enter a valid 10-digit Indian mobile number.";
    }
    if (!validateDOB(dob)) {
      errors.dob = "Enter a valid date of birth (age must be between 1 and 120).";
    }
    if (!validatePassword(password)) {
      errors.password = "At least 8 characters, with letters and numbers.";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return { errors, normalizedEmail, formattedContact };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");
    const { errors, normalizedEmail, formattedContact } = runValidation();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await signup({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        contactNumber: formattedContact,
        dob,
        password,
      });
      setSuccessMsg(
        `Account created. We've sent a verification email to ${normalizedEmail}.`
      );
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setFormError("An account with this email already exists.");
      } else if (err.code === "auth/weak-password") {
        setFormError("Password is too weak. Choose a stronger password.");
      } else {
        setFormError("Failed to create account. Please try again.");
      }
      setLoading(false);
    }
  }

  function renderError(key) {
    if (!fieldErrors[key]) return null;
    return <p className="mt-1 text-xs text-red-600">{fieldErrors[key]}</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          InsureEnsure
        </h1>
        <p className="text-center text-gray-500 mb-6">Create your account</p>

        {formError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {formError}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={fieldErrors.firstName ? errorInputClass : inputClass}
                placeholder="John"
              />
              {renderError("firstName")}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={fieldErrors.lastName ? errorInputClass : inputClass}
                placeholder="Doe"
              />
              {renderError("lastName")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldErrors.email ? errorInputClass : inputClass}
              placeholder="you@example.com"
            />
            {renderError("email")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">
                +91
              </span>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={`${
                  fieldErrors.contact ? errorInputClass : inputClass
                } rounded-l-none`}
                placeholder="9876543210"
                maxLength={10}
              />
            </div>
            {renderError("contact")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              max={todayISO}
              onChange={(e) => setDob(e.target.value)}
              className={fieldErrors.dob ? errorInputClass : inputClass}
            />
            {renderError("dob")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldErrors.password ? errorInputClass : inputClass}
              placeholder="At least 8 characters, letters + numbers"
            />
            {renderError("password")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={
                fieldErrors.confirmPassword ? errorInputClass : inputClass
              }
              placeholder="Re-enter your password"
            />
            {renderError("confirmPassword")}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
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
