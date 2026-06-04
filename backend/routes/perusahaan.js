const router = require('express').Router();
const perusahaanController = require('../controllers/perusahaanController');
const { authenticate, authorize } = require('../middleware/auth');
router.get('/', authenticate, authorize('admin'), perusahaanController.getAll);
router.get('/:id', authenticate, authorize('admin'), perusahaanController.getById);
router.post('/', authenticate, authorize('admin'), perusahaanController.create);
router.put('/:id', authenticate, authorize('admin'), perusahaanController.update);
router.delete('/:id', authenticate, authorize('admin'), perusahaanController.remove);
module.exports = router;