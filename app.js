const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://Venkat-1234:venkat1234@cluster0.popgc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology: true });
//const arr=["Prithvi","Yashwanth","Rahul","Vishnu","Pradeep"];
const userSchema={
  email:String,
  password:String
};
const candiDate={
  name:String,
  count:Number
};

const User=new mongoose.model("User",userSchema);
const Candidate=new mongoose.model("Candidate",candiDate);



app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});



app.post("/already",async function fun(req,res){

  res.render("thankyou");
  const name=req.body.name;
  try{
    let queryResult = await Candidate.findOne({name:name});
    let query = {$set:{count:queryResult.count+1}}
    Candidate.updateOne({name:name},query,function(err,res){
      if(err) console.log(err);
      else console.log(res);
    })

  }
  catch(err){
    console.log(err);
  }
});

app.post("/register",async function(req,res){
    const username=req.body.username;


    try{
      let queryResult = await User.findOne({email:username});
      console.log(queryResult);
      if(queryResult===null){
        const newUser=new User({
         email:req.body.username,
         password:req.body.password
       });
       try{
         await newUser.save();
         res.render("candidates");
       }
       catch(err){
         console.log(err);
       }
      }
       else if(queryResult.email === username)
      {
        res.render("Aaccount")
      }

    }
    catch(err){
         console.log(err);
      }
        
        
     

        
    }



});


app.post("/login",async function(req,res)
{
  const username=req.body.username;
  const password=req.body.password;
  try{
    let queryResult = await User.findOne({email:username});
    if(queryResult.password === password)
    {
      res.render("candidates");
    }
  }
  catch(err){
    console.log(err);
  }
});






















app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
