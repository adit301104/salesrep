// controllers/formController.js
const Form = require('../models/Form');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Submit a form
 * @route   POST /api/forms
 * @access  Private
 */
exports.submitForm = async (req, res, next) => {
  try {
    const { formType, title, fields } = req.body;
    
    // Basic validation
    if (!formType || !title) {
      return next(new ErrorResponse('Form type and title are required', 400));
    }

    // Process uploaded files if any
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size
      }));
    }

    // Create form with dynamic structure
    const form = await Form.create({
      user: req.user.id,
      formType,
      title,
      fields: fields ? new Map(Object.entries(fields)) : new Map(),
      attachments,
      status: 'submitted'
    });

    res.status(201).json({
      success: true,
      data: form
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all forms for current user
 * @route   GET /api/forms
 * @access  Private
 */
exports.getForms = async (req, res, next) => {
  try {
    const forms = await Form.find({ user: req.user.id }).sort('-submittedAt');
    
    res.status(200).json({
      success: true,
      count: forms.length,
      data: forms
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get forms by type
 * @route   GET /api/forms/type/:formType
 * @access  Private
 */
exports.getFormsByType = async (req, res, next) => {
  try {
    const forms = await Form.find({
      user: req.user.id,
      formType: req.params.formType
    }).sort('-submittedAt');
    
    res.status(200).json({
      success: true,
      count: forms.length,
      data: forms
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single form
 * @route   GET /api/forms/:id
 * @access  Private
 */
exports.getForm = async (req, res, next) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!form) {
      return next(new ErrorResponse(`Form not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: form
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update form
 * @route   PUT /api/forms/:id
 * @access  Private
 */
exports.updateForm = async (req, res, next) => {
  try {
    let form = await Form.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!form) {
      return next(new ErrorResponse(`Form not found with id of ${req.params.id}`, 404));
    }
    
    const { title, fields, status } = req.body;
    
    // Update fields
    if (title) form.title = title;
    if (status) form.status = status;
    
    // Update dynamic fields
    if (fields) {
      // Merge existing fields with new ones
      const existingFields = form.fields.toObject() || {};
      const newFields = { ...existingFields, ...fields };
      form.fields = new Map(Object.entries(newFields));
    }
    
    // Process uploaded files if any
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size
      }));
      
      // Combine existing and new attachments
      form.attachments = [...(form.attachments || []), ...newAttachments];
    }
    
    await form.save();
    
    res.status(200).json({
      success: true,
      data: form
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete form
 * @route   DELETE /api/forms/:id
 * @access  Private
 */
exports.deleteForm = async (req, res, next) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!form) {
      return next(new ErrorResponse(`Form not found with id of ${req.params.id}`, 404));
    }
    
    // Delete associated files
    if (form.attachments && form.attachments.length > 0) {
      form.attachments.forEach(attachment => {
        const filePath = path.join(process.env.FILE_UPLOAD_PATH, attachment.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    await form.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Search forms by field values
 * @route   POST /api/forms/search
 * @access  Private
 */
exports.searchForms = async (req, res, next) => {
  try {
    const { formType, fieldName, fieldValue } = req.body;
    
    // Dynamic query construction
    const query = { user: req.user.id };
    if (formType) query.formType = formType;
    
    // For searching within Map fields
    if (fieldName && fieldValue) {
      // For Map field structure
      query[`fields.${fieldName}`] = fieldValue;
    }
    
    const forms = await Form.find(query).sort('-submittedAt');
    
    res.status(200).json({
      success: true,
      count: forms.length,
      data: forms
    });
  } catch (err) {
    next(err);
  }
};