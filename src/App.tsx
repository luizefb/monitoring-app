import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { MonitoringProvider } from "@/hooks/useMonitoringData"
import { Layout } from "@/components/layout/Layout"
import { DashboardPage } from "@/pages/DashboardPage"
import { RegisterPage } from "@/pages/RegisterPage"

export default function App() {
  return (
    <BrowserRouter>
      <MonitoringProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="registro" element={<RegisterPage />} />
          </Route>
        </Routes>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#1a1a1a",
              border: "1px solid #e8e4df",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            },
          }}
        />
      </MonitoringProvider>
    </BrowserRouter>
  )
}
