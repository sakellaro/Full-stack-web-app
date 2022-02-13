const express = require('express');
const router = express.Router();

const room = require('../models/rooms');
const booking = require('../models/booking');

router.get('/', (req, res) => {
  room.find({}, (err,room)=>{
    if (err) console.log(err)
    else {
      let roomsAreReserved = new Object();
      let promisesArray = new Array();
      room.forEach(el=>{
        let dates = new Array();
        promisesArray.push(new Promise((res,rej) => {
          booking.find({room:el.name},(err,book)=>{
            if (err) {
              console.log(err)
              rej();
            }
            else {
              book.forEach(el=>{
                dates.push({"arrivalDate":el.arrivalDate, "departureDate":el.departureDate})
              });
              roomsAreReserved[el.name]=dates
              res()
            }
          });
        }))
      });
      Promise.all(promisesArray).then(() => {
        console.log(roomsAreReserved);
        res.render('bookRoomReservation',{
          rooms: room,
          roomsAreReserved: roomsAreReserved
        });
      });
    }
  });
});
  

module.exports = router;