var mongoose = require('mongoose')

var journeySchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number,
    status: String,
  });
  
  var journeyModel = mongoose.model('journey', journeySchema);

  module.exports = journeyModel;