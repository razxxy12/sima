const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ─── Helper: Pastikan folder ada, buat jika belum ────────────────────────────
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// ─── Storage untuk Foto Profil ────────────────────────────────────────────────
const fotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'foto');
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const fotoFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (jpg, jpeg, png, webp) yang diizinkan'), false);
  }
};

const uploadFoto = multer({
  storage: fotoStorage,
  fileFilter: fotoFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// ─── Storage untuk Laporan PDF ────────────────────────────────────────────────
const laporanStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'laporan');
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const laporanFilter = (req, file, cb) => {
  const allowedExt = /pdf|docx/;
  const allowedMime = /application\/pdf|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/;
  const extOk = allowedExt.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowedMime.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF atau DOCX yang diizinkan'), false);
  }
};

const uploadLaporan = multer({
  storage: laporanStorage,
  fileFilter: laporanFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
});

module.exports = { uploadFoto, uploadLaporan };
