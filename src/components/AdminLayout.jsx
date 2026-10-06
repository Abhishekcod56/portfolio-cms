"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminAuthGuard from "./AdminAuthGuard";

const AdminLayout = ({ children }) => {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const isLoginPage =
    pathname === "/admin/login";

  if (isLoginPage) {
    return children;
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMobileMenu}
              className="absolute inset-0 bg-black/40"
            />

            <div className="relative h-full">
              <AdminSidebar
                mobile
                onNavigate={closeMobileMenu}
              />

              <button
                type="button"
                onClick={closeMobileMenu}
                className="absolute right-4 top-5 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-xl"
                aria-label="Close menu"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="lg:ml-64">
          <AdminHeader
            onMenuClick={() =>
              setMobileMenuOpen(true)
            }
          />

          <main className="p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
};

export default AdminLayout;