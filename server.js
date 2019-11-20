const express = require('express');
const path = require('path');
const app = express();
const port = 8400;
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'webrtc')));

//var router = express.Router();

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'webrtc', 'index.html'), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});

app.use(cors());
// app.use('/api', router);
console.log(port);
app.listen(port, function () {
    console.log("listening to this port:" + port);
});