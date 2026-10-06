"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "../lib/authApi";

const AdminSidebar = ({ mobile = false, onNavigate }) => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard"
    },
    {
      name: "About",
      href: "/admin/about"
    },
    {
      name: "Skills",
      href: "/admin/skills"
    },
    {
      name: "Projects",
      href: "/admin/projects"
    },
    {
      name: "Experience",
      href: "/admin/experience"
    },
    {
      name: "Services",
      href: "/admin/services"
    },
    {
      name: "Testimonials",
      href: "/admin/testimonials"
    },
    {
      name: "Blogs",
      href: "/admin/blogs"
    },
    {
      name: "Messages",
      href: "/admin/messages"
    },
    {
      name: "Media",
      href: "/admin/media"
    },
    {
      name: "Settings",
      href: "/admin/settings"
    }
  ];

  const handleLogout = () => {
    logoutAdmin();

    if (onNavigate) {
      onNavigate();
    }

    router.push("/admin/login");
  };

  return (
    <aside
      className={
        mobile
          ? "h-full w-72 bg-white"
          : "fixed left-0 top-0 z-50 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block"
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 px-6 py-6">
          <Link
            href="/admin/dashboard"
            onClick={onNavigate}
            className="text-xl font-bold text-gray-900"
          >
            Portfolio CMS
          </Link>

          <p className="mt-1 text-xs text-gray-500">
            Administration Panel
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;