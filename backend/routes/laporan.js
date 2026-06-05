const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const upload  = require('../middleware/upload');
const laporanController = require('../controllers/laporanController');
const { authenticate: auth } = require('../middleware/auth');

const uploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE')
        return res.status(400).json({ message: 'File terlalu besar. Maksimal 10 MB.' });
      return res.status(400).json({ message: err.message });
    }
    if (err) return res.status(500).json({ message: 'Upload gagal' });
    next();
  });
};

// Route khusus: serve file PDF/DOCX dengan header inline agar browser bisa buka
router.get('/file/:filename', auth, (req, res) => {
  const filename = path.basename(req.params.filename); // sanitasi path traversal
  const filePath = path.join(__dirname, '..', 'uploads', 'laporan', filename);

  if (!fs.existsSync(filePath))
    return res.status(404).json({ message: 'File tidak ditemukan' });

  const ext = path.extname(filename).toLowerCase();
  const mimeMap = {
    '.pdf':  'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  const contentType = mimeMap[ext] || 'application/octet-stream';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  res.sendFile(filePath);
});

router.get('/', auth, laporanController.getAll);
router.post('/upload', auth, uploadMiddleware, laporanController.upload);
router.put('/:id/status', auth, laporanController.updateStatus);

module.exports = router;
