let mongoose = require('mongoose');

let CarModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true
  },
  rentPerDay: {
    type: Number,
    required: true
  },
  vehicles: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model('CarModel', CarModelSchema);
