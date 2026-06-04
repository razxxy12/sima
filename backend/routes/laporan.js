const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadLaporan } = require('../middleware/upload');
const laporanController = require('../controllers/laporanController');

router.post('/upload', auth, uploadLaporan.single('file'), laporanController.upload);
router.get('/', auth, laporanController.getAll);
router.put('/:id/status', auth, laporanController.updateStatus);

module.exports = router;
