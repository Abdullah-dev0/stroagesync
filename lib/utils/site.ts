import "server-only"

export const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").trim()

export const siteUrlObject = new URL(siteUrl)
