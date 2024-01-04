const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_CONNECT).then(() => console.log('co')).catch((err) => console.log(`error: ${err}`));