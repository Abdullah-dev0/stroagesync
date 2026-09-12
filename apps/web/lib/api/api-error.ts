import { BetterFetchError } from "@better-fetch/fetch"

type ApiErrorResponse = {
  message: string
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  )
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof BetterFetchError)) {
    return fallback
  }

  const responseError: unknown = error.error

  return isApiErrorResponse(responseError) ? responseError.message : fallback
}
