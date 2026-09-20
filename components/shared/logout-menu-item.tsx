"use client"

import { useQueryClient } from "@tanstack/react-query"
import { LoaderCircle, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { authClient } from "@/lib/auth/client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"

export function LogoutMenuItem() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const queryClient = useQueryClient()
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

      queryClient.clear()
      router.replace("/login")
      router.refresh()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <DropdownMenuItem
      className="cursor-pointer px-2 py-2"
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
