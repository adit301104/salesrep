// models/Form.js
const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  formType: {
    type: String,
    required: true,
    enum: [
      'CaForm1', 'CaForm2', 'CaForm3', 'CaForm4', 'CaForm5', 
      'CaForm6', 'CaForm7', 'CaForm8', 'CaForm9', 'CaForm10',
      'CaForm1Fr', 'CaForm2Fr', 'CaForm3Fr', 'CaForm4Fr', 'CaForm5Fr',
      'CaForm6Fr', 'CaForm7Fr', 'CaForm8Fr', 'CaForm9Fr', 'CaForm10Fr',
      'USForm1', 'USForm2', 'USForm3', 'USForm4', 'USForm5',
      'USForm6', 'USForm7', 'USForm8', 'USForm9', 'USForm10'
    ]
  },
  title: {
    type: String,
    required: true
  },
  // Dynamic fields stored in a flexible structure
  fields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  // For file/image uploads
  attachments: [{
    url: String,
    filename: String,
    mimetype: String,
    size: Number
  }],
  // Metadata
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'processed', 'rejected'],
    default: 'submitted'
  }
}, {
  timestamps: true,
  strict: false // Allows storing arbitrary data not defined in schema
});

// Indexes for better query performance
FormSchema.index({ user: 1, formType: 1, submittedAt: -1 });

// Automatically generate URL for attachments
FormSchema.pre('save', function(next) {
  if (this.attachments && this.attachments.length > 0) {
    this.attachments = this.attachments.map(attachment => {
      if (!attachment.url && attachment.filename) {
        attachment.url = `/uploads/${attachment.filename}`;
      }
      return attachment;
    });
  }
  next();
});

module.exports = mongoose.model('Form', FormSchema);