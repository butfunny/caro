"use strict";

(function () {

    angular.module('caro', [
        'caro.login',
        'caro.chat-room',
        'caro.security',
        'caro.caro-room'
    ])

        .config(function ( $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');



        })

    ;

})();