"use strict";

(function () {

    angular.module('caro.common.socket', [
    ])
        .run(function($socket){

        })
        .factory("$socket", function() {
            var socket = io();

            return {
                on: function(eventName, $scope, listener) {
                    var rawListener = function (msg) {
                        $scope.$applyAsync(function () {
                            listener(msg);
                        });
                    };
                    socket.on(eventName, rawListener);

                    $scope.$on("$destroy", function() {
                        socket.removeListener(eventName, rawListener);
                        rawListener = null;
                    });
                },
                emit: function(eventName,msg){
                    socket.emit(eventName,msg);
                }
            };
        })
    ;

})();