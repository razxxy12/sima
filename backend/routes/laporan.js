const router = require('express').Router();
const laporanController = require('../controllers/laporanController');
const { authenticate } = require('../middleware/auth');
const { uploadLaporan } = require('../middleware/upload');
router.get('/', authenticate, laporanController.getAll);
router.post('/upload', authenticate, uploadLaporan, laporanController.upload);
router.put('/:id/status', authenticate, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Hanya admin' });
  next();
}, laporanController.updateStatus);
module.exports = router;