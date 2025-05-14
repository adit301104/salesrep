// routes/formRoutes.js - Enhanced Form Routes
const express = require('express');
const {
  submitForm,
  getForms,
  getFormsByType,
  getForm,
  updateForm,
  deleteForm,
  searchForms
} = require('../controllers/formController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/uploadHandler');

const router = express.Router();

// Debug middleware specific to form routes
router.use((req, res, next) => {
  console.log(`[FORM ROUTE] ${req.method} ${req.originalUrl}`, 
    req.body ? `Body: ${JSON.stringify(req.body).substring(0, 100)}...` : '');
  next();
});

// Apply authentication to all routes
router.use(protect);

// Basic form routes
router.route('/')
  .get(getForms)
  .post(upload.array('attachments', 5), submitForm);

// Search forms
router.post('/search', searchForms);

// Form type specific routes
router.get('/type/:formType', getFormsByType);

// Individual form routes
router.route('/:id')
  .get(getForm)
  .put(upload.array('attachments', 5), updateForm)
  .delete(deleteForm);

module.exports = router;