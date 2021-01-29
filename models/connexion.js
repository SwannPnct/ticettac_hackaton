var mongoose = require('mongoose');

// useNewUrlParser ;)
var options = {
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true
   };

mongoose.connect('mongodb+srv://npoyet:admin@cluster0.mgo4x.mongodb.net/hackaton',
   options,
   function(err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info('*** Database Hackaton connection : Success ***');
    }
   }
);