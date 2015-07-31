"use strict";

(function () {

    angular.module('caro.security', [
    ])

        .factory("User", function() {
            return {
                isLogin: false
            };
        })

        .run(function (SecurityService) {
            SecurityService.initialize();
        })


        .factory("SecurityService", function(User, $state,$q,$http,$window) {

            var deferInitialize = $q.defer();

            var onLoginListeners  = [];
            var onLogoutListeners = [];

            function checkLogin() {

                return $http.get("/api/account").success(function (data) {
                    if (!data) {
                        ObjectUtil.clear(User);
                        $state.go("login");
                        Fs.invokeAll(onLoginListeners);
                    } else {
                        User.isLogin = true;
                        ObjectUtil.copy(data, User);
                        $state.go("chat-room");
                        Fs.invokeAll(onLogoutListeners);
                    }
                })
            }

            return {
                initialize: function () {
                    checkLogin().finally(function () {
                        deferInitialize.resolve();
                    });
                },
                checkLogin: function(){
                    return $http.get("/api/account");
                },
                onLogin: function(onLoginListener, onLogoutListener) {
                    onLoginListeners.push(onLoginListener);
                    onLogoutListeners.push(onLogoutListener);
                }
            };
        })




    ;

})();