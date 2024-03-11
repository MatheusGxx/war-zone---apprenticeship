import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "icons/", (error) => {
      if (error) {
        cb(error, null)
      }
    })
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname), (error) => {
      if (error) {
        cb(error, null)
      }
    })
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type'), false)
  }
}

const limits = {
  fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
}

const uploadIcons = multer({ storage, fileFilter, limits })

export default uploadIcons
