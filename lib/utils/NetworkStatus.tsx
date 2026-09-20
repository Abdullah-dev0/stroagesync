"use client"

import { useEffect, useState } from "react"

type ConnectionStatus = "online" | "slow" | "offline"

interface NetworkInformation extends EventTarget {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g"
  downlink?: number
  rtt?: number
  saveData?: boolean
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

export default function NetworkStatus() {
  const [status, setStatus] = useState<ConnectionStatus>("online")

  useEffect(() => {
    const navigatorWithConnection = navigator as NavigatorWithConnection

    const connection =
      navigatorWithConnection.connection ||
      navigatorWithConnection.mozConnection ||
      navigatorWithConnection.webkitConnection

    const checkConnection = () => {
      // Definitely offline
      if (!navigator.onLine) {
        setStatus("offline")
        return
      }

      if (connection) {
        const { effectiveType, downlink, rtt } = connection

        const slow =
          effectiveType === "slow-2g" ||
          effectiveType === "2g" ||
          (downlink !== undefined && downlink < 1) ||
          (rtt !== undefined && rtt > 1000)

        setStatus(slow ? "slow" : "online")
        return
      }

      // Browser doesn't support Network Information API.
      setStatus("online")
    }

    checkConnection()

    window.addEventListener("online", checkConnection)
    window.addEventListener("offline", checkConnection)
    connection?.addEventListener("change", checkConnection)

    return () => {
      window.removeEventListener("online", checkConnection)
      window.removeEventListener("offline", checkConnection)
      connection?.removeEventListener("change", checkConnection)
    }
  }, [])

  if (status === "online") {
    return null
  }

  return (
    <div
      className={
        status === "offline"
          ? "fixed top-0 left-0 z-50 w-full bg-red-600 px-4 py-2 text-center text-sm text-white"
          : "fixed top-0 left-0 z-50 w-full bg-yellow-500 px-4 py-2 text-center text-sm text-black"
      }
    >
      {status === "offline"
        ? "You are offline. Please check your internet connection."
        : "Your internet connection is slow. Some content may take longer to load."}
    </div>
  )
}
