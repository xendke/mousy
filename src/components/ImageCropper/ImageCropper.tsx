import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import cn from 'classnames'
import { Area } from './helpers'
import Loading from '~/components/Loading/Loading'

import styles from './ImageCropper.module.scss'

interface ImageCropperProps {
  src: string
  getCrop: (a: Area) => void
  loading: boolean
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  getCrop,
  loading,
}) => {
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  })
  const [zoom, setZoom] = useState(1.5)

  if (loading) {
    return (
      <div className={styles.ImageCropper}>
        <Loading />
      </div>
    )
  }

  return (
    <div className={cn(styles.ImageCropper, styles.cropperContainer)}>
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
