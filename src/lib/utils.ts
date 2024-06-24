import type { Buffer } from 'buffer'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculatePercentage(uploaded: number[], downloaded: number[]) {
  let percentage = 0
  if (uploaded) {
    percentage += (uploaded[0] * 50) / uploaded[1]
  }
  if (downloaded) {
    percentage += (uploaded[0] * 50) / uploaded[1]
  }
  return percentage
}

export async function downloadBuffer(buffer: Buffer, mimeType: string, outputFilename: string) {
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
