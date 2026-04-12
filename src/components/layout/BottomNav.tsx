import { NavLink } from "react-router-dom"
import { LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [{ to: "/", label: "Dashboard", icon: LayoutDashboard }]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-around">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex min-w-[72px] flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors select-none",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
