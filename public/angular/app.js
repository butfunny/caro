"use strict";

(function () {

    angular.module('caro', [
        'caro.login',
        'caro.chat-room',
        'caro.security',
        'caro.caro-room',
        'caro.layout'
    ])

        .config(function ( $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');



        })

    ;

})();