// fetch() can't report upload progress, so we use XMLHttpRequest instead.
// Aborting the signal stops the upload (used by the cancel buttons).
export function putFileWithProgress(
  url: string,
  file: File,
  signal: AbortSignal,
  onProgress: (loadedBytes: number) => void
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open("PUT", url)
    xhr.setRequestHeader("Content-Type", file.type)
    xhr.upload.onprogress = (event) => onProgress(event.loaded)
    xhr.onload = () =>
      xhr.status < 300 ? resolve() : reject(new Error("Upload failed."))
    xhr.onerror = () => reject(new Error("Network error."))
    xhr.onabort = () => reject(new Error("Upload canceled."))
    signal.onabort = () => xhr.abort()

    // Canceled while we were still waiting for the upload URL.
    if (signal.aborted) return reject(new Error("Upload canceled."))
    xhr.send(file)
  })
}
