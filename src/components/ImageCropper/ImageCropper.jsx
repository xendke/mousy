import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import Loading from '../Loading/Loading'

import './ImageCropper.scss'

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export const getCroppedImg = async (objectUrlImage, crop) => {
  const image = await createImage(objectUrlImage)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 200
  canvas.height = 200

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob)
      },
      'image/jpeg',
      1
    )
  })
}

const ImageCropper = ({ src, getCrop, loading }) => {
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  })
  const [zoom, setZoom] = useState(1.5)

  if (loading) {
    return (
      <div className="ImageCropper">
        <Loading />
      </div>
    )
  }

  return (
    <div className="ImageCropper cropper-container">
      <Cropper
        image={src}
        crop={crop}
        zoom={zoom}
        aspect={1 / 1}
        cropShape="round"
        showGrid={false}
        onZoomChange={setZoom}
        onCropChange={(newCrop) => setCrop(newCrop)}
        onCropComplete={(_, cropInfo) => {
          getCrop(cropInfo)
        }}
      />
    </div>
  )
}

export default ImageCropper
