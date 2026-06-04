const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadLaporan } = require('../middleware/upload'); // ← destructure
const laporanController = require('../controllers/laporanController');

// uploadLaporan adalah objek multer, panggil .single() untuk dapat middleware-nya
router.post('/upload', auth, uploadLaporan.single('file'), laporanController.uploadLaporan);
router.get('/', auth, laporanController.getLaporan);
router.put('/:id/status', auth, laporanController.updateStatus);

module.exports = router;
