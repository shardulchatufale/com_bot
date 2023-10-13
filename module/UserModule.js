const mongoose = require('mongoose');

// Define the FieldTemplate schema
const fieldTemplateSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
},
  { timestamps: true }
);

// Create the FieldTemplate model
const FieldTemplate = mongoose.model('creater', fieldTemplateSchema);

module.exports = FieldTemplate;
