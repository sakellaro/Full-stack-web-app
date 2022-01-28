const mongoose = require('mongoose');

const roomsSchema = new mongoose.Schema({
    name: {type: String},
    photos: [{type: String}],
    size: {type: String},
    prices: [{price:{type: String}, date_start:{type: String}, date_end:{type: String}}],
    max_guests: {type: Number},
    bed_type: {type: String},
    deluxe: {type: Boolean},
    description: {type: String},
    services: [{service:{type: String}, icon:{type: String}}],
    pricePerNight: {type: Number},
    totalPrice: {type: Number},
    available: {type: Boolean}
});

module.exports = mongoose.model('rooms', roomsSchema);