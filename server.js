const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
// TODO remove fs and use sequelize instead
const fs = require('fs');
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
    // TODO remove fs stuff and use sequelize functions
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
    let dinoData = JSON.parse(dinosaurs);

    res.render('dinos/index.ejs', {dinosaurs: dinoData});
});

//GET /dinosaurs/new - to serve up our new dino form
app.get('/dinosaurs/new', function (req, res) {
    res.render('dinos/new');
});

//GET /dinosaurs/:id/edit - edit dino form
app.get('/dinosaurs/:id/edit', function (req, res) {
    // TODO remove fs stuff and use sequelize functions
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
    let dinoData = JSON.parse(dinosaurs);
    let id = parseInt(req.params.id);
    res.render('dinos/edit', {dinosaur: dinoData[id], id});
});

//GET 1 dinosaur - /dinosaur/:id - show route
app.get('/dinosaurs/:id', function (req, res) {
    // TODO remove fs stuff and use sequelize functions
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
    let dinoData = JSON.parse(dinosaurs);

    let id = parseInt(req.params.id);
    res.render('dinos/show', {dinosaur: dinoData[id], id})
});

//POST make a new dino /dinosaurs 
app.post('/dinosaurs', function (req, res) {    
    // TODO remove fs stuff and use sequelize functions
    //read our json
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
    //convert it to an array
    let dinoData = JSON.parse(dinosaurs);
    //push new data into array
    let newDino = {
        type: req.body.dinosaurType,
        name: req.body.dinosaurName
    }

    dinoData.push(newDino);
    //write the array back to the file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData));

    res.redirect('/dinosaurs');
});

//POST delete a dino
app.delete('/dinosaurs/:id', function (req, res) {
    // TODO remove fs stuff and use sequelize functions
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
    var dinoData = JSON.parse(dinosaurs);
    var id = parseInt(req.params.id);
    dinoData.splice(id, 1);
    var dinoString = JSON.stringify(dinoData);
    fs.writeFileSync('./dinosaurs.json', dinoString);

    res.redirect('/dinosaurs');
});

//Update my dino
app.put('/dinosaurs/:id', function (req, res) {
    // TODO remove fs stuff and use sequelize functions
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
    let dinoData = JSON.parse(dinosaurs);
    let id = parseInt(req.params.id);
    dinoData[id].name = req.body.dinosaurName;
    dinoData[id].type = req.body.dinosaurType;
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData));
    res.redirect('/dinosaurs/' + id);
});

app.listen(port, function () {
    console.log('we are listening on the Satellite of Love: MST' + port);
});