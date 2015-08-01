var Cols = require('../../libs/common/common-utils.js').Cols;

var listUserOnline = [];

module.exports = {


    addNewUser: function(user){
      listUserOnline.push(user);
    },
    removeUser: function(user){
        listUserOnline.splice(Cols.findIndex(listUserOnline, function (u) {return u._id == user._id}),1);
    },
    getUserOnline: function(){
        return listUserOnline;
    }
};