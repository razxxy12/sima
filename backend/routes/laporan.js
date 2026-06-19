const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const { uploadLaporan }              = require('../middleware/upload');
const laporanController              = require('../controllers/laporanController');
const { authenticate: auth, requireAktif } = require('../middleware/auth');

const uploadMiddleware = (req, res, next) => {
  uploadLaporan.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE')
        return res.status(400).json({ message: 'File terlalu besar. Maksimal 10 MB.' });
      return res.status(400).json({ message: err.message });
    }
    if (err) return res.status(500).json({ message: 'Upload gagal: ' + err.message });
    next();
  });
};

router.get('/',           auth,                        laporanController.getAll);
router.post('/upload',    auth, requireAktif, uploadMiddleware, laporanController.upload);
router.put('/:id/status', auth,                        laporanController.updateStatus);
router.delete('/:id',     auth,                        laporanController.delete);

module.exports = router;
