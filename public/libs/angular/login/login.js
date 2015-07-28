"use strict";

(function () {

    angular.module('caro.login', [
        'ui.router'
    ])

        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: "libs/angular/login/login.html",
                    controller: "login.ctrl"
                })
            ;
        }])

        .controller("login.ctrl",function($scope){

        })

    ;

})();