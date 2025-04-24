import React, { useEffect } from 'react'
import { type FC } from 'react'

import { Retool } from '@tryretool/custom-component-support'
import PdfToPngComponent from './components/PdfToPng'

import './output.css'
import { ImageSelectorComponent } from './components/ImageSelector'

export function PdfToPng() {
  const [pdf, setPdf] = Retool.useStateString({
    name: 'Pdf base64'
  })
  const [width] = Retool.useStateNumber({
    name: 'Width'
  })
  const [height] = Retool.useStateNumber({
    name: 'Height'
  })

  const [png, setPng] = Retool.useStateString({
    name: 'png',
    inspector: 'hidden'
  })

  const onCancel = Retool.useEventCallback({ name: 'onCancel' })
  const onZoom = Retool.useEventCallback({ name: 'onZoom' })

  return (
    <PdfToPngComponent
      pdf={pdf}
      width={width}
      height={height}
      setPng={setPng}
      onCancel={onCancel}
      onZoom={onZoom}
    />
  )
}

export function ImageSelector() {
  const [pdf, setPdf] = Retool.useStateString({
    name: 'Pdf base64'
  })
  const [width] = Retool.useStateNumber({
    name: 'Width'
  })
  const [height] = Retool.useStateNumber({
    name: 'Height'
  })

  const [pngBase64s, setPngBase64s] = Retool.useStateArray({
    name: 'pngBase64s',
    initialValue: []
  })
  const [selected, setSelected] = Retool.useStateString({
    name: 'selected',
    inspector: 'hidden',
    initialValue: ''
  })
  const [imageBase64s, setImageBase64s] = Retool.useStateArray({
    name: 'imageBase64s',
    initialValue: []
  })

  const onCancelPdf = Retool.useEventCallback({ name: 'onCancelPdf' })
  const onCancelAttach = Retool.useEventCallback({ name: 'onCancelAttach' })
  const onZoom = Retool.useEventCallback({ name: 'onZoom' })

  return (
    <ImageSelectorComponent
      pdf={pdf}
      width={width}
      height={height}
      setSelected={setSelected}
      onCancelPdf={onCancelPdf}
      onCancelAttach={onCancelAttach}
      onZoom={onZoom}
      pngBase64s={pngBase64s as string[]}
      imageBase64s={imageBase64s as string[]}
      setImageBase64s={setImageBase64s}
    />
  )
}
