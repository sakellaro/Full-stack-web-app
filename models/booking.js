const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: String, 
        required: true
    },
    room: {
        type: String, 
        required: true
    },
    arrivalDate: {
        type: String, 
        required: true
    },
    departureDate: {
        type: String, 
        required: true
    }
});

module.exports = mongoose.model('booking', bookingSchema);