let mongoose = require('mongoose');

let BookingSchema = new mongoose.Schema({
  vNo: {
    type: String,
    required: true,
  },
  custPhoneNo: {
    type: Number,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
