const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
// TODO remove fs and use sequelize instead
const db = require('./models')
const methodOverride = require('method-override');

const port = 3000;

app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.get('/', function (req, res) {
    res.render('index');
});

// TODO add some fun pictures with cloudinary?
// TODO add another model to have a parent/child something

//GET all of our dinosaurs /dinosaurs
app.get('/dinosaurs', function (req, res) {
    db.dinosaur.findAll().then(function (dinosaurs) {
        res.render('dinos/index', {dinosaurs});
    });
});

//GET /dinosaurs/new - to serve up our new dino form
app.get('/dinosaurs/new', function (req, res) {
    res.render('dinos/new');
});

//GET /dinosaurs/:id/edit - edit dino form
app.get('/dinosaurs/:id/edit', function (req, res) {
    db.dinosaur.findByPk(parseInt(req.params.id))
        .then(function (dinosaur) {
            res.render('dinos/edit', {dinosaur} );
        });
});

//GET 1 dinosaur - /dinosaur/:id - show route
app.get('/dinosaurs/:id', function (req, res) {
    db.dinosaur.findByPk(parseInt(req.params.id))
        .then(function(dinosaur) {
            res.render('dinos/show', {dinosaur} )
        });
});

//POST make a new dino /dinosaurs 
app.post('/dinosaurs', function (req, res) {    
    db.dinosaur.create({
        name: req.body.dinosaurName,
        type: req.body.dinosaurType
    }).then(function (dinosaur) {
        res.redirect('dinosaurs')
    });
});

//POST delete a dino
app.delete('/dinosaurs/:id', function (req, res) {
    db.dinosaur.destroy({
        where: {id: parseInt(req.params.id)}
    }).then(function(data) {})
    res.redirect('../');
});

//Update my dino
app.put('/dinosaurs/:id', function (req, res) {
    db.dinosaur.update({
        name: req.body.dinosaurName,
        type: req.body.dinosaurType
    }, {
        where: {id: parseInt(req.params.id)}
    }).then(function(dinosaur) {
        res.redirect('./')
    });
});

app.listen(port, function () {
    console.log('we are listening on the Satellite of Love: MST' + port);
});