import React, { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

type PropTypes = {
  pdf: string
  width: number
  height: number
  setPng: (d: string) => unknown
}

export default function PdfToPngComponent({
  pdf: pdfBase64,
  width,
  height,
  setPng
}: PropTypes) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pngDataUrl, setPngDataUrl] = useState<string | null>()

  useEffect(() => {
    if (!pdfBase64) {
      setPngDataUrl(null)
      return
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.1.91/build/pdf.worker.min.mjs`

    const pdfData = base64ToUint8Array(pdfBase64.split(',')[1]) // Load the PDF document.

    ;(async () => {
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise
      const page = await pdf.getPage(1)

      const scale = 2 // Increase scale for higher resolution.
      const viewport = page.getViewport({ scale })
      let canvas = canvasRef.current
      if (!canvas) return
      const context = canvas.getContext('2d')
      canvas.width = viewport.width
      canvas.height = viewport.height

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }

      // Render the page into the canvas context.
      await page.render(renderContext).promise

      canvas = canvasRef.current
      if (!canvas) return
      // Convert the canvas content to a PNG data URL.
      const pngData = canvas.toDataURL('image/png')
      setPngDataUrl(pngData)
    })()
  }, [pdfBase64])

  useEffect(() => {
    if (pngDataUrl) setPng(pngDataUrl)
  }, [pngDataUrl])

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {pngDataUrl ? (
        <img
          src={pngDataUrl}
          height={height}
          style={{
            objectFit: 'contain',
            width: 'fit-content',
            alignContent: 'start'
          }}
          alt="Converted from PDF"
        />
      ) : (
        <p>Loading and converting PDF...</p>
      )}
    </div>
  )
}

// Utility function to convert a base64 string to Uint8Array.
const base64ToUint8Array = (base64: string) => {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}
