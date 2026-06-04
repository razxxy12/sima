const router = require('express').Router();
const mahasiswaController = require('../controllers/mahasiswaController');
const { authenticate, authorize } = require('../middleware/auth');
router.get('/', authenticate, authorize('admin'), mahasiswaController.getAll);
router.get('/:id', authenticate, authorize('admin'), mahasiswaController.getById);
router.post('/', authenticate, authorize('admin'), mahasiswaController.create);
router.put('/:id', authenticate, authorize('admin'), mahasiswaController.update);
router.delete('/:id', authenticate, authorize('admin'), mahasiswaController.remove);
module.exports = router;