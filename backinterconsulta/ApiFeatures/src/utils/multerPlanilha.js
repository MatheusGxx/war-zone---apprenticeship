import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "planilhas/"); // Pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = Date.now() + extname;
    cb(null, filename);
  },
});

const uploadPlanilha = multer({ storage });

export default uploadPlanilha
