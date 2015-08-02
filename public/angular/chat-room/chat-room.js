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


            SecurityService.checkLogin().success(function(data){
                if(data){
                    ObjectUtil.clear(User);
                    ObjectUtil.copy(data,User);
                    User.isLogin = true;
                    $socket.emit('Logged',User);
                    ChatRoomApi.getPeopleOnline().success(function(UsersOnline){
                        $scope.onlinePeople = UsersOnline;
                    });
                }else{
                    $state.go("login");
                }

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
                user: User._id
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
                        var elem1 = document.getElementById('MessBox');
                        elem1.scrollTop = elem1.scrollHeight + msg.length*10;
                        $('#MessBox').slimScroll({
                            height: '600px',
                            alwaysVisible: false,
                            scrollTo: elem1.scrollHeight

                        });

                    })
                }
            };
        })


        .directive("onEnter", function() {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    elem.keydown(function(keyEvent){
                        if(keyEvent.keyCode == 13){
                            $scope.$apply(attrs.onEnter);
                        }
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
                        if($scope.message.length > 0){
                            var msg = {
                                user_id: User._id,
                                user: User.name,
                                avatar: User.avatar,
                                message: $scope.message
                            };
                            $socket.emit('Message Chat',msg);
                            $scope.message = "";
                        }

                    };


                    $scope.$watch("message",function(){
                        $scope.message && $scope.message.length > 0 ? $scope.isTyping = true : $scope.isTyping = false;
                    });



                }
            };
        })


        .directive("onlinePeople", function($socket) {
            return {
                restrict: "E",
                templateUrl: 'angular/chat-room/online-people.html',
                link: function($scope, elem, attrs) {

                    $scope.currentTime = new Date().getTime();

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