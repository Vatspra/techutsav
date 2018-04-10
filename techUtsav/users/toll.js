const express = require('express');
//var bodyParser =require('body-parser')
var config = require('../config/database')
//var app= express();
const router = express.Router();
var Toll = require('../models/tollModel');


router.post('/register',function(req,res){
  console.log(req.body);

  Toll.findOne({tolluniqueNo:req.body.tolluniqueNo},function(err,toll){
   if(err){
     console.log(err);
   }
   if(toll){
     res.json({success:false,msg:"this toll is already registered"});
   }
   else{
   var newToll = new Toll({
     tolluniqueNo : req.body.tolluniqueNo,
     address      : req.body.address,
     lati         : req.body.lati,
     longi        : req.body.longi,
     city         : req.body.city
   })

   Toll.addToll(newToll,function(err,toll){
    if(err){
      console.log(err)
      res.json({success:false,msg:"failed to register"});
       }
    else{
      res.json({success:true,msg:"new toll created",toll:toll});
      }
    })

   }
})
})

module.exports = router
