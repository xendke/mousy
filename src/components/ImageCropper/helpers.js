const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

const getCroppedImg = async (objectUrlImage, crop) => {
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

export default getCroppedImg
