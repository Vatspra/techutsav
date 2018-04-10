var mongoose = require('mongoose');

var bcrypt = require('bcrypt');
const saltRounds = 10;
var config = require('../config/database');
var salt = 10;

//user sha512-eRzhrN1WSINYCDCbrz796z37LOe3m5tmW7RQf6oBntukAG1nmovJvhnwHHRMAfeoItc1m2Hk02WER2aQ
var UserSchema = mongoose.Schema({
  name:{
    type:String
  },
  uniqueCode:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  mobile:{
    type:Number,
    required:true
  },
  toll:{
    type:Array     //this will store the list of toll crossed by vehicle
  },
  totalDue:{
    type:Number,
    default:0
  }
})



var User = module.exports = mongoose.model('User',UserSchema);
module.exports.getUserById = function(id,callback){
 User.findById(id,callback);
}

module.exports.getUserByUsername = function(username,callback){
  var query = {email:username}
 User.findOne(query,callback);
}


module.exports.comparePassword = function(pwd,hash,callback){
  bcrypt.compare(pwd, hash, function(err, res) {
      if(err) throw err;
      callback(null,res);
  });
}

module.exports.addUser = function(newUser,callback){
   //console.log("hi");

     bcrypt.hash(newUser.password, saltRounds, function(err, hash) {
       if(err){
         console.log(err);
       }
        newUser.password = hash;
        console.log("password is"+newUser.password)
        newUser.save(callback);

         // Store hash in your password DB.
      });
}
