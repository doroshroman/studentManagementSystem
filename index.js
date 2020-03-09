const express = require('express');
const app = express();
const cors = require('cors');
const userManager = require('./lib/controller/user-manager');
const User = require('./lib/model/user');

const Datastore = require('nedb'), 
    db = new Datastore({ filename: 'users.db', autoload: true });

const manager = new userManager(); 

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.get('/all', (req, res) => {
    res.json({'test': 10});
});

app.post('/users', (req, res) =>{
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

function isValidUser(user){
    return user.name && user.name.toString().trim() !== '' && 
    user.surname && user.surname.toString().trim() !== '' && 
    user.patronymic && user.patronymic.toString().trim() !== '' &&
    user.email && user.email.toString().trim() !== '' &&
    user.password && user.password.toString().trim() !== ''
}


