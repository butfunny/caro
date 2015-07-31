var mongojs = require('mongojs');

module.exports = {
    getUserById: function(db,id,callback){
        db.user.findOne({_id: mongojs.ObjectId(id)},callback);
    },
    insertUsers: function(db,user,callback){
        db.user.insert(user,callback);
    },
    getUserByEmail: function(db,email,callback){
        db.user.findOne({email : email},callback);
    }
};