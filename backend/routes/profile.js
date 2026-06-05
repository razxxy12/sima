const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/upload');
const profileController = require('../controllers/profileController');
const { authenticate: auth } = require('../middleware/auth');

const uploadFotoMiddleware = (req, res, next) => {
  upload.single('foto')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Foto terlalu besar. Maksimal 10 MB.' });
      }
      return res.status(400).json({ message: err.message });
    }
    if (err) return res.status(500).json({ message: 'Upload gagal' });
    next();
  });
};

router.get('/', auth, profileController.getProfile);
router.put('/', auth, profileController.updateProfile);
router.post('/foto', auth, uploadFotoMiddleware, profileController.uploadFoto);
router.delete('/foto', auth, profileController.deleteFoto);
router.put('/password', auth, profileController.changePassword);

module.exports = router;