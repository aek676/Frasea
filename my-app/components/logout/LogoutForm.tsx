"use client"

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { logoutAction } from "./action";

export default function LogoutForm() {
  return (
    <form action={logoutAction} >
      <Button variant="destructive" type="submit">
        <LogOut />
        Logout
      </Button>
    </form>
  );
}
