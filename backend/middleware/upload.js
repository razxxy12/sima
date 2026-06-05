const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const BASE_DIR = path.join(__dirname, '..', 'uploads');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir(path.join(BASE_DIR, 'foto'));
ensureDir(path.join(BASE_DIR, 'laporan'));

const storageLaporan = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(BASE_DIR, 'laporan');
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const storageFoto = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(BASE_DIR, 'foto');
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.mimetype.startsWith('image/') ? 'uploads/foto' : 'uploads/laporan';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024  // 10 MB — naikkan sesuai kebutuhan
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

module.exports = upload;

// Export middleware SIAP PAKAI (sudah .single() di sini)
exports.uploadLaporan = multer({ storage: storageLaporan, limits: { fileSize: 10 * 1024 * 1024 } }).single('file');
exports.uploadFoto    = multer({ storage: storageFoto,    limits: { fileSize: 2  * 1024 * 1024 } }).single('foto');
