const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadFoto } = require('../middleware/upload'); // ← destructure
const profileController = require('../controllers/profileController');

router.get('/', auth, profileController.getProfile);
router.put('/', auth, profileController.updateProfile);
router.put('/password', auth, profileController.changePassword);

// uploadFoto adalah objek multer, panggil .single() untuk dapat middleware-nya
router.post('/foto', auth, uploadFoto.single('foto'), profileController.uploadFoto);
router.delete('/foto', auth, profileController.deleteFoto);

module.exports = router;
