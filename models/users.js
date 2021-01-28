const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    email : String,
    password : String,
    bookings : [{type: mongoose.Schema.Types.ObjectId, ref: 'journey'}]
})


const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;