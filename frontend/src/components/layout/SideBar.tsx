import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Projects", icon: FolderKanban, to: "/projects" },
  { label: "Admin", icon: Settings, to: "/admin" },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 h-screen border-r bg-background p-4">
      <h2 className="text-2xl font-semibold mb-6">ImpactStream</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map(({ label, icon: Icon, to }) => (
          <Link
            to={to}
            key={to}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition",
              pathname === to && "bg-muted text-primary font-semibold"
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
