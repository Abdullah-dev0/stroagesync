/**
 * Represents an expected domain or business error that should be safely
 * returned to the client rather than triggering an uncaught exception/error boundary.
 */
export class ActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ActionError"
  }
}
