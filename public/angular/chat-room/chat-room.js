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

        .controller("chat-room.ctrl", function($scope,$state,$socket,ChatRoomApi,User,SecurityService) {

            console.log(User);

            SecurityService.checkLogin().success(function(data){
                if(data){
                    ObjectUtil.clear(User);
                    ObjectUtil.copy(data,User);
                    User.isLogin = true;
                }else{
                    $state.go("login");
                }

            });


            ChatRoomApi.getPeopleOnline().success(function(UsersOnline){
                $scope.onlinePeople = UsersOnline;
            });



            $socket.on('HasGame',$scope,function(match){
                if(User.nickName == match.player1 || User.nickName == match.player2){
                    $state.go('caro-room',{matchID: match._id});
                }
            });


            $scope.findMatch = function(){
                $socket.emit('FindMatch','');
            };

            $scope.user = {
                user: User.nickName
            };
            
            
            $scope.createRoom = function () {
                ChatRoomApi.createRoom($scope.user).success(function(match){
                    $state.go('caro-room',{matchID: match._id});
                })
            }





        })


        .directive("chatBox", function($socket,User) {
            return {
                restrict: "E",
                templateUrl: 'angular/chat-room/chat-box.html',
                link: function($scope, elem, attrs) {

                    $scope.messages = [];
                    $scope.user = User;

                    $socket.on('Message',$scope,function(msg){
                        $scope.messages.push( msg );
                        console.log(msg);
                        var elem = document.getElementById('messageBox');
                        elem.scrollTop = elem.scrollHeight;
                    })
                }
            };
        })



        .directive("chatInput", function($socket,User) {
            return {
                restrict: "E",
                templateUrl: 'angular/chat-room/chat-input.html',
                link: function($scope, elem, attrs) {

                    $scope.UserTyping = [];

                    $scope.chat = function () {
                        var msg = {
                            user: User.facebook.name,
                            avatar: User.facebook.picture.data.url,
                            message: $scope.message
                        };
                        $socket.emit('Message Chat',msg);
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

                }
            };
        })


        .directive("onlinePeople", function($socket) {
            return {
                restrict: "E",
                templateUrl: 'angular/chat-room/online-people.html',
                link: function($scope, elem, attrs) {

                    $socket.on('Online People',$scope,function(UsersOnline){
                        $scope.onlinePeople = [];
                        ObjectUtil.copy(UsersOnline,$scope.onlinePeople);
                        var elem = document.getElementById('onlineBox');
                        elem.scrollTop = elem.scrollHeight;

                    });


                }
            };
        })


    ;

})();