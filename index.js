const express = require('express');
const app = express();
const cors = require('cors');
const userManager = require('./lib/controller/user-manager');
const User = require('./lib/model/user');
const Permission = require('./lib/model/permission');
const path = require('path');
const Datastore = require('nedb');
userDb = new Datastore({ filename: 'users.db', autoload: true });
studentDb = new Datastore({ filename: 'students.db', autoload: true });
 

const manager = new userManager(); 

let currentSessions = {};

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.get('/all', (req, res) => {
    studentDb.find({}, (err, data) =>{
        if(err){
            res.end();
            return;
        }
        res.json(data);
    });
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
        userDb.findOne({ email: email}, (err, doc) =>{
            if(err){
                res.end();
            }
            if(doc === null){
                // insert into db
                userDb.insert(user, (err, newDoc) =>{
                    hash = bindUserAndGetHash(newDoc);
                    res.json({
                        session_id: hash
                    });
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

        userDb.findOne({ email: email}, (err, doc) =>{
            if(err){
                res.end();
            }
            if(doc !== null && doc.password.toLowerCase() === password){
                hash = bindUserAndGetHash(doc);
                res.json({
                    session_id: hash
                });
            }else{
                res.status(422);
                res.json({
                    message: "Incorrect password or you are not registered."
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
    const session = req.query.sessionId;
    const user = currentSessions[session];
    let permission = false;
    console.log("Session:", session);
    console.log(user);
    if(user !== undefined && user !== null){
        if(Object.keys(user.permissions).length !== 0){
            const adminInd = user.permissions.findIndex((perm, index) =>{
                if(perm.title.toLowerCase() === 'admin'){
                    return true;
                }
            });
            if(adminInd !== -1){
                // Serve this folder for admin
                app.use(express.static(__dirname + '/static'));
                res.sendFile(path.join(__dirname + '/static/add-student.html'));
                permission = true;
            }
            
        }
    }else{
        permission = false;
    }
    if(!permission){
        res.send("You don\'t have enought rights.");
    }
});
app.post('/add-student', (req, res)=>{
    const student = req.body;
    if(isValidStudent(student)){
        const email = student.email;
        studentDb.findOne({ email: email}, (err, doc) =>{
            if(err){
                res.end();
            }
            if(doc === null){
                // insert into db
                studentDb.insert(student, (err, newDoc) =>{
                    res.json({newDoc});
                });
            }else{
                res.status(422);
                res.json({
                    message: 'This student is busy.'
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

// Validation part
function isValidStudent(student){
    return isValidUser(student) &&
    student.birthday && student.birthday.toString().trim() !== '' &&
    student.gender && student.gender.toString().trim() !== '' &&
    student.group && student.group.toString().trim() !== '' &&
    student.studentCode && student.studentCode.toString().trim() !== '' &&
    student.passCode && student.passCode.toString().trim() !== '';
}
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

function bindUserAndGetHash(user){
    const hashlen = 16;
    const hash = randomHash(hashlen);
    currentSessions[hash] = user;

    return hash;
}

// random hash
function randomHash(hashlen){
    const characters = "0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
    let hash = "";
    const charslen = characters.length;
    for(let i = 0;i < hashlen;i++){
        let choice = Math.random();
        let char = characters[Math.floor(Math.random() * charslen)];
        if(choice < 0.5){
            char = char.toLowerCase();
        }
        hash += char;
    }
    return hash;
}


