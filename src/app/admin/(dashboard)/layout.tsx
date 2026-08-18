"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// ─── Sidebar (merged from components/admin/AdminSidebar.tsx) ──────────────────

function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    {
      href: "/admin/emails",
      label: "Emails",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 6-10 7L2 6" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-white/10 bg-white/[0.02] px-4 py-6">
      {/* Brand */}
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00E5E5"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <span className="text-sm font-bold uppercase tracking-[0.1em] text-white">
          Admin Panel
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-[#00E5E5]/10 text-[#00E5E5]"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 transition-colors duration-200 hover:bg-white/5 hover:text-red-400"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
        Log out
      </button>
    </aside>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0B0C10] text-[#E2E8F0]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}