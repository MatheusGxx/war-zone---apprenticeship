import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Generate unique IDs

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'planilhas/'); // Set the destination directory
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname); // Get file extension
    const filename = `${uuidv4()}${extname}`; // Generate unique filename with extension
    cb(null, filename);
  },
});

// Create Multer instance with the storage configuration
const uploadPlanilha = multer({ storage });

export default uploadPlanilha;
