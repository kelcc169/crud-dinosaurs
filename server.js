require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const db = require('./models')
const methodOverride = require('method-override');
const multer = require('multer');
const cloudinary = require('cloudinary');

const port = 3000;

const app = express();
const upload = multer({dest: './uploads'});

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
    db.dinosaur.findOne({
        where: {id: parseInt(req.params.id)},
        include: [db.possession]
    }).then(function(dinosaur) {
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

//Update my dino
app.put('/dinosaurs/:id', function (req, res) {
    db.dinosaur.update({
        name: req.body.dinosaurName,
        type: req.body.dinosaurType,
    }, {
        where: {id: parseInt(req.params.id)}
    }).then(function(dinosaur) {
        res.redirect('./')
    });
});

// delete a dino
app.delete('/dinosaurs/:id', function (req, res) {
    db.dinosaur.destroy({
        where: {id: parseInt(req.params.id)}
    }).then(function(data) {})
    res.redirect('../');
});

//give a dino a thing
app.post('/dinosaurs/:id/possessions', function (req, res) {
    db.possession.create({
        name: req.body.name,
        dinosaurId: req.params.id
    }).then(function (data) {
        res.redirect('/dinosaurs/' + req.params.id)
    });
});

//upload dinosaur picture
app.post('/dinosaurs/:id/picture', upload.single('myFile'), function (req, res) {
    cloudinary.uploader.upload(req.file.path, function (result) {
        var imgUrl = cloudinary.url(result.public_id, { width: 1000 })
        res.redirect('dinosaurs', {url: imgUrl});
    })
});

app.listen(port, function () {
    console.log('we are listening on the Satellite of Love: MST' + port);
});