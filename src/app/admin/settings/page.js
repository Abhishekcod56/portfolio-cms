"use client";

import { useState } from "react";
import { changeAdminPassword } from "../../../lib/authApi";

export default function SettingsPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      form.newPassword !==
      form.confirmPassword
    ) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    if (form.newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    setSaving(true);

    try {
      await changeAdminPassword(
        form.currentPassword,
        form.newPassword
      );

      setMessage(
        "Password changed successfully."
      );

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      setError(
        error.message ||
          "Failed to change password"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Settings
        </h2>

        <p className="mt-2 text-gray-600">
          Manage your administrator account.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-8">
        <h3 className="mb-6 text-xl font-bold">
          Change Password
        </h3>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Current Password
            </label>

            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm New Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {message && (
            <div className="rounded-lg bg-green-50 p-4 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <button
            disabled={saving}
            className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {saving
              ? "Changing..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}