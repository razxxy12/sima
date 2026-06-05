const express = require('express');
const router = express.Router();
const perusahaanController = require('../controllers/perusahaanController');
const { authenticate: auth } = require('../middleware/auth');

router.get('/', auth, perusahaanController.getAll);
router.get('/:id', auth, perusahaanController.getById);
router.post('/', auth, perusahaanController.create);
router.put('/:id', auth, perusahaanController.update);
router.delete('/:id', auth, perusahaanController.remove);

module.exports = router;