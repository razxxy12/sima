const multer = require('multer');
const path = require('path');

const storageLaporan = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/laporan'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const storageFoto = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/foto'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => cb(null, true);

exports.uploadLaporan = multer({
  storage: storageLaporan,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
}).single('file');

exports.uploadFoto = multer({
  storage: storageFoto,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter
}).single('foto');