const express = require('express');
const app = express();

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

app.get('/api', (req, res) => {
    res.json({'test': 10});
});


