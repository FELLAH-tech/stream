const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const multer = require("multer");
const busboy = require('busboy');
var sys = require('sys')
var exec = require('child_process').exec;


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('Data_Base.db');

const {openDb} = require("./db");

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


const session = require('express-session');
//app.set('trust proxy', 1)
app.use(session(
    {
        secret: 'secret key',
        resave: true,
        rolling: true,
        saveUninitialized: true,
        cookie: { 
            maxAge: 1000 * 3600 //ms    
        },
        saveUninitialized: true
    }
))


app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'views')))
const upload = multer({ dest: "views/uploads/" });




app.get('/', async (req, res)=>{
  if(!req.session.pseudo){
      res.redirect('/authen')
  }else{
      let db_select = await openDb();
     
      let user = {
          id : req.session.user_id,
          pseudo : req.session.pseudo
      }
      let data = {
          user : user,
          tag : req.session.tag
      }
      res.render("index.pug", { user: user.pseudo});
  }
});




app.get('/inscription', (req, res)=>{

  res.render('inscription.pug');

});

app.post('/inscription', (req, res)=>{
  // Checking info & saving data
  db.run(`
      INSERT INTO Users(pseudo, email, password)
      VALUES
          (?, ?, ?);
  `, req.body.pseudo, req.body.email, req.body.password);
  res.redirect('/');
});

app.get('/authen', (req, res)=>{

  data = {
      err_msg : ""
  }
  res.render('authen.pug', data);

});

app.post('/authen', (req, res)=>{
  // Checking info & saving data
  err_msg = "2892";
  err = false;
  db.get("SELECT * FROM Users WHERE email = ?", [req.body.email],
  (err, row)=>{
      if(typeof row === 'undefined'){
          err_msg = "There is no user with this email";
          err = true;
      }else if(row.password != req.body.password){
          err_msg = "Wrong password";
          err = true;
      }

      if(err){
          data = {
              err_msg : err_msg
          }
          res.render('authen.pug', data);
      }else{
          req.session.user_id = row.id
          req.session.pseudo = row.pseudo
          req.session.email = row.email
          res.redirect('/');
      }
  });
});

app.get('/deconnect', (req, res)=>{
  req.session.destroy()
  res.redirect('/')
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