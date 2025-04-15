import React from 'react'
import { type FC } from 'react'

import { Retool } from '@tryretool/custom-component-support'
import PdfToPngComponent from './components/PdfToPng'

import './output.css'

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

  return (
    <PdfToPngComponent
      pdf={pdf}
      width={width}
      height={height}
      setPng={setPng}
      onCancel={onCancel}
    />
  )
}

export const HelloWorld: FC = () => {
  const [name, _setName] = Retool.useStateString({
    name: 'name'
  })

  return (
    <div>
      <div>Hello {name}!</div>
    </div>
  )
}
