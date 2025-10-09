import { CookingPot } from "lucide-react";
import { Outlet } from "react-router";
export default function AppShell() {

  return (
    <div className="min-h-screen container mx-auto px-3 py-5">
      <header className="flex items-center justify-center mb-5 text-orange-500 gap-3">
        <CookingPot className="h-10 w-10" />
        <h1 className="text-3xl font-bold">Bếp AI</h1>
      </header>
      <Outlet />
    </div>
  );
}
