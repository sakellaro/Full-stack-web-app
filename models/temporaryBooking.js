const mongoose = require('mongoose');

const temporaryBookingSchema = new mongoose.Schema({
    room: {
        type: String
    },
    possibleArrivalDate: {
        type: String
    },
    possibleDepartureDate: {
        type: String
    }
});

module.exports = mongoose.model('temporaryBooking', temporaryBookingSchema);