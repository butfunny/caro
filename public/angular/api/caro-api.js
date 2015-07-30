"use strict";

(function () {

    angular.module('caro.api', [
    ])
        .factory("CaroApi", function($http) {
            var counter = 0;
            return {

                getMatchDetail: function(id){
                  return $http.get("/api/caro-room/match/"+id);
                },

                checkWin: function(string,chessboardCaro,x,y){
                    var winCol = function(string,board,x,y){
                        while(board[x][y] == string){
                            x--;
                        }
                        x++;

                        while(board[x][y] == string){
                            counter++;
                            x++;
                        }
                        if(counter == 5) {
                            x--;
                            for (var i = 0; i < 5; i++) {
                                $('#'+x+'_'+y).addClass('win');
                                x--;
                            }
                            counter = 0;
                            return true;
                        } else {
                            counter = 0;
                            return false;
                        }
                    };

                    var  winRow = function(string,board,x,y){
                        while(board[x][y] == string){
                            y--;
                        }
                        y++;

                        while(board[x][y] == string){
                            counter++;
                            y++;
                        }
                        if(counter == 5) {
                            y--;
                            for (var i = 0; i < 5; i++) {
                                $('#'+x+'_'+y).addClass('win');
                                y--;
                            }
                            counter = 0;
                            return true;
                        } else {
                            counter = 0;
                            return false;
                        }
                    };

                    var  winSlashOn = function(string,board,x,y){
                        while (board[x][y] == string){
                            x--;
                            y++;
                        }
                        x++;
                        y--;

                        while(board[x][y] == string){
                            counter++;
                            x++;
                            y--;
                        }
                        if(counter == 5){
                            x--;
                            y++;
                            for (var i = 0; i < 5; i++) {
                                $('#'+x+'_'+y).addClass('win');
                                x--;
                                y++;
                            }
                            counter = 0;
                            return true;
                        } else {
                            counter = 0;
                            return false;
                        }
                    };

                    var winSlashDown = function(string,board,x,y){
                        while (board[x][y] == string){
                            x++;
                            y++;
                        }
                        x--;
                        y--;

                        while(board[x][y] == string){
                            counter++;
                            x--;
                            y--;
                        }

                        if(counter == 5){
                            x++;
                            y++;
                            for (var i = 0; i < 5; i++) {
                                $('#'+x+'_'+y).addClass('win');
                                x++;
                                y++;
                            }
                            counter = 0;
                            return true;
                        } else {
                            counter = 0;
                            return false;
                        }
                    };

                    if(winCol(string,chessboardCaro,x,y) || winRow(string,chessboardCaro,x,y) || winSlashOn(string,chessboardCaro,x,y) || winSlashDown(string,chessboardCaro,x,y)){
                        return true;
                    }else{
                        return false;
                    }

                },
                disabledAllChessBoard: function(){
                    for (var i = 0; i < 16; i++) {
                        for (var j = 0; j < 16; j++) {
                            $('#'+i+'_'+j).attr('ng-disabled',true);
                        }
                    }
                },
                resetChessBoard: function(chessboardCaro,string){
                    for (var i = 0; i < 16; i++) {
                        for (var j = 0; j < 16; j++) {
                            $('#'+i+'_'+j).removeAttr('ng-disabled');
                            $('#'+i+'_'+j).removeClass('win');
                            $('#'+i+'_'+j).empty();
                            chessboardCaro[i][j] = 0;
                        }
                    }
                }
            };
        })
    ;

})();