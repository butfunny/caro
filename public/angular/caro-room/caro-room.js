"use strict";

(function () {

    angular.module('caro.caro-room', [
        'ui.router',
        'caro.common.socket',
        'caro.api'
    ])

        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('caro-room', {
                    url: '/caro-room?matchID',
                    templateUrl: "angular/caro-room/caro-room.html",
                    controller: "caro-room.ctrl"
                })
            ;
        }])

        .controller("caro-room.ctrl", function($scope,CaroApi,$stateParams,$state,User,$socket) {

            if(!User.isLogin){
                $state.go('login');
            }


            CaroApi.getMatchDetail($stateParams.matchID).success(function(info){
                if(info){
                    $scope.matchInfo = info;
                    if(User.nickName == $scope.matchInfo.player1){
                        $scope.yourTurn = true;
                    }else{
                        $scope.yourTurn = false;
                    }
                }else{
                    $state.go('login');
                }


            });


            $scope.winner = "";
            $scope.restart = function(){
                $socket.emit("resetCaroChessBoard",{id: $stateParams.matchID});
                $scope.winner = "";
            };


            $scope.back = function(){
                if(window.confirm("U was playing, do u want go back to chat room?")){
                    $socket.emit("QuitGame",{_id: $stateParams.matchID});
                    $state.go("chat-room");
                }

            };



            $socket.on("quitMatchCaro",$scope,function(MatchInfo){
                if(MatchInfo._id == $stateParams.matchID){
                    alert("Your rival is run awayyyy.....");
                    $state.go('chat-room');
                }
            });







        })


        .directive("caroRoomChat", function($socket,$stateParams,User) {
            return {
                restrict: "E",
                templateUrl: "angular/caro-room/caro-room-chat.html",
                link: function($scope, elem, attrs) {

                    $scope.chat = function () {
                        $socket.emit("CaroChat",{id: $stateParams.matchID,username: User.nickName,message: $scope.message});
                        $scope.message = "";
                    };

                    $scope.mesCaro = [];

                    $socket.on("CaroChat",$scope, function (msg) {
                        if(msg.id == $stateParams.matchID){
                            $scope.mesCaro.push( msg );
                            var elem = document.getElementById('messageBox');
                            elem.scrollTop = elem.scrollHeight;
                        }

                    })
                }
            };
        })


        .directive("caroRoomInfo", function() {
            return {
                restrict: "E",
                scope: {
                    matchInfo: "=" ,
                    yourTurn: "=",
                    winner: "="

                },
                templateUrl: "angular/caro-room/caro-room-info.html",
                link: function($scope, elem, attrs) {

                }
            };
        })


        .directive("caroChessBoard", function($socket,User,CaroApi,$stateParams) {
            return {
                restrict: "E",
                scope: {
                    matchInfo: "=",
                    winner: "=",
                    yourTurn: "="
                },
                templateUrl: "angular/caro-room/caro-chess-board.html",
                link: function($scope, elem, attrs) {
                    var create2DArray = function (x, y) {
                        var array = [];
                        for (var i = 0; i < x; i++) {
                            array.push([]);
                            for (var j = 0; j < y; j++) {
                                array[i].push(0);
                            }
                        }
                        return array;
                    };

                    var createArray = function (x) {
                        var array = [];
                        for (var i = 0; i < x; i++) {
                            array.push(i);

                        }
                        return array;
                    };

                    $scope.chessboardCaro = create2DArray(16,16);
                    $scope.chessboardCaroRows = createArray(16);
                    $scope.chessboardCaroCols = createArray(16);

                    $scope.click = function($event,x,y){
                        if(!$('#'+x+'_'+y).attr('ng-disabled')){
                            if($scope.yourTurn){
                                if(User.nickName == $scope.matchInfo.player1){
                                    $socket.emit("sendPosCaro", {id: $stateParams.matchID, posX: x, posY :y,send: "X",turn: $scope.matchInfo.player2});
                                    $scope.yourTurn = false;
                                }
                                if(User.nickName == $scope.matchInfo.player2){
                                    $socket.emit("sendPosCaro", {id: $stateParams.matchID, posX: x, posY :y,send: "O",turn: $scope.matchInfo.player1});
                                    $scope.yourTurn = false;
                                }

                            }
                        }

                    };


                    $socket.on("getPosCaro",$scope,function(pos){
                        if(pos.id == $stateParams.matchID) {
                            if(pos.send == "X"){

                                $('#'+pos.posX+'_'+pos.posY).html('<i class="fa fa fa-times" style="margin-left: 7px; margin-top: 3px ;font-size: 30px;color: #3e9eff"></i>');
                                $scope.chessboardCaro[pos.posX][pos.posY] = 'X';
                                $scope.$applyAsync(function () {
                                    $('#'+pos.posX+'_'+pos.posY).attr('ng-disabled',true);
                                });

                                if(CaroApi.checkWin("X",$scope.chessboardCaro,pos.posX,pos.posY)){
                                    CaroApi.disabledAllChessBoard();
                                    $scope.winner = $scope.matchInfo.player1;
                                }


                            }
                            if(pos.send == "O"){
                                $('#'+pos.posX+'_'+pos.posY).html('<i class="fa fa-circle-o" style="margin-left: 7px; margin-top: 3px ;font-size: 30px;color: #ff2a08"></i>');
                                $scope.chessboardCaro[pos.posX][pos.posY] = 'O';
                                $scope.$applyAsync(function () {
                                    $('#'+pos.posX+'_'+pos.posY).attr('ng-disabled',true);
                                });

                                if(CaroApi.checkWin("O",$scope.chessboardCaro,pos.posX,pos.posY)){
                                    CaroApi.disabledAllChessBoard();
                                    $scope.winner = $scope.matchInfo.player2;
                                }
                            }


                            if(pos.turn == User.nickName){
                                $scope.yourTurn = true;
                            }

                        }
                    });


                    $socket.on("resetCaroChessBoard",$scope,function(MatchInfo){
                        if(MatchInfo.id == $stateParams.matchID){
                            CaroApi.resetChessBoard($scope.chessboardCaro);
                        }
                    });





                }
            };
        })



    ;

})();