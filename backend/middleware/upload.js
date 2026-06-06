const multer              = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary          = require('../config/cloudinary');

// ── Storage untuk foto profil (gambar) ───────────────────────
const fotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'sima/foto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }],
  },
});

// ── Storage untuk laporan (PDF / DOCX) ───────────────────────
const laporanStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    return {
      folder:        'sima/laporan',
      resource_type: 'raw',          // wajib untuk non-image (PDF, DOCX)
      format:        ext,
      public_id:     `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    };
  },
});

const uploadFoto    = multer({ storage: fotoStorage,    limits: { fileSize: 5  * 1024 * 1024 } });
const uploadLaporan = multer({ storage: laporanStorage, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = { uploadFoto, uploadLaporan };
