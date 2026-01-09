"use client"

import { Button } from "../ui/button";
import { logoutAction } from "./action";

export default function LogoutForm() {
  return (
    <form action={logoutAction}>
      <Button type="submit">Logout</Button>
    </form>
  )
}
