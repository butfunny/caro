
var listUserOnline = [];

module.exports = {


    addNewUser: function(user){
      listUserOnline.push(user);
    },
    removeUser: function(user){

    },
    getUserOnline: function(){
        return listUserOnline;
    }
};