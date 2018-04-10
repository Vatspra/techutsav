
const express = require('express');
//var bodyParser =require('body-parser')
var config = require('../config/database')
//var app= express();
const router = express.Router();
var User = require('../models/userModel');
var Toll = require('../models/tollModel');
var passport = require('passport');
var jwt = require('jsonwebtoken');


//var urlencodedParser = bodyParser.urlencoded({ extended: false })

//user register
router.post('/register',function(req,res,next){
  console.log(req.body.name);
    User.findOne({email:req.body.email},function(err,user){
     if(err){
       console.log(err);
     }
     if(user){
       res.json({success:false,msg:"this vehicle is already registered"});
     }
     else{
       var newUser = new User({
         name:req.body.name,
         email:req.body.email,
         password:req.body.password,
         uniqueCode:req.body.uniqueCode,
         mobile:req.body.mobile
       });
       User.addUser(newUser,function(err,user){
        if(err){
          res.json({success:false,msg:"failed to register"});
           }
        else{
          res.json({success:true,msg:"new user created please login"});
          }
        })
      }

    })

 })

// user login

router.post('/authenticate',function(req,res,next){
  var username = req.body.email;
  var password = req.body.password;
  //console.log('user name is '+email);

  User.getUserByUsername(username,function(err,user){
  if(err) throw err;

  if(!user){
    return res.json({success:false,msg:'user not found'})
  }
  User.comparePassword(password,user.password,function(err,isMatch){
  if(err) throw err;
  if(isMatch){
   console.log('yes matched');
    const token = jwt.sign(user.toJSON(),config.secret,{
      expiresIn :604800
    });
    console.log(token)
    res.json({success:true,
              token:'Bearer '+token,
               user:{
                 id:user._id,
                 name:user.name,
                 email:user.email,
                 mobile:user.mobile,
                 uniqueCode:user.uniqueCode
               }
             })
          }
    else{
    return res.json({success:false,msg:'wrong password'})

  }

  })

  })

 })

router.get('/profile',passport.authenticate('jwt', { session: false }),function(req,res,next){
 res.json({success:true,
   user:req.user});
 });



// update users when the vehicle crosses toll

router.post('/updateUser',function(req,res){
  var uniqueCodeUser = req.body.uniqueCodeUser; //unique code of user
  var uniqueCodeToll = req.body.uniqueCodeToll;

  Toll.findOne({tolluniqueNo:uniqueCodeToll},function(err,toll){
    var lati =0;
    var longi =0;
    var location =[];
    var timestamp =[];
    var totalDue=0;
    var newToll = {longi:0,lati:0,date:"",cost:""};
    if(err){
      console.log(err)
    }
    if(!toll){
      res.json({success:false,msg:"this toll not exists"})
    }
    else{
      newToll.lati = toll.lati;
      newToll.longi = toll.longi;
      newToll.city = toll.city;
      User.findOne({uniqueCode:uniqueCodeUser},function(err,user){
        if(err){
          console.log(err)
        }
        if(!user){
          res.json({msg:"no user find"})
        }
        else{
          var dte = new Date;
          dte.setTime(dte.getTime() +(dte.getTimezoneOffset()+330)*60*1000);
          const date =dte.toLocaleString();
          console.log(date);
          newToll.date =date;
          newToll.cost =10;
          totalDue = user.totalDue+10;;
          location =user.toll;
        //  timestamp =user.timestamp;
          location.push(newToll);
          //timestamp.push(date);
          User.findOneAndUpdate({uniqueCode:uniqueCodeUser}, {$set:{totalDue:totalDue,toll:location}}, {new: true}, function(err, rest){
              if(err){
                  console.log("Something wrong when updating data!");
              }

              console.log("updated");

              res.json(rest);
          });

        }
      })

    }
  })







});

/*router.get('/hello',function(req,res){
  res.json({msg:"hello"});
})
 /*router.get('/validation',function(req,res,next){
 res.send("validation");
 })
/*function hi(req,res,next){

  console.log(req.body);
  next();
}*/

module.exports = router;
