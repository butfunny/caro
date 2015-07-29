"use strict";

(function () {

    angular.module('caro', [
        'caro.login',
        'caro.chat-room',
        'caro.security'
    ])

        .config(function ( $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');



        })

    ;

})();