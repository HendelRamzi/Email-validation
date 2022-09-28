// const sequelize = require('./db')

const {User} = require('./User')
const express = require('express');
const path = require('path')
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser')
const crypto = require("crypto");
const nodemailer = require("nodemailer");



const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use("/public",express.static(__dirname + "/public"))
app.set('view engine', 'ejs'); 
//----------------------------------- Init the database

const sequelize = new Sequelize('emailval', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'mysql' 
})

sequelize.authenticate()// authenticate to the data 
.then(()=>{
    console.log('Connection has been established successfully.');
    sequelize.sync()//automatically synchronize all models
    .then(()=>{
        console.log("All models were synchronized successfully.");
    })
    .catch((error)=>{
        console.log("Eroor in synchronizing the tables " + error) ;
    })
})
.catch((error)=>{
    console.error('Unable to connect to the database:', error);
})

//------------------------------------------

app.get('/', (req, res)=>{
    res.render('index'); 
})


app.post('/',async (req, res)=>{
    const {name , email, password} = req.body ; 

    // I get the form data here.

    // #01 let's add the user to the database and set the isValid the false.
        // First Let's Generate The Token. I'll user crypto to generate a unique 
        // 36 bits token. 
        const tokenGenaration = crypto.randomBytes(16).toString("hex");

        // Let's save the user into the database.
        const savedUser  = await User.create({
            name : name, 
            password : password,
            token : tokenGenaration, 
            email : email,
        })

    // #02 Start the email validation process. 
        // Let's generate the link to send in the users email.
        const linkGenerated = `http://Localhost:8888/email-verification/${tokenGenaration}`; 
        
        // Let's send this link now to the user email account.
            // To send the email I'll use the NodeMailer library.

            // Create the Nodemailer object that'll send the email.
            const transporter  = nodemailer.createTransport({
                service :"hotmail",
                auth : {
                    user : "h.ramzi.mi@outlook.com",
                    pass : "Inform@tique22"
                }
            })


            // Formatting the message to send 
            const message = {
                from :"h.ramzi.mi@outlook.com",
                to : email,
                subject :"EMAIL VALIDATION",
                html :`
                    <h1>Email Validation!</h1>
                    <p>Please, click in the link above to validate your account!</p>
                    <a href = "${linkGenerated}">Validate My Email!</a>
                `
            }

            // Sending the mail
            transporter.sendMail(message, (err, info)=>{
                if(err){
                    console.log(err);
                    return; 
                }

                console.log(info.response)
            })


    res.send("Email have been send to your mail account") ;
})

app.get('/email-verification/:token', async(req, res)=>{
    // Get the token from the url and check if it's valide.
    const token = req.params.token ; 

    // CHekc for the user token
    const user = await User.findOne({
        where : {
            token : token
        }
    })

    if(user){
        // If the user excist that's mean that the token is valide.

        // Validate the user
        user.token = null ; 
        user.isValide = true; 

        user.save() // Update the user in the database.
        res.send('Email validation successfully!')
    }else{
        res.send('the token is unvalide')
    }

})




//------------------------------------------ Lunch the server
var server = app.listen(8888, function() {
    console.log('Express server listening on port 8888  : http://localhost:8888/');
});