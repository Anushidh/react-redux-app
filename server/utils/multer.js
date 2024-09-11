import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('inside destination')
      cb(null, path.join(__dirname, '../assets'));
    },
    filename: (req, file, cb) => {
        console.log('inside filename')
      cb(null, Date.now() + file.originalname);
    },
  });

const upload = multer({storage:storage})

export default upload