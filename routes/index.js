var express = require('express');
const { findById } = require('../models/journeys');
var router = express.Router();

var journeyModel = require('../models/journeys');
const UserModel = require('../models/users');

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', {city, isConnected: req.session.connectedId, name: req.session.name});
});

/* POST search page. */
router.post('/search', async function(req, res, next) {

  if (!req.session.connectedId) {
    console.log("here1");
    req.session.savedSearch = req.body;
    res.redirect('/login');
    return;
  }

  if(req.session.savedSearch) {
    console.log("here2");
    req.body = req.session.savedSearch;
    req.session.savedSearch = null;
  }


const departureFormatted = req.body.departure.charAt(0).toUpperCase() + req.body.departure.toLowerCase().slice(1);
const arrivalFormatted = req.body.arrival.charAt(0).toUpperCase() + req.body.arrival.toLowerCase().slice(1);


  var result = await journeyModel.find({
    departure:departureFormatted,
    arrival:arrivalFormatted,
    date:req.body.date
  }) 

  var datetab = []
  for (i=0;i<result.length;i++) {
    datetab.push(parseInt(result[i].departureTime))
  var indexDateMin = datetab.indexOf(Math.min.apply(null,datetab))
  var indexDateMax = datetab.indexOf(Math.max.apply(null,datetab))
  }

  if (result.length > 0) {
  var dateMin = result[indexDateMin].departureTime
  var dateMax = result[indexDateMax].departureTime
  }

  var date = new Date (req.body.date)
  date = date.getDate()+"/"+(date.getMonth()+1)
  
    res.render('search', {city, result, date,isConnected: req.session.connectedId,name: req.session.name,dateMax,dateMin});
});

// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    const departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    const arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newJourney = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25
      });
       
       await newJourney.save();

    }

  }
  res.render('index', { title: 'Express' });
});

router.get('/tickets', async (req,res,next) => {
  if (!req.session.connectedId) {
    res.redirect('/login');
    return;
  }
  if(req.session.pending == undefined){
    req.session.pending = []
  }

  const bookings = [];
for (let i=0;i<req.session.pending.length;i++) {
  const booking = await journeyModel.findById(req.session.pending[i])
  bookings.push(booking);
};
 
    var date = [];
    for (let i=0; i<bookings.length;i++) {
  date.push(bookings[i].date.toLocaleDateString())
    }

  res.render('tickets', {bookings, date,isConnected: req.session.connectedId,name: req.session.name})
});


router.get('/book-ticket', async (req,res,next) => {
  if (!req.session.connectedId) {
    res.redirect('/login');
    return;
  }
if (!req.session.pending) {
  req.session.pending = [];
} 

if (!req.session.pending.includes(req.query.id)) {

req.session.pending.push(req.query.id);

  res.redirect('/tickets')
}  else { res.redirect('/tickets'); 
}});


router.get('/delete-ticket', async function(req, res, next) {
  if (!req.session.connectedId) {
    res.redirect('/login');
    return;
  }
  req.session.pending.splice(req.query.position,1) // à tester
  res.redirect('/tickets');
});


router.get('/confirm-trips', async (req,res,next) => {
  if (!req.session.connectedId) {
    res.redirect('/login');
    return;
  }
  const user = await UserModel.findById(req.session.connectedId);
  console.log(user);
  console.log(req.session.connectedId);
  for (let i=0;i<req.session.pending.length;i++) {
    user.bookings.push(req.session.pending[i]);
  }
  await user.save();
  req.session.pending = [];
  res.redirect('/'); // change here to display the confirmation pop-up
})

router.get('/last-trips', (req,res,next) => {
  res.redirect('/users/last-trips');
})

router.get('/login', (re,res,next) => {
  res.redirect('/users/login')
})

router.get('/disconnect', (re,res,next) => {
  res.redirect('/users/disconnect')
})

module.exports = router;

