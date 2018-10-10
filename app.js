const express = require('express');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
// Map global promice - get rid of worning
mongoose.Promise = global.Promise;
// Connect to mongoose

mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true
})
.then(() => console.log('MongoDB Connected..'))
.catch(err => console.log(err));

// Load idea model
//require('./models/Idea');
//const Idea = mongoose.model('ideas');

require('./models/Idea');
const Idea = mongoose.model('ideas');

//handlebar miiddleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');


//body-parser middlewarre
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());

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
    res.locals.error_msg_msg = req.flash('rerror_msg');
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


//Idea Index Page
app.get('/ideas', (req, res) => {
    Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('ideas/index', {
            ideas:ideas
        });
    });

});


//Add idea form
app.get('/ideas/add',(req, res)=>{             
    res.render('ideas/add');
});


//Edit idea form
app.get('/ideas/edit/:id',(req, res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea: idea
        });
    });
    
});





//proces form
app.post('/ideas', (req, res) =>{
    let errors = [];
    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'});
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else{
            const newUser = {
                title: req.body.title,
                details: req.body.details,

            }   
            new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video Idea Added');
                res.redirect('/ideas');
                        })

    }
    //console.log(req.body);
    //res.send(req.body.title);

});


//Edit form porcess
app.put('/ideas/:id', (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title,
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Video Idea updated');
            res.redirect('/ideas');
        })
    });

});
//Delete idea

app.delete('/ideas/:id', (req, res) =>{
        
        Idea.deleteOne({_id: req.params.id})    
            .then(() =>{
                req.flash('success_msg', 'Video Idea removed');
                res.redirect('/ideas');
            });
});

const port = 5000;

app.listen(port, () => {
    console.log(`server started on port $(port)`);
});