const router = require('express').Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');
const { uploadFoto }   = require('../middleware/upload');

router.get('/',       authenticate, profileController.getProfile);
router.put('/',       authenticate, profileController.updateProfile);
router.put('/password', authenticate, profileController.changePassword);

// uploadFoto sudah middleware siap pakai, TIDAK perlu .single() lagi
router.post('/foto',  authenticate, uploadFoto, profileController.uploadFoto);
router.delete('/foto', authenticate, profileController.deleteFoto);

module.exports = router;
