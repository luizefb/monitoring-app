import { Outlet } from "react-router-dom"
import { BottomNav } from "./BottomNav"

export function Layout() {
  return (
    <div className="min-h-dvh bg-background pb-20">
      <main className="mx-auto max-w-xl px-4 py-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
