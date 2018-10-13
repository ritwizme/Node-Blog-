const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();




//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');




// Map global promice - get rid of worning
mongoose.Promise = global.Promise;
// Connect to mongoose

mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true
}) 
.then(() => console.log('MongoDB Connected..'))
.catch(err => console.log(err));


//handlebar miiddleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');


//body-parser middlewarre
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());

//Static folder

app.use(express.static(path.join(__dirname, 'public')));


//Method Override middleware
app.use(methodOverride('_method'));

//flash middlewear
app.use(flash());


//Express session middleware

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

//Global variables

app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});



//index route
app.get('/',(req, res)=>{
    const title = 'Welcome';

    res.render('index', {
        title: title
    });
});

app.get('/about',(req, res)=>{
    res.render('about');
});


//Use routes
app.use('/ideas', ideas);
app.use('/users', users);


const port = 5000;

app.listen(port, () => {
    console.log(`server started on port $(port)`);
});