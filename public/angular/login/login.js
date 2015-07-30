"use strict";

(function () {

    angular.module('caro.login', [
        'ui.router',
        'caro.common.socket'
    ])

        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: "angular/login/login.html",
                    controller: "login.ctrl"
                })
            ;
        }])

        .controller("login.ctrl",function($scope,$socket,$state,User){
            $scope.login = function(){
                $socket.emit('nick name',$scope.nickName);

            };


            $socket.on("Login",$scope, function (data) {
                console.log(data);
               if(data.username == $scope.nickName){
                   User.nickName = $scope.nickName;
                   User.isLogin = true;
                   $state.go('chat-room');
               }
            });

            $scope.hasUsername = false;

            $socket.on("ErrorNickName",$scope,function(data){
                if(data){
                    $scope.hasUsername = true;
                }
            })
        })

    ;

})();