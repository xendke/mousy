import React, { useState } from 'react'
import ReactCrop from 'react-image-crop'

const getCroppedImg = (image, crop) => {
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
        // blob.name = fileName
        resolve(blob)
      },
      'image/jpeg',
      1
    )
  })
}

const ImageCropper = ({ src, getImageBlob }) => {
  const [crop, setCrop] = useState({ aspect: 1 / 1 })
  const [imageRef, setImageRef] = useState(null)

  return (
    <ReactCrop
      src={src}
      crop={crop}
      crossorigin="anonymous"
      onChange={(newCrop) => setCrop(newCrop)}
      onDragEnd={() => {
        if (!imageRef) return
        getCroppedImg(imageRef, crop).then((blob) => {
          getImageBlob(blob)
        })
      }}
      onImageLoaded={(image) => {
        setImageRef(image)
      }}
      circularCrop
    />
  )
}

export default ImageCropper
