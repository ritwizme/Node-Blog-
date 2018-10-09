const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')



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

app.use(bodyParser.json())

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


//add idea form
app.get('/ideas/add',(req, res)=>{
    res.render('ideas/add');
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
                res.redirect('/ideas');
                        })

    }
    //console.log(req.body);
    //res.send(req.body.title);

});

const port = 5000;

app.listen(port, () => {
    console.log(`server started on port $(port)`);
});