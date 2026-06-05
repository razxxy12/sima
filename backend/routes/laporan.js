const router = require('express').Router();
const laporanController = require('../controllers/laporanController');
const { authenticate }  = require('../middleware/auth');
const { uploadLaporan } = require('../middleware/upload');

router.get('/', authenticate, laporanController.getAll);

// uploadLaporan sudah middleware siap pakai, TIDAK perlu .single() lagi
router.post('/upload', authenticate, uploadLaporan, laporanController.upload);

// Contoh di route laporan
router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File terlalu besar. Maksimal 10 MB.' });
      }
      return res.status(400).json({ message: err.message });
    }
    if (err) return res.status(500).json({ message: 'Upload gagal' });
    next();
  });
}, laporanController.upload);

router.put('/:id/status', authenticate, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Hanya admin' });
  next();
}, laporanController.updateStatus);

module.exports = router;
