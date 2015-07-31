var mongojs = require('mongojs');

module.exports = {
    getMatchCaro: function(db,id,callback){
        db.matchCaro.findOne({_id: mongojs.ObjectId(id)},callback);
    },
    removeMatchCaro: function(db,id){
        db.matchCaro.remove({_id: mongojs.ObjectId(id)}, function (err,doc) {
        })
    },
    createMatchCaro: function(db,data,callback){
        db.matchCaro.insert(data,callback);
    },
    updateMatchCaro: function (db,id,update,callback) {
        db.matchCaro.update({_id: mongojs.ObjectId(id)},{$set: update }, callback);
    }
};