"use strict";

(function () {

    angular.module('caro.chat-room.api', [
    ])
        .factory("ChatRoomApi", function($http) {
            return {
                getPeopleOnline: function(){
                   return  $http.get("/api/room-chat/people-online");
                },
                createRoom: function(player){
                    return $http.post("/api/caro-room/createdMatch",player);
                }
            };
        })
    ;

})();