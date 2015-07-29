"use strict";

(function () {

    angular.module('caro.chat-room', [
        'ui.router',
        'caro.common.socket',
        'caro.chat-room.api'
    ])

        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('chat-room', {
                    url: '/chat-room',
                    templateUrl: "angular/chat-room/chat-room.html",
                    controller: "chat-room.ctrl"
                })
            ;
        }])

        .controller("chat-room.ctrl", function($scope,$state,$socket,ChatRoomApi,User) {


            if(!User.isLogin){
                $state.go('login');
            }

            $scope.UserTyping = [];

            ChatRoomApi.getPeopleOnline().success(function(UsersOnline){
                $scope.onlinePeople = UsersOnline;
            });

            $socket.on('Online People',$scope,function(UsersOnline){
                $scope.onlinePeople = [];
                ObjectUtil.copy(UsersOnline,$scope.onlinePeople);
                var elem = document.getElementById('onlineBox');
                elem.scrollTop = elem.scrollHeight;

            });

            $scope.messages = [
                {
                    username: "butfunny",
                    message: "Welcome to caro online 1.0."
                }
            ];

            $scope.chat = function () {
                $socket.emit('Message Chat',$scope.message);
                $scope.message = "";
            };


            $scope.$watch("message",function(){
                if($scope.message && $scope.message.length > 0){
                    $scope.isTyping = true;
                    $socket.emit('Typing','is typing');
                }else{
                    $socket.emit('StopTyping','');
                    $scope.isTyping = false;
                }
            });


            $socket.on('Typing',$scope,function(UserTyping){

                if(User.nickName != UserTyping.username){
                    if(!Cols.find($scope.UserTyping,function(u){return u.username == UserTyping.username })){
                        $scope.UserTyping.push(UserTyping);
                    }
                }

            });

            $socket.on('StopTyping',$scope,function(UserTyping){
                $scope.UserTyping.splice(Cols.findIndex($scope.UserTyping,function(u){return u.username == UserTyping.username }),1)

            });


            $scope.findMatch = function(){
                $socket.emit('FindMatch','');
            };


            $socket.on('Message',$scope,function(msg){
                $scope.messages.push( msg );
                var elem = document.getElementById('messageBox');
                elem.scrollTop = elem.scrollHeight;

            })


        })


    ;

})();