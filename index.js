const express = require('express');
const app = express();
const cors = require('cors');
const userManager = require('./lib/controller/user-manager');
const User = require('./lib/model/user');
const Permission = require('./lib/model/permission');
const path = require('path');
const Datastore = require('nedb'), 
    db = new Datastore({ filename: 'users.db', autoload: true });

const manager = new userManager(); 

let currentUser = null;

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.get('/all', (req, res) => {
    res.json({'test': 10});
});

app.post('/reg', (req, res) =>{
    // validate and insert to db
    if(isValidUser(req.body)){
        const name = req.body.name.toString().trim();
        const surname = req.body.surname.toString().trim();
        const patronymic = req.body.patronymic.toString().trim();
        const email = req.body.email.toString().trim();
        const password = req.body.password.toString().trim();
        const user = new User(name, surname, patronymic, email, password);
        
        //find if this user is in the db
        db.findOne({ email: email}, (err, doc) =>{
            if(err){
                res.end();
            }
            if(doc === null){
                // insert into db
                db.insert(user, (err, newDoc) =>{
                    currentUser = newDoc;
                    res.json(newDoc);
                });
            }else{
                res.status(422);
                res.json({
                    message: 'Busy account! Try another email address.'
                });
            }
        });


    }else{
        res.status(422);
        res.json({
            message: 'All fields are required!'
        });
    }
});
app.post('/sign', (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;
    if(isValidAuthUser(email, password)){

        db.findOne({ email: email}, (err, doc) =>{
            if(err){
                res.end();
            }
            if(doc !== null && doc.password.toLowerCase() === password){
               currentUser = doc;
               res.json({
                   message: "Successfully authenticated!"
               });
            }
        });

    }else{
        res.status(422);
        res.json({
            message: 'All fields are required!'
        });
    }
});
// Only admin can add user
app.get('/add-student', (req, res) =>{
    if(currentUser !== null && Object.keys(currentUser.permissions).length !== 0){
        const adminInd = currentUser.permissions.findIndex((perm, index) =>{
            if(perm.title.toLowerCase() === 'admin'){
                return true;
            }
        });
        if(adminInd !== -1){
            res.sendFile(path.join(__dirname + '/static/html/add-student.html'));
        }
        
    }else{
        res.send("You need to register or sign in");
    }
});

function isValidAuthUser(email, password){
    return email && email.toString().trim() !== '' &&
    password && password.toString().trim() !== ''
}

function isValidUser(user){
    return user.name && user.name.toString().trim() !== '' && 
    user.surname && user.surname.toString().trim() !== '' && 
    user.patronymic && user.patronymic.toString().trim() !== '' &&
    isValidAuthUser(user.email, user.password);
}


