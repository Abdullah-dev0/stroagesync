"use client"

import { useState } from "react"
import { LoaderCircle, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/authClient"
import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu"
import { toast } from "@workspace/ui/components/toast"

export function LogoutMenuItem() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    setIsSigningOut(true)

    try {
      const { error } = await authClient.signOut()

      if (error) {
        toast.add({
          type: "error",
          description: error.message || "Logout failed. Please try again.",
        })
        return
      }

      router.replace("/login")
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <DropdownMenuItem
      className="px-2 py-2 cursor-pointer"
      disabled={isSigningOut}
      closeOnClick={false}
      onClick={handleLogout}
    >
      {isSigningOut ? (
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      ) : (
        <LogOut aria-hidden="true" />
      )}
      {isSigningOut ? "Logging out..." : "Log out"}
    </DropdownMenuItem>
  )
}
