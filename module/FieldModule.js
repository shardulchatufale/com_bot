const mongoose = require('mongoose');

const fieldTemplateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"creater",
  },
  name: {
    type: String,
    required: true,
    //name is unique for this caption only
  },
  caption: {
    type: String,
    required: true,
  },
  display_location: {
    type: [{
      type: String,
      enum: ['list', 'single'],
    }],
    required: true,
  },
  slug: {
    type: String,
    required: true,
    //slug is unique for a user only
  },
  type: {
    type: String,
    enum: ['string', 'number', 'date', 'date-time'],//*********************************************************** */
    required: true,
  },
  default_: {//************************************************** */
    type:mongoose.Schema.Types.Mixed,
    required: true,
  },
},
{ timestamps: true }
);



module.exports = mongoose.model("field", fieldTemplateSchema)


