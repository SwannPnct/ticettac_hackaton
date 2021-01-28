var express = require('express');
const { findById } = require('../models/journeys');
var router = express.Router();

var journeyModel = require('../models/journeys');
const UserModel = require('../models/users');

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]



/* GET home page. */
router.get('/', async function(req, res, next) {

  res.render('index', {city});
});

/* POST search page. */
router.post('/search', async function(req, res, next) {

// sécurité à ajouter: mettre tout en minuscule et première lettre en majuscule sur les req.body

  var result = await journeyModel.find({
    departure:req.body.departure,
    arrival:req.body.arrival,
    date:req.body.date
  }) 

  var date = new Date (req.body.date)
  date = date.getDate()+"/"+(date.getMonth()+1)
  

  res.render('search', {city, result, date});
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


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});


router.get('/book-ticket', async (req,res,next) => {
const user = await UserModel.findOneAndUpdate({_id: req.session.connectedId}, {$push: {bookings: req.query.id}})
// tester l'unicité pour pas pousser plusieurs fois le même voyage
  const bookingsInfo = await UserModel.findById(req.session.connectedId)
    .populate('bookings')
    .exec();
  
  
  
    var date = [];
    for (i=0; i<bookingsInfo.bookings.length;i++) {
  date.push(bookingsInfo.bookings[i].date.toLocaleDateString())
    }

  res.render('tickets', {bookings:bookingsInfo.bookings, date})
})

router.get('/confirm-trips', async (req,res,next) => {
  res.redirect('/');
})

router.get('/last-trips', async (req,res,next) => {
  const trips = await UserModel.findById(req.session.connectedId).populate('bookings').exec();
  // to be done
  res.render('lasttrips',{})
})


module.exports = router;