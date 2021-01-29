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
if (!req.session.pending) {
  req.session.pending = [];
}
if (!req.session.pending.includes(req.query.id)) {

req.session.pending.push(req.query.id);

const bookings = [];
for (i=0;i<req.session.pending.length;i++) {
  const booking = await journeyModel.findById(req.session.pending[i])
  bookings.push(booking);
};
 
    var date = [];
    for (i=0; i<bookings.length;i++) {
  date.push(bookings[i].date.toLocaleDateString())
    }
  
  res.render('tickets', {bookings, date})
} res.redirect('/'); // what behavoir do we want when trip already selected?  
});

router.get('/confirm-trips', async (req,res,next) => {
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

module.exports = router;