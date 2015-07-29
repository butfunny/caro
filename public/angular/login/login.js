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
                User.nickName = $scope.nickName;
                $socket.emit('nick name',$scope.nickName);

            };

            $scope.hasUsername = false;

            $socket.on("ErrorNickName",$scope,function(data){
                if(!data){
                    User.isLogin = true;
                    $state.go('chat-room');
                }else{
                    $scope.hasUsername = true;
                }
            })
        })

    ;

})();