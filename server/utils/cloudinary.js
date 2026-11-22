import { v2 as cloudinary } from 'cloudinary' // reads CLOUDINARY_URL automatically

export function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'interiors' }, (err, result) => (err ? reject(err) : resolve(result)))
      .end(buffer)
  })
}

export const destroyImage = (publicId) => cloudinary.uploader.destroy(publicId)