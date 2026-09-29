"use strict";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, BookOpen, FileText, BarChart, Clock, Terminal, Settings } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: <Home className="h-4 w-4" /> },
  { name: "Incident Console", href: "/console", icon: <Terminal className="h-4 w-4" /> },
  { name: "Memory Explorer", href: "/explorer", icon: <BookOpen className="h-4 w-4" /> },
  { name: "Learning Timeline", href: "/timeline", icon: <Clock className="h-4 w-4" /> },
  { name: "Runbooks", href: "/runbooks", icon: <FileText className="h-4 w-4" /> },
  { name: "Incident History", href: "/history", icon: <Activity className="h-4 w-4" /> },
  { name: "Memory Advantage", href: "/comparison", icon: <BarChart className="h-4 w-4" /> },
  { name: "Settings", href: "/settings", icon: <Settings className="h-4 w-4" /> },
];

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-blue-400">OpsMemory AI</h1>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-700 hover:text-white ${pathname === item.href ? "bg-gray-700 text-white" : "text-gray-400"}`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default AppShell;
