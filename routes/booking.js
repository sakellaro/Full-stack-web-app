const express = require('express');
const router = express.Router();

const room = require('../models/rooms');
const booking = require('../models/booking');
const temporaryBooking = require('../models/temporaryBooking');
const minutes = 1000 * 60;
const hours = minutes * 60;
const days = hours * 24;

router.get('/', (req, res) => {
  room.find({}, (err,rooms) => {
    if (err) console.log(err.message);
    else {
      res.render('booking', {
        rooms: rooms,
        bookConditions: [true, false],
        dates: ["", ""],
        selectedForMaxGuests: [true, false, false, false, false, false],
        selectedForLuxury: [true, false, false]
      });
    }
  });
});

router.post('/', (req,res) => {

  let deluxe;
  if (req.body.deluxe==="Deluxe") deluxe=true;
  else deluxe=false;

  let ardate = req.body.ardate;
  let dedate = req.body.dedate;
  let arrivalDate = ardate.split("-");
  let departureDate = dedate.split("-");
  let arrivalDateYear = parseInt(arrivalDate[0]);
  let arrivalDateMonth = parseInt(arrivalDate[1]-1);
  let arrivalDateDay = parseInt(arrivalDate[2]);
  let departureDateYear = parseInt(departureDate[0]);
  let departureDateMonth = parseInt(departureDate[1]-1);
  let departureDateDay = parseInt(departureDate[2]);
  let arrivalDateInDays = Math.round(new Date(arrivalDateYear, arrivalDateMonth, arrivalDateDay).getTime()/days);
  let departureDateInDays = Math.round(new Date(departureDateYear, departureDateMonth, departureDateDay).getTime()/days);
  let totalDays = departureDateInDays - arrivalDateInDays;

  let promiseForFindingRooms = new Promise((resolve,reject)=>{
    room.find({}, async (err,rooms) => {
      if (err) {
        console.log(err);
        reject();
      }
      else {

        let promisesArray = new Array();
        rooms.forEach( elem => {

          /////////////
          // Total Price and Price Per Night calculation for each room, according to the departure and arrival dates
          /////////////
          let totalPrice = 0;
          let pricePerNight;
          let start = false;
          let currentDay;
          elem.prices.forEach(el=>{
            let startDate = el.date_start.split("/");
            let startDateYear = parseInt(startDate[2]);
            let startDateMonth = parseInt(startDate[1]-1);
            let startDateDay = parseInt(startDate[0]);
            let endDate = el.date_end.split("/");
            let endDateYear = parseInt(endDate[2]);
            let endDateMonth = parseInt(endDate[1]-1);
            let endDateDay = parseInt(endDate[0]);
            let startDateInDays = Math.round(new Date(startDateYear, startDateMonth, startDateDay).getTime()/days);
            let endDateInDays = Math.round(new Date(endDateYear, endDateMonth, endDateDay).getTime()/days);
            let price = parseInt(el.price.split("€")[0]) ;
            if (arrivalDateInDays >= startDateInDays && arrivalDateInDays < endDateInDays){
              start = true;
              currentDay = arrivalDateInDays;
              while (true){
                totalPrice = totalPrice + price ;
                currentDay++ ;
                if (currentDay === departureDateInDays) {
                  pricePerNight = Math.round(totalPrice / totalDays) ;
                  start = false;
                  break;
                }
                else if (currentDay === endDateInDays) break;
              }
            }
            else if (start) {
              while (true){
                totalPrice = totalPrice + price;
                currentDay++ ;
                if (currentDay === departureDateInDays) {
                  pricePerNight = Math.round(totalPrice / totalDays) ;
                  start = false;
                  break;
                }
                else if (currentDay === endDateInDays) break;
              }
            }
          });

          promisesArray.push(new Promise(async (res,rej) => {

            try {
              /////////////
              // Each room will be available
              /////////////
              await room.updateOne(
                { name: elem.name }, 
                { $set:
                  {
                    available: true
                  }
                }
              )

              /////////////
              // Price Per Night and Total Price have been assigned to each room
              /////////////
              await room.updateOne(
                { name: elem.name },
                { $set:
                  { 
                    pricePerNight: pricePerNight,
                    totalPrice: totalPrice
                  }
                }
              )

              res()
            }
            catch (error) {
              console.log(error)
              rej()
            }
            
          }))

        })

        try {
          await Promise.all(promisesArray)
          resolve(promisesArray)
        } catch (err) {
          console.log(err)
        }
        
      }
    });
  });

  promiseForFindingRooms.then(()=>{
    let promiseForFindingBookings = new Promise((resolve,reject)=>{

      /////////////
      // After availability has been assigned for all rooms, each one that is reserved will be unavailable
      /////////////
      booking.find({}, async (err,booking) => {
        if (err) {
          console.log(err);
          reject();
        }
        else {
          let promisesArray = new Array();
          booking.forEach(async (el) => {
            let bookStartsList = el.arrivalDate.split('-');
            let bookStarts = Math.round(new Date(parseInt(bookStartsList[0]), parseInt(bookStartsList[1])-1, parseInt(bookStartsList[2])).getTime()/days);
            let bookEndsList = el.departureDate.split('-');
            let bookEnds = Math.round(new Date(parseInt(bookEndsList[0]), parseInt(bookEndsList[1])-1, parseInt(bookEndsList[2])).getTime()/days);
            if (!(departureDateInDays <= bookStarts || arrivalDateInDays >= bookEnds)){
              
              promisesArray.push(new Promise(async (res,rej) => {
                try {
                  await room.updateOne(
                    { name: el.room }, 
                    { $set:
                      {
                        available: false
                      }
                    }
                  )
                  res();
                } catch (err){
                  console.log(err)
                  rej()
                }
              }))
            }
          });
          try {
            await Promise.all(promisesArray)
            resolve(promisesArray)
          } catch (err) {
            console.log(err)
          }
        }
      });
    })
    
    promiseForFindingBookings.then(()=>{

      /////////////
      // After Price Per Night Total Price and availability/unavailability have been assigned for each room, booking pug will be rendered
      /////////////
      if (req.body.max_guests==="All" && req.body.deluxe==="All"){
        room.find({available:true}, (err,rooms) => {
          if (err) console.log(err.message);
          else {
              res.render('booking', {
              rooms: rooms,
              bookConditions: [true, true],
              dates: [ardate, dedate],
              selectedForMaxGuests: [true, false, false, false, false, false],
              selectedForLuxury: [true, false, false]
            });
          }
        });
      }
      else if (req.body.max_guests==="All"){
        room.find({ $and: [{deluxe:deluxe}, {available:true}]}, (err,rooms) => {
        if (err) console.log(err.message);
        else {
          res.render('booking', {
            rooms: rooms,
            bookConditions: [true, true],
            dates: [ardate, dedate],
            selectedForMaxGuests: [true, false, false, false, false, false],
            selectedForLuxury: [false, deluxe, !deluxe]
            });
          }
        });
      }
      else if (req.body.deluxe==="All"){
        let position=[];
        for (let i=0; i<=4; i++) {
          if (parseInt(req.body.max_guests)===(i+1)) position[i]=true
          else position[i]=false;
        }
        room.find({$and: [{max_guests:parseInt(req.body.max_guests)}, {available:true}]}, (err,rooms) => {
        if (err) console.log(err.message);
        else {
          res.render('booking', {
            rooms: rooms,
            bookConditions: [true, true],
            dates: [ardate, dedate],
            selectedForMaxGuests: [false, position[0], position[1], position[2], position[3], position[4]],
            selectedForLuxury: [true, false, false]
            });
          }
        });
      }
      else {
        let position=[];
        for (let i=0; i<=4; i++) {
        if (parseInt(req.body.max_guests)===(i+1)) position[i]=true
        else position[i]=false;
        }
        room.find({$and: [{max_guests:parseInt(req.body.max_guests)},{deluxe:deluxe},{available:true}]}, (err,rooms) => {
        if (err) console.log(err.message);
        else {
          res.render('booking', {
            rooms: rooms,
            bookConditions: [true, true],
            dates: [ardate, dedate],
            selectedForMaxGuests: [false, position[0], position[1], position[2], position[3], position[4]],
            selectedForLuxury: [false, deluxe, !deluxe]
            });
          }
        });
      }
    })
  })

  /////////////
  // After temporaryBooking collection is cleared, I insert the user's possible desirable arrival and departure date 
  /////////////
  temporaryBooking.remove({})
    .then(()=>{
      temporaryBooking.insertMany([{possibleArrivalDate: ardate, possibleDepartureDate: dedate}]);
    })
    .catch(error => {
      console.log(error);
    });

});

router.get('/:id', (req, res) => {
  const id= req.params.id;
  room.find({_id:id}, (err,rooms)=>{
    if (err) console.log(err);
    else {
      temporaryBooking.updateOne(
        {},
        { $set:
          {
            room: rooms[0].name
          }
        }
      )
      .then(() => {
        temporaryBooking.find({}, (err, temporaryRoomBooking)=>{
          if (err) console.log(err);
          else {
            res.render('booking', {
              rooms: rooms,
              temporaryRoomBooking: temporaryRoomBooking,
              bookConditions: [false, false],
              dates: ["", ""],
              selectedForMaxGuests: [false, false, false, false, false, false],
              selectedForLuxury: [false, false, false]
            })
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
    }
  });
});

module.exports = router;