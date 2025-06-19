const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://localhost:27017/Login-tut');

// Check if the connection is successful

connect.then (() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

//create a schema for the user

const LoginSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true
     },
     password: {
        type: String,
        required: true
     }
});

//collection part
const collection = new mongoose.model('users', LoginSchema);

//export the collection
module.exports = collection;