"use client";

import { useEffect, useState } from "react";

const AdminHeader = ({ onMenuClick }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("adminUser");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error(
        "Failed to load admin user:",
        error
      );
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition hover:bg-gray-100 lg:hidden"
            aria-label="Open menu"
          >
            <span className="text-xl">
              ☰
            </span>
          </button>

          <div>
            <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
              Admin Panel
            </h1>

            <p className="hidden text-sm text-gray-500 sm:block">
              Manage your portfolio content
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {user?.name || "Administrator"}
          </p>

          <p className="hidden text-xs text-gray-500 sm:block">
            {user?.email || ""}
          </p>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;