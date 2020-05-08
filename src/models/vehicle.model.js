let mongoose = require('mongoose');

let VehicleSchema = new mongoose.Schema({
  vNo: {
    type: String,
    required: true,
    unique: true
  },
  model: {
    type: String,
    required: true
  },
  isBooked: {
      type: Boolean
  }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
