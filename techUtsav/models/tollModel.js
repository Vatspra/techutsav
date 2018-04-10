var mongoose = require('mongoose');

var config = require('../config/database');




var tollSchema = mongoose.Schema({
   tolluniqueNo:{
     type:String,
     required:true
   },
   address:{
     type:String,
     required:true
   },
   lati:{
     type:String,
     required:true
   },
   longi:{
     type:String,
     required:true
   },
   city:{
     type:String
   }
})


var Toll = module.exports = mongoose.model('Toll',tollSchema);


module.exports.getToll = function(tolluniqueNo,callback){
  var query = {tolluniqueNo:tolluniqueNo}
 Toll.findOne(query,callback);
}

module.exports.addToll = function(newToll,callback){
        newToll.save(callback);
    }
