let mongoose = require('mongoose');

let CustomerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  custPhoneNo: {
    type: Number,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Customer', CustomerSchema);
