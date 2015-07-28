"use strict";

(function () {

    angular.module('caro', [
        'caro.login'
    ])

        .config(function ( $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');


        })

    ;

})();