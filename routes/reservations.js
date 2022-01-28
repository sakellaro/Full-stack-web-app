const express = require('express');
const router = express.Router();

const room = require('../models/rooms');
const booking = require('../models/booking');

router.get('/', (req, res) => {
    room.find({}, (err,room)=>{
      if (err) console.log(err)
      else{
        let roomsAreReserved = new Object();
        room.forEach(el=>{
          let dates = new Array();
          booking.find({room:el.name},(err,book)=>{
            book.forEach(el=>{
              dates.push({"arrivalDate":el.arrivalDate, "departureDate":el.departureDate});
            });
          });
          roomsAreReserved[el.name]=dates;
        });
        setTimeout(()=>{
          console.log(roomsAreReserved);
          res.render('bookRoomReservation',{
            rooms: room,
            roomsAreReserved: roomsAreReserved
          });
        }, 1000);
      }
    });
  });
  

module.exports = router;