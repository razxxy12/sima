const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const storage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '..', 'uploads', folder);
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const uploadFoto    = multer({ storage: storage('foto'),    limits: { fileSize: 5  * 1024 * 1024 } });
const uploadLaporan = multer({ storage: storage('laporan'), limits: { fileSize: 20 * 1024 * 1024 } });

module.exports = { uploadFoto, uploadLaporan };
