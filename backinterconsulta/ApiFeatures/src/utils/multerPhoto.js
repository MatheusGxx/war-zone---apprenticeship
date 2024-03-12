import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/'
    const err = mkdirSync(uploadDir) || null
    cb(err, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

function mkdirSync(path) {
  try {
    fs.mkdirSync(path)
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
  return null
}

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type'), false)
  }
}

const uploadLimits = {
  fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
}

const uploadPhotos = multer({ storage, fileFilter, limits: uploadLimits })

export default uploadPhotos
