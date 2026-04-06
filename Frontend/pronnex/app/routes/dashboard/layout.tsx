import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-500/50 text-white">
      <Outlet />
    </div>
  );
}