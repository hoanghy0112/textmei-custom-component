import React, { useEffect, useState } from 'react'
import PdfToPngComponent from './PdfToPng'

type PropTypes = {
  pdf: string
  width: number
  height: number
  pngBase64s: string[]
  imageBase64s: string[]
  setImageBase64s: (d: string[]) => unknown
  setSelected: (d: string) => unknown
  onCancelPdf: () => unknown
  onCancelAttach: () => unknown
  onZoom: () => unknown
}

export function ImageSelectorComponent({
  pdf,
  width,
  height,
  pngBase64s,
  imageBase64s,
  setImageBase64s,
  setSelected,
  onCancelPdf,
  onCancelAttach,
  onZoom
}: PropTypes) {
  const [png, setPng] = useState<string>('')

  useEffect(() => {
    setImageBase64s([png, ...imageBase64s.slice(1)].filter(d => d))
  }, [png])

  useEffect(() => {
    setImageBase64s([png, ...pngBase64s].filter(d => d))
  }, [JSON.stringify(pngBase64s)])

  return (
    <div className=" flex gap-[20px]">
      {pdf ? (
        <PdfToPngComponent
          pdf={pdf}
          width={width}
          height={height}
          setPng={(png) => {
            setPng(png)
          }}
          onCancel={() => {
            onCancelPdf()
            setImageBase64s(imageBase64s.slice(1).filter(d => d))
          }}
          onZoom={() => {
            onZoom()
            if (png) setSelected(png)
          }}
        />
      ) : null}
      {imageBase64s
        .filter((d) => d !== png)
        .map((base64) => (
          <div key={base64} className="relative w-fit mt-[8px]">
            <img
              src={base64}
              style={{ width, height }}
              className="object-cover w-fit content-start rounded-[12px]"
              alt="Converted from PDF"
            />
            <div
              onClick={() => {
                setSelected(base64)
                onZoom()
              }}
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
              onClick={() => {
                // setSelected(base64)
                setImageBase64s(imageBase64s.filter((d) => d != base64).filter(d => d))
                onCancelAttach()
              }}
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
          </div>
        ))}
    </div>
  )
}
