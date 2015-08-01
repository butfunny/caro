"use strict";

(function () {

    angular.module('caro.layout', [
        'caro.chat-room.api'
    ])
        .factory("LayoutService", function(SecurityService,User) {

            var $body = $("body");
            var $nav = $("nav");
            var $userName = $("#userName");
            var $avatar = $("#avatar");
            SecurityService.onLogin(
                function( ) {
                    $body.css({'background-color': "#395075"});
                    $nav.css({'display' : 'none'});
                },
                function() {
                    $body.css({'background-color': "#fafffb"});
                    $avatar.attr('src', User.avatar);
                    $userName.html('<b>'+User.name+'</b>');
                }
            );

            return {};
        })


        .run(function(LayoutService) {})

    ;

})();