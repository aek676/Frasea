"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/services/auth";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result.success) {
        toast.success("Session closed successfully");
        router.push("/login");
      } else {
        toast.error(result.error || "Failed to logout");
      }
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 text-red-600"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16,17 21,12 16,7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Logout
    </Button>
  );
}

