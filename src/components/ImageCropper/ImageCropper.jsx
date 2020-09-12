import React, { useState } from 'react'
import ReactCrop from 'react-image-crop'

const getCroppedImg = (image, crop) => {
  console.log({ image, crop })
  const canvas = document.createElement('canvas')
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  canvas.width = crop.width
  canvas.height = crop.height
  const ctx = canvas.getContext('2d')

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
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

const ImageCropper = ({ src, grabImageBlob, loading }) => {
  const [crop, setCrop] = useState({
    unit: 'px',
    x: 0,
    y: 0,
    height: 100,
    width: 100,
    aspect: 1 / 1,
  })
  const [imageRef, setImageRef] = useState(null)

  const getCropAndReturnBlob = (ref = null) =>
    getCroppedImg(ref || imageRef, crop).then((blob) => {
      grabImageBlob(blob)
    })

  return (
    <ReactCrop
      src={src}
      crop={crop}
      crossorigin="anonymous"
      keepSelection
      minWidth={100}
      locked={loading}
      onChange={(newCrop) => setCrop(newCrop)}
      onComplete={() => {
        if (!imageRef) return
        getCropAndReturnBlob()
      }}
      onImageLoaded={(image) => {
        setImageRef(image)
        getCropAndReturnBlob(image)
      }}
      circularCrop
    />
  )
}

export default ImageCropper
