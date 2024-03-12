import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Create a directory for storing the signed documents, if it doesn't exist
const SIGNED_DOCUMENTS_DIR = 'SignedDocuments'
if (!fs.existsSync(SIGNED_DOCUMENTS_DIR)) {
  fs.mkdirSync(SIGNED_DOCUMENTS_DIR)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, SIGNED_DOCUMENTS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, Date.now() + ext)
  },
})

const uploadSignedDocuments = multer({ storage })

export default uploadSignedDocuments
