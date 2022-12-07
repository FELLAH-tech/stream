const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const multer = require("multer");
const busboy = require('busboy');
var sys = require('sys')
var exec = require('child_process').exec;

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'views')))
const upload = multer({ dest: "views/uploads/" });


app.get('/', function(req, res) {
  res.render('index', { path: '', name: 'uploading... !' });
})

app.post('/upload', function(req, res) {
        let filename = '';
        const bb = busboy({ headers: req.headers });
        bb.on('file', (name, file, info) => {
        filename = info.filename;
        var dir = './views/uploads/'+filename;

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        const saveTo = path.join(__dirname +'/views/uploads/'+filename, filename);
          file.pipe(fs.createWriteStream(saveTo));
        });
        bb.on('close', () => {
          var foo = filename;
          exec('./views/ffmpeg.sh ' + foo,
            function (error, stdout, stderr) {
              if (error !== null) {
                console.log(error);
              } else {
              console.log('stdout: ' + stdout);
              console.log('stderr: ' + stderr);
              res.render('index', { path: 'uploads/'+filename , name: 'uploaded !' });
              }
          });
        });
        req.pipe(bb);
   })

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})