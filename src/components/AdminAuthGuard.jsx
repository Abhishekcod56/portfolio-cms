"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentAdmin } from "../lib/authApi";

const AdminAuthGuard = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        await getCurrentAdmin();
        setChecking(false);
      } catch (error) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        router.replace(
          `/admin/login?redirect=${encodeURIComponent(
            pathname
          )}`
        );
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

          <p className="mt-4 text-sm text-gray-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminAuthGuard;