const express = require('express');
const path = require('path');
const brcypt = require('bcrypt');
const collection = require('./config.js'); // Assuming config.js exports the mongoose model
const { name } = require('ejs');


const app = express();
// convert data into json
app.use(express.json());
// parse urlencoded data
app.use(express.urlencoded({ extended: false }));

// use EJS as the template engine
app.set('view engine','ejs');

// static files
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('login');
});


app.get('/signup', (req, res) => {
    res.render('signup')
});

//register user
app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    }

    // check if the user already exists
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        return res.status(400).send('User already exists');
    } else {
    // hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await brcypt.hash(data.password, saltRounds);
    data.password = hashedPassword; // update the password with the hashed password
         const userdata = await collection.insertMany(data);
    console.log(userdata);
    }

});

// login user 
app.post('/login', async (req, res) => {
    try{
        const check = await collection.findOne({name: req.body.name});
        if(!check) {
            return res.status(400).send('User not found');
        }

        // compare the password with the hashed password
        const isMatch = await brcypt.compare(req.body.password, check.password);
        if(isMatch) {
            res.status(200).render('home');
        } else {
            res.status(400).send('Invalid password');
        } 
    }catch{
            res.status(500).send('wrong details');
        }
    });



const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})