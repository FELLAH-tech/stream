const express = require("express");
const app = express();
const dbName = 'Authentication';
const client = 'mongodb://localhost:27017/Authentication';
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const uid = require('uuid');

const PORT = 3000;

mongoose.set('strictQuery', true);
mongoose.connect(client);


app.use(bodyParser.urlencoded({
    extended: true
  }));

  var Schema = mongoose.Schema;
  app.use(bodyParser.json());
    var UserAttributes = new mongoose.Schema({
   
      uid: String,
      email: String,
      password: String,
     
    });
    
     var User = mongoose.model('Users', UserAttributes);
    


  

  // add new user
  app.post('/register', async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      // create new user
      console.log(email);
      console.log(password);
      bcrypt.hash(password, 10, async function (err, hash) {

        const user =  new User({
          uid: uid.v4(),
          email: email.toLowerCase(),
          password: hash
        });
        // const me = user.push(user.uid);
        // console.log(me);
         user.save(function (err, result) {
          if (err) {
            console.log(err);
          }
          else {
            console.log("=============== begin register ===============");
            console.log("new user saved to database:", result);
            console.log("=============== end register ===============");
          }
        });

        res.status(200).send({message: "Register success"});


      });
    } 
    catch (err) {
      console.log(err);
    }
  });

    // login user
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log(email);
        console.log(password);
        console.log("=============== begin login ===============");
        // check email on login
        const user = await User.findOne({ email: email.toLowerCase() });

        if(user){
        console.log("user found");
        }
        else{
        console.log("user not found, wrong email.");
        console.log("=============== end login ===============");
        return res.status(404).send({message: "wrong email"}); // not found
        }

        // check login password
        console.log(password);
        console.log(user.password);
        const match =  await bcrypt.compare(password, user.password);
        if (match){
        // generate token on login
      
        console.log(`Welcome back ${user.email}`);
        console.log("=============== end login ===============");
        return res.status(200).send({message:"Login succecss"})
        }
        else{
        console.log("Incorrect Password");
        console.log("=============== end login ===============");
        return res.status(400).send({message: "Invalid Password, Please retry."});
        }
    } 
    catch (err) {
        console.log(err)
        }
});

app.get('/',(req,res) =>
{

res.send('test');
}
);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });