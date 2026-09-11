export function formatFileSize(size: number) {
  if (size === 0) return "0 B"

  const units = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    units.length - 1
  )
  const value = size / 1024 ** i

  return `${i === 0 ? value : value.toFixed(1)} ${units[i]}`
}
