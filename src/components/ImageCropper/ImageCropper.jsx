import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import Loading from '../Loading/Loading'

import './ImageCropper.scss'

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
