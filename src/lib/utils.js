export function calculatePercentage(uploaded, downloaded) {
  let percentage = 0
  if (uploaded) {
    percentage += (uploaded[0] * 50) / uploaded[1]
  }
  if (downloaded) {
    percentage += (uploaded[0] * 50) / uploaded[1]
  }
  return percentage
}

export async function downloadBuffer(buffer, mimeType, outputFilename) {
  const blob = new Blob([buffer], {
    type: mimeType,
  })
  const fileLink = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = fileLink
  anchor.download = outputFilename
  anchor.click()
  anchor.remove()

  URL.revokeObjectURL(fileLink)
}
