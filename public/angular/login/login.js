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

        .controller("login.ctrl",function($scope,SecurityService){

        })

    ;

})();