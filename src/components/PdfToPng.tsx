import React, { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

type PropTypes = {
  pdf: string
  width: number
  height: number
  setPng: (d: string) => unknown
  onCancel: () => unknown
  onZoom: () => unknown
}

export default function PdfToPngComponent({
  pdf: pdfBase64,
  width,
  height,
  setPng,
  onCancel,
  onZoom
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

      if (!context) return

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
    <div className="relative w-fit mt-[8px] ">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {pngDataUrl ? (
        <>
          <img
            src={pngDataUrl}
            style={{ width, height }}
            className=" object-cover content-start rounded-[12px]"
            alt="Converted from PDF"
          />
          <div
            onClick={onZoom}
            className="absolute top-[0px] left-[0px] rounded-[12px] overflow-hidden w-full h-full bg-[#dddc] opacity-0 hover:opacity-100 backdrop-blur-none duration-200 cursor-pointer grid place-items-center"
          >
            <div className=" w-[30px] h-[30px]">
              <svg
                stroke="currentColor"
                fill="#000"
                strokeWidth="0"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M396.795 396.8H320V448h128V320h-51.205zM396.8 115.205V192H448V64H320v51.205zM115.205 115.2H192V64H64v128h51.205zM115.2 396.795V320H64v128h128v-51.205z"></path>
              </svg>
            </div>
          </div>
          <div
            className=" absolute p-2 w-[20px] h-[20px] -top-[10px] -right-[10px] rounded-full bg-[#eee] hover:bg-[#ccc] cursor-pointer duration-200"
            onClick={onCancel}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M278.6 256l68.2-68.2c6.2-6.2 6.2-16.4 0-22.6-6.2-6.2-16.4-6.2-22.6 0L256 233.4l-68.2-68.2c-6.2-6.2-16.4-6.2-22.6 0-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3l68.2 68.2-68.2 68.2c-3.1 3.1-4.7 7.2-4.7 11.3 0 4.1 1.6 8.2 4.7 11.3 6.2 6.2 16.4 6.2 22.6 0l68.2-68.2 68.2 68.2c6.2 6.2 16.4 6.2 22.6 0 6.2-6.2 6.2-16.4 0-22.6L278.6 256z"></path>
            </svg>
          </div>
        </>
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
