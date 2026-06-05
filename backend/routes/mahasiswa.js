const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');
const { authenticate: auth } = require('../middleware/auth');

router.get('/', auth, mahasiswaController.getAll);
router.get('/:id', auth, mahasiswaController.getById);
router.post('/', auth, mahasiswaController.create);
router.put('/:id', auth, mahasiswaController.update);
router.delete('/:id', auth, mahasiswaController.remove);

module.exports = router;