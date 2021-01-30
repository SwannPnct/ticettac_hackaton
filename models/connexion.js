var mongoose = require('mongoose');
require('dotenv').config();

// useNewUrlParser ;)
var options = {
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true
   };

mongoose.connect(process.env.DB_CONNECT,
   options,
   function(err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info('*** Database Hackaton connection : Success ***');
    }
   }
);